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
  selector: 'app-event-details',
  templateUrl: './event-details.page.html',
  styleUrls: ['./event-details.page.scss'],
})
export class EventDetailsPage implements OnInit {

  alertPresent = false
  eventCatsList = []
  eventJudges = []
  userEnrolments = []
  userEnrolmentsOrginal = []
  showSpinner = false
  newEventCategory = true
  eventCategoryCreateForm = {
    name: "",  
    target_face_size_rings: 0,
    target_face_size_distance: 0,
    distance: 0,
    gender: "M",
    event_id:0
  }
  searchUserTerm = ""
  event = { 
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

eventJudgeCreateForm = {
  event_id: 0,
  full_name: "",
  email: "",
  password: "",
  board_no: 0
 }
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
          this.event = this.router.getCurrentNavigation().extras.state.event;
          this.eventCategoryCreateForm.event_id = this.event.id
          this.eventJudgeCreateForm.event_id = this.event.id
          this.getJudges()
          this.getEventCategories()
          this.getUserEnrollments()
        } else {
          this.router.navigate(["menu/eventlisting"])
        }
      });
      this.platform.ready().then(() => {
        this.handleBackButton()
      })
    }
  
    addJudge() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      let isValidated = true;
      for (let key of Object.keys(this.eventJudgeCreateForm)) {
        if (!this.eventJudgeCreateForm[key]) {
          alert("All the fields are required")
          isValidated = false
          break
        }
      }

      if (!isValidated) {
        return;
      }
      this.showSpinner = true

      this.apiservice.addJudge(this.eventJudgeCreateForm).then(res => {
        alert(res["message"])
        this.getJudges()
    }).finally(()=> {
      this.showSpinner = false
    })
    }
    handleBackButton() {
      this.platform.backButton.subscribeWithPriority(9999, () => {
         if (!this.alertPresent){
            this.presentAlertConfirm()
          }
        })
    }
    setUserFiltered() {
      if (!this.searchUserTerm) {
       this.userEnrolments = this.userEnrolmentsOrginal
      }
      this.userEnrolments =  this.userEnrolments.filter(item => {
        return item.user.first_name.toLowerCase().indexOf(this.searchUserTerm.toLowerCase()) > -1;
      });
    }
    convertDate(date) {
      return new Date(date).toLocaleString()
    }

    isConnected(): boolean {
      return true
      let conntype = this.network.type;
      return conntype && conntype !== 'unknown' && conntype !== 'none';
    }

    createNewEventCategory() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      let isValidated = true;
      for (let key of Object.keys(this.eventCategoryCreateForm)) {
        if (!this.eventCategoryCreateForm[key]) {
          alert("All the fields are required")
          isValidated = false
          break
        }
      }

      if (!isValidated) {
        return;
      }
      this.showSpinner = true

      this.apiservice.postEventCategory(this.eventCategoryCreateForm).then(res => {
        alert(res["message"])
        this.getEventCategories()
    }).finally(()=> {
      this.showSpinner = false
    })
    }

    getJudges() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getJudges({event_id: this.event.id}).then(res => {
        if (!!res["status"] && res["status"]) {
          this.eventJudges = res["data"]
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
    updateEvent() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true

      this.apiservice.patchAdminEvent(this.event).then(res => {
        alert(res["message"])
    }).finally(()=> {
      this.showSpinner = false
    })
    }

    editJudge(part) {
      this.editJudgeController(part)
    }
  
    async editJudgeController(part) {
      const alert2 = await this.alertController.create({
        header: 'Edit Judge',
        inputs: [
          {
            id: 'board_no',
            name: 'board_no',
            value:part.board_no,
            type: 'number',
            placeholder: 'Board No'
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
              part.board_no = parseInt(data.board_no)
              this.showSpinner = true
              this.apiservice.updateEventJudge(part).then(res => {
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
      await alert2.present();
    }

    getEventCategories() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getEventCategories(this.event.id).then(res => {
        if (!!res["status"] && res["status"]) {
          this.eventCatsList = res["data"]
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

    markArrive(id) {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      let c = confirm("Are you sure you want to mark arrive this user?")
      if (!c){
        return
      }
      this.showSpinner = true
      this.apiservice.patchEnrolUser({id: id, arrival_time: new Date()}).then(res => {
        alert(res["message"])
        this.getUserEnrollments()
      }).finally(()=>{
        this.showSpinner = false
      })
    }

    getUserEnrollments() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getUserEnrolments(this.event.id).then(res => {
        if (!!res["status"] && res["status"]) {
          this.userEnrolments = res["data"]
          this.userEnrolmentsOrginal = res["data"]
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
    goToEventCat(eventCat) {
      let navigationExtras: NavigationExtras = {
        state: {
          eventCategory: eventCat
        }
      };
      this.router.navigate(['menu/eventcompetition'], navigationExtras);
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

    deleteEventCategory(id) {
      let c = confirm("Are you sure you want to delete "+id.toString()+"?")
      if (!c) {
        return
      }
      this.showSpinner = true
        this.apiservice.deleteEventCategory(id).then(res => {
            alert(res["message"])
            this.getEventCategories()
        }).finally(()=>{
          this.showSpinner = false
        })
  
    }

    deleteEventJudge(id) {
      let c = confirm("Are you sure you want to delete "+id.toString()+"?")
      if (!c) {
        return
      }
      this.showSpinner = true
        this.apiservice.deleteEventJudge(id).then(res => {
            alert(res["message"])
            this.getJudges()
        }).finally(()=>{
          this.showSpinner = false
        })
  
    }

    viewJudge(id) {
      let navigationExtras: NavigationExtras = {
        state: {
          judge_id: id
        }
      };
      this.router.navigate(['menu/judgeevent'], navigationExtras);
    }

  ngOnInit() {
    this.authService.getToken()
    .then(response => {
      this.loggedInUser = response;
    });
  }
}
