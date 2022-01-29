import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { UtilService } from '../../services/utilService.service';
import { Platform } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { ApisService } from '../../services/apis.service'
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, PatternValidator,  } from '@angular/forms';

import { Network } from '@ionic-native/network/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-event-listing',
  templateUrl: './event-listing.page.html',
  styleUrls: ['./event-listing.page.scss'],
})
export class EventListingPage implements OnInit {
  alertPresent = false
  eventsList = []
  showSpinner = false
  newEventForm = false
  eventCreateForm = {
    name: "",  
    no_of_arrows: 0,
    no_of_rounds: 0,
    no_of_boards: 0,
    no_of_player_in_board: 0,
    description: "",
    event_start_date: "",
    event_state: "READY"
  }
  loggedInUser = { ItsID: "" , role: "", DivisionID: ""};
  constructor(private authService: AuthenticationService,
    private platform: Platform,
    private network: Network,
    private util: UtilService,
    private toast: Toast,
    private localNotifications: LocalNotifications,
    private router: Router,
    private alertController: AlertController,
    private apiservice: ApisService) { 
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
    

    createNewEvent() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      let isValidated = true;
      for (let key of Object.keys(this.eventCreateForm)) {
        if (!this.eventCreateForm[key]) {
          alert("All the fields are required")
          isValidated = false
          break
        }
      }

      if (!isValidated) {
        return;
      }
      this.showSpinner = true

      this.apiservice.postAdminEvent(this.eventCreateForm).then(res => {
        alert(res["message"])
        this.getAdminEvents()
    }).finally(()=> {
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

    goToEvent(event) {
      let navigationExtras: NavigationExtras = {
        state: {
          event: event
        }
      };
      this.router.navigate(['menu/eventdetails'], navigationExtras);
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
  ngOnInit() {
    this.authService.getToken()
    .then(response => {
      this.loggedInUser = response;
      this.getAdminEvents()
    });
  }

  deleteEvent(id) {
    let c = confirm("Are you sure you want to delete "+id.toString()+"?")
    if (!c) {
      return
    }
    this.showSpinner = true
      this.apiservice.deleteEvent(id).then(res => {
          alert(res["message"])
          this.getAdminEvents()
      }).finally(()=>{
        this.showSpinner = false
      })

  }

}
