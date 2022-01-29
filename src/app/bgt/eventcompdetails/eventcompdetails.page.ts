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
  selector: 'app-eventcompdetails',
  templateUrl: './eventcompdetails.page.html',
  styleUrls: ['./eventcompdetails.page.scss'],
})
export class EventcompdetailsPage implements OnInit {

  alertPresent = false
  userEnrolList = []
  eventJudges = []
  eventPartList = []
  eventCompList = []
  showSpinner = false
  showParticipants = false
  newEventCategory = false
  eventParticipantCreateForm = {
   user_id: 0,
   event_competition_id: 0,
  }

  eventAssignPartForm = {
    pre_event_competition_id: 0
  }

  eventCompDetails = {
    id:0,
    name: "",
    top_selection: "0",
    level:"0",
    competition_type:"",
    event_id: 0,
    event_category_id: 0
  }
  event = {id: 0, name: "", no_of_boards:0, no_of_player_in_board:0, no_of_slots:0, player_in_slot: 0, event_category: {id:0}}
  eventCategory = {id: 0, name: "", gender: ""}
  
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
          this.eventCompDetails = this.router.getCurrentNavigation().extras.state.eventCompDetails;
          this.eventCompDetails.top_selection = this.eventCompDetails.top_selection.toString()
          this.eventCompDetails.level = this.eventCompDetails.level.toString()
          console.log(this.eventCompDetails)
          this.eventParticipantCreateForm.event_competition_id = this.eventCompDetails.id
          this.event = this.eventCompDetails["event"]
          console.log(this.event)
          delete this.eventCompDetails["event"]
          this.eventCategory = this.eventCompDetails["event_category"]
          delete this.eventCompDetails["event_category"]
          this.getParticipants({event_competition_id: this.eventCompDetails.id})
         
          this.getEventCompetitions({event_id: this.event.id, event_category_id: this.eventCategory.id})
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

    assignParticipants() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      let c = confirm("Are you sure you want to assign participants?")
      if (!c) {
        return
      }
      this.showSpinner = true
      this.apiservice.postEventParticipants({event_competition_id: this.eventCompDetails.id, pre_event_competition_id: this.eventAssignPartForm.pre_event_competition_id}).then(res => {
        alert(res["message"])
        this.getParticipants({event_competition_id: this.eventCompDetails.id})
        this.eventPartList = res["data"]
    }).finally(()=> {
      this.showSpinner = false
    })
    }


    updateEventCompetition() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }

      this.showSpinner = true

      this.apiservice.patchEventCompetition(this.eventCompDetails).then(res => {
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
          this.eventCompList = this.eventCompList.filter((val) => {
            return val.id != this.eventCompDetails.id
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

    getParticipants(query) {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getEventParticipants(query).then(res => {
        if (!!res["status"] && res["status"]) {
          this.eventPartList = res["data"]
          let totalPart = this.eventPartList.length
          this.event.player_in_slot = this.event.no_of_boards * this.event.no_of_player_in_board
          this.event.no_of_slots = Math.round(totalPart / this.event.player_in_slot)
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

    updateRanks() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      let c = confirm("Are you sure want to update the rank? Any updated ranks will be gone")
      if (!c) {
        return
      }
      this.showSpinner = true
      this.apiservice.updateRanks({event_competition_id: this.eventCompDetails.id}).then(res => {
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


    goToEventComp(eventComp) {
      let navigationExtras: NavigationExtras = {
        state: {
          eventCompetition: eventComp
        }
      };
      this.router.navigate(['menu/eventcompdetails'], navigationExtras);
    }
  

    editParticipant(part) {
      this.editParticipantController(part)
    }
  
    async editParticipantController(part) {
      const alert1 = await this.alertController.create({
        header: 'Edit Participant '+part.user.first_name,
        subHeader: 'Please update Slot No (first), Board No (second) and Rank (third)',
        inputs: [
          {
            id: 'slot_no',
            name: 'slot_no',
            value:part.slot_no,
            type: 'number',
            label: "Slot No",
            placeholder: 'Slot No'
          },

          {
            id: 'board_no',
            name: 'board_no',
            value:part.board_no,
            type: 'number',
            placeholder: 'Board No'
          },
          {
            id: 'rank',
            name: 'rank',
            value:part.rank,
            type: 'number',
            label: "Rank",
            placeholder: 'Rank'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
            }
          }, {
            text: 'Submit',
            handler: (data) => {
              part.board_no = parseInt((data.board_no || 0))
              part.slot_no = parseInt((data.slot_no || 0))
              part.rank = parseInt((data.rank || 0))
              this.showSpinner = true
              this.apiservice.updateEventParticipants(part).then(res => {
                if (!!res["status"] && res["status"]) {
                  alert(res["message"])
                }
          
              }).finally(()=>{
                this.showSpinner = false
              })
            }
          }
        ]
      });
      await alert1.present();
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
    moveBack() {
      let navigationExtras: NavigationExtras = {
        state: {
          eventCategory: this.eventCategory
        }
      };
      this.router.navigate(['menu/eventcompetition'], navigationExtras);
    }

    viewParticipant(part) {
      this.event.event_category = this.eventCategory
      let navigationExtras: NavigationExtras = {
        state: {
          event: this.event,
          user_id: part.user.id
        }
      };
      this.router.navigate(['menu/usereventdetails'], navigationExtras);
    }


  ngOnInit() {
    this.authService.getToken()
    .then(response => {
      this.loggedInUser = response;
    });
  }

}
