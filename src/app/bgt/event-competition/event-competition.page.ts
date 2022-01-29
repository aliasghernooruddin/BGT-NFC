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
  selector: 'app-event-competition',
  templateUrl: './event-competition.page.html',
  styleUrls: ['./event-competition.page.scss'],
})
export class EventCompetitionPage implements OnInit {

  alertPresent = false
  eventCompList = []
  showSpinner = false
  newEventCompetition = false
  eventCompetitionCreateForm = {
   name: "",
   top_selection: "0",
   level:0,
   competition_type:0,
   event_id: 0,
   event_category_id: 0
  }
  eventCat = {
    id: 0, 
    name: "",  
    target_face_size_rings: 0,
    target_face_size_distance: 0,
    distance: 0,
    gender: "M"
  }
  event = {id: 0, name: ""}
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
        if (this.router.getCurrentNavigation().extras.state) {
          this.eventCat = this.router.getCurrentNavigation().extras.state.eventCategory;
          console.log(this.eventCat)
          this.eventCompetitionCreateForm.event_category_id = this.eventCat.id
          this.event = this.eventCat["event"]
          delete this.eventCat["event"]
          this.eventCompetitionCreateForm.event_id = this.event.id
          this.getEventCompetitions({event_id: this.event.id, event_category_id: this.eventCat.id})
        } else {
          this.router.navigate(["menu/eventlisting"])
        }
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

    createNewEventCompetition() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      let isValidated = true;
      for (let key of Object.keys(this.eventCompetitionCreateForm)) {
        if (!this.eventCompetitionCreateForm[key]) {
          alert("All the fields are required")
          isValidated = false
          break
        }
      }

      if (!isValidated) {
        return;
      }
      this.showSpinner = true

      this.apiservice.postEventCompetition(this.eventCompetitionCreateForm).then(res => {
        alert(res["message"])
        this.getEventCompetitions({event_id: this.event.id, event_category_id: this.eventCat.id})
    }).finally(()=> {
      this.showSpinner = false
    })
    }

    updateEventCategory() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      let isValidated = true;
      for (let key of Object.keys(this.eventCat)) {
        if (!this.eventCat[key]) {
          alert("All the fields are required")
          isValidated = false
          break
        }
      }

      if (!isValidated) {
        return;
      }
      this.showSpinner = true

      this.apiservice.patchEventCategory(this.eventCat).then(res => {
        alert(res["message"])
    }).finally(()=> {
      this.showSpinner = false
    })
    }

    getEventCompetitions(query) {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getEventCompetitions(query).then(res => {
        if (!!res["status"] && res["status"]) {
          this.eventCompList = res["data"]
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

    goToEventComp(eventComp) {
      let navigationExtras: NavigationExtras = {
        state: {
          eventCompDetails: eventComp
        }
      };
      this.router.navigate(['menu/eventcompdetails'], navigationExtras);
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

    deleteEventCompetition(id) {
      let c = confirm("Are you sure you want to delete "+id.toString()+"?")
      if (!c) {
        return
      }
      this.showSpinner = true
        this.apiservice.deleteEventCompetition(id).then(res => {
            alert(res["message"])
            this.getEventCompetitions({event_id: this.event.id, event_category_id: this.eventCat.id})
        }).finally(()=>{
          this.showSpinner = false
        })
  
    }
    

    moveBack() {
      let navigationExtras: NavigationExtras = {
        state: {
          event: this.event
        }
      };
      this.router.navigate(['menu/eventdetails'], navigationExtras);
    }
  ngOnInit() {
    this.authService.getToken()
    .then(response => {
      this.loggedInUser = response;
    });
  }
}
