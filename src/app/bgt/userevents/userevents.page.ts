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
  selector: 'app-userevents',
  templateUrl: './userevents.page.html',
  styleUrls: ['./userevents.page.scss'],
})
export class UsereventsPage implements OnInit {

  alertPresent = false
  eventsList = []
  eventsCatList = []
  showSpinner = false
  newEventForm = false
  eventEnrolForm = {
    event_id: "0",
    event_category_id: "0",
    bring_bow: "false"
  }
  selectedCategory = {
    id: 0,
    name: "",  
    target_face_size_rings: 0,
    target_face_size_distance: 0,
    distance: 0,
    gender: "M"
  }
  selectedEvent = {
    id: 0,
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

    eventEnrol() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      let isValidated = true;
      for (let key of Object.keys(this.eventEnrolForm)) {
        if (!this.eventEnrolForm[key]) {
          alert("All the fields are required")
          isValidated = false
          break
        }
      }

      if (!isValidated) {
        return;
      }
      let obj = {
        event_id: parseInt(this.eventEnrolForm.event_id),
        event_category_id: parseInt(this.eventEnrolForm.event_category_id),
      }
      if (this.eventEnrolForm.bring_bow == 'true'){
        obj["bring_bow"] = true
      } else {
        obj["bring_bow"] = false
      }

      this.showSpinner = true

      this.apiservice.postEnrolUser(obj).then(res => {
        alert(res["message"])
        this.getEvents()
      }).finally(()=> {
        this.showSpinner = false
      })
    }

    getEvents() {
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

    getCatDetails(cat_id) {
      this.selectedCategory = this.eventsCatList.filter((val) => {
        return val.id == parseInt(cat_id)
      })[0]
    }
    getEventCategories(event_id) {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.selectedEvent = this.eventsList.filter((val) => {
        return val.id == parseInt(event_id)
      })[0]
      this.selectedCategory = {
        id: 0,
        name: "",  
        target_face_size_rings: 0,
        target_face_size_distance: 0,
        distance: 0,
        gender: "M"
      }
      this.showSpinner = true
      this.apiservice.getEventCategories(event_id).then(res => {
        console.log(res)
        if (!!res["status"] && res["status"]) {
          this.eventsCatList = res["data"]
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

    viewCompetitions(event) {
      let navigationExtras: NavigationExtras = {
        state: {
          event: event
        }
      };
      this.router.navigate(['menu/usereventdetails'], navigationExtras);
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
      this.getEvents()
    });
  }

}
