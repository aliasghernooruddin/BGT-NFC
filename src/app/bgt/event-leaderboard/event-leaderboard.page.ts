import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { UtilService } from '../../services/utilService.service';
import { Platform } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { ApisService } from '../../services/apis.service'
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, PatternValidator,  } from '@angular/forms';

import { Network } from '@ionic-native/network/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-event-leaderboard',
  templateUrl: './event-leaderboard.page.html',
  styleUrls: ['./event-leaderboard.page.scss'],
})
export class EventLeaderboardPage implements OnInit {

  
  alertPresent = false
  eventPartList = []
  eventCompList = []
  eventCatList = []
  eventsList = []
  event_id = 0
  event_category_id = 0
  event_competition_id = 0
  showSpinner = false
  loggedInUser = { ItsID: "" , role: "", DivisionID: ""};
  constructor(private authService: AuthenticationService,
    private platform: Platform,
    private network: Network,
    private util: UtilService,
    private route: ActivatedRoute,
    private toast: Toast,
    private localNotifications: LocalNotifications,
    private router: Router,
    private alertController: AlertController,
    private apiservice: ApisService) { 
      this.route.queryParams.subscribe(params => {
      });
      this.platform.ready().then(() => {
        this.handleBackButton()
      })
    }
    
    handleBackButton() {
      this.platform.backButton.subscribeWithPriority(9999, () => {
         if (!this.alertPresent){
            this.presentAlertConfirm()
          }
        })
    }
    convertDate(date) {
      return new Date(date).toLocaleString()
    }

    isConnected(): boolean {
      return true
      let conntype = this.network.type;
      return conntype && conntype !== 'unknown' && conntype !== 'none';
    }

    getCurrentCategories(event_id) {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getEventCategories(event_id).then(res => {
        if (!!res["status"] && res["status"]) {
          this.eventCatList = res["data"]
         } else {
           if(res["code"] == 401) {
             this.authService.logout()
             this.router.navigate(['login'])
           }
         }
  
      }).finally(()=>{
        this.showSpinner = false
      })
    }

    getAdminEvents() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getAdminEvents().then(res => {
        console.log(res)
        if (!!res["status"] && res["status"]) {
          this.eventsList = res["data"]
         } else {
           if(res["code"] == 401) {
             this.authService.logout()
             this.router.navigate(['login'])
           }
         }
  
      }).finally(()=>{
        this.showSpinner = false
      })
    }


    getCurrentCompetitions(event_category_id) {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getEventCompetitions({event_id: this.event_id, event_category_id: event_category_id}).then(res => {
        if (!!res["status"] && res["status"]) {
          this.eventCompList = res["data"]
          this.eventCompList = this.eventCompList.filter((val) => {
            return val.competition_type == "NORMAL"
          })
         } else {
           if(res["code"] == 401) {
             this.authService.logout()
             this.router.navigate(['login'])
           }
         }
  
      }).finally(()=>{
        this.showSpinner = false
      })
    }

    getParticipants(event_competition_id) {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getLeaderboard(event_competition_id).then(res => {
        if (!!res["status"] && res["status"]) {
          this.eventPartList = res["data"]
         } else {
           if(res["code"] == 401) {
             this.authService.logout()
             this.router.navigate(['login'])
           }
         }
  
      }).finally(()=>{
        this.showSpinner = false
      })
    }




    async presentAlertConfirm() {
      this.alertPresent = true
      const alert = await this.alertController.create({
        header: 'Confirm!',
        message: 'Are you sure you want to <strong>Exit</strong> the app?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              this.alertPresent = false
            }
          }, {
            text: 'Yes',
            handler: () => {
              this.alertPresent = false
              navigator["app"].exitApp()
            }
          }
        ]
      });
      await alert.present();
    } 

    round(it) {
      return Math.round(it)
    }
  ngOnInit() {
    this.authService.getToken()
    .then(response => {
      this.loggedInUser = response;
      this.getAdminEvents()
    });
  }


}
