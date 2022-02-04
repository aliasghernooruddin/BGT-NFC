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
  selector: 'app-judgeevent',
  templateUrl: './judgeevent.page.html',
  styleUrls: ['./judgeevent.page.scss'],
})
export class JudgeeventPage implements OnInit {

  alertPresent = false
  judgeEventList = []
  eventCatList = []
  event_competition = {}
  event_category : any
  eventCompList = []
  hideScore = true
  eventScores = []
  round_in_comp = []
  arrow_no = 0
  showSpinner = false
  currentUsersList = []
  score = { total_score: 0}
  selectedUser = {user: {id: 0}}
  current_user_id = 0
  round_no = 0

  currentScore = {arrow_no:0, id: 0, points:0, index: 0, is_10_x: false}
  selectedBoard = {board_no: 0 , event: {no_of_rounds: 0} }
  
  event_id=0
  event_competition_id = 0
  event_category_id=0
  event = {id: 0, name: ""}
  loggedInUser = { id:0};
  judge_id = 0
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
        if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state && !!this.router.getCurrentNavigation().extras.state.judge_id) {
          this.judge_id = this.router.getCurrentNavigation().extras.state.judge_id
        } 
        if (!!this.judge_id) {
          this.getJudgeEvents()
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

    getCurrentCategories(event_id) {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.hideScore = true
      this.event_id=event_id
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

    getCurrentCompetitions(event_category_id) {
      this.event_category =  this.eventCompList.filter((val) => {
        return val.id == parseInt(event_category_id)
      })
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.hideScore = true
      this.showSpinner = true
      this.apiservice.getEventCompetitions({event_id: this.event_id, event_category_id: event_category_id}).then(res => {
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

    getCurrentUsers(event_competition_id) {
     this.event_competition =  this.eventCompList.filter((val) => {
        return val.id == parseInt(event_competition_id)
      })
      this.selectedBoard = this.judgeEventList.filter((val) => {
        console.log(val, this.event)
        return val.event.id == this.event_id
      })[0]
      
      if (!this.selectedBoard) {
        return 
      }
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.hideScore = true
      this.showSpinner = true
      this.apiservice.getCurrentSlot({board_no:this.selectedBoard.board_no, event_competition_id: parseInt(event_competition_id) }).then(res => {
        if (!!res["status"] && res["status"]) {
          this.currentUsersList = res["data"]
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

    getTotalScore() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getEventsScores({event_competition_id:this.event_competition_id, user_id:this.selectedUser.user.id }).then(res => {
        if (!!res["status"] && res["status"]) {
          let users = res["data"]
          this.score.total_score = 0
          users.forEach(element => {
            this.score.total_score += element.points
          });
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


    getCurrentScore(current_user_id, round) {
      this.selectedUser = this.currentUsersList.filter((val) => {
        return val.user.id == parseInt(current_user_id)
      })[0]
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.hideScore = true
      this.showSpinner = true
      this.arrow_no = 0
      this.apiservice.getEventsScores({event_competition_id:this.event_competition_id, user_id:this.selectedUser.user.id, round_no:round }).then(res => {
        if (!!res["status"] && res["status"]) {
          this.eventScores = res["data"]
          this.getTotalScore()
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


    showGame(arrow_no, index) {
      this.currentScore = this.eventScores.filter((val) => {
        return val.id == parseInt(arrow_no)
      })[0]
      this.currentScore.index = index
      this.hideScore = false
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
    }

    getJudgeEvents() {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getJudgeEvents(this.judge_id).then(res => {
        if (!!res["status"] && res["status"]) {
          this.judgeEventList = res["data"]
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

    saveRound() {
      let c1 = confirm("Are you sure you want to save this round score??")
      if(!c1) {
        return
      }
      let c2 = confirm("As an opponent are you satisfy with the score??")
      if(!c2) {
        return
      }

      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.eventScores.forEach((sc) => {
        this.apiservice.markScore({points: sc.points, board_judge_id: this.judge_id, approval_from: "Opponent"}, sc.id).then(res => {
          if (!!res["status"] && res["status"]) {
           } 
    
        }).finally(()=>{
        })
      })
      alert("Scores saved successfully!")
      if (this.round_no < this.round_in_comp.length){
        this.round_no = parseInt(this.round_no.toString())+ 1
      }
      setTimeout(()=> {
        this.getTotalScore()
      }, 3000)
    }
    Scorepoints(point) {
      if (point == 10.1 || point == "10.1") {
        this.eventScores[this.currentScore.index].is_10_x = true 
        this.currentScore.is_10_x = true
        point = 10
      }
      this.eventScores[this.currentScore.index].points = point 
      this.currentScore.points = point
    }

    saveSession() {
      let session = {
        judgeEventList: this.judgeEventList,
        eventCatList: this.eventCatList,
        event_competition: this.event_competition,
        event_category: this.event_category,
        eventCompList: this.eventCompList,
        hideScore: this.hideScore,
        eventScores: this.eventScores,
        round_in_comp: this.round_in_comp,
        arrow_no: this.arrow_no,
        showSpinner: this.showSpinner,
        currentUsersList: this.currentUsersList,
        score: this.score,
        selectedUser: this.selectedUser,
        current_user_id: this.current_user_id,
        round_no: this.round_no,
        currentScore: this.currentScore,
        selectedBoard: this.selectedBoard,
        event_id: this.event_id,
        event_competition_id: this.event_competition_id,
        event_category_id: this.event_category_id,
        event : this.event
      }
      this.util.saveJudgeSession(session)
      alert("Session Saved")
    }
    loadSession() {
      this.util.getJudgeSession().then((data) => {
        if (!data) {
          alert("No current session saved")
          return
        } 

      this.judgeEventList = data.judgeEventList
      this.eventCatList = data.eventCatList
      this.event_competition = data.event_competition
      this.event_category = data.event_category
      this.eventCompList= data.eventCompList
      this.hideScore = data.hideScore
      this.eventScores = data.eventScores
      this.round_in_comp = data.round_in_comp
      this.arrow_no = data.arrow_no
      this.showSpinner = data.showSpinner
      this.currentUsersList = data.currentUsersList
      this.score = data.score
      this.selectedUser = data.selectedUser
      this.current_user_id = data.current_user_id
      this.round_no = data.round_no
      this.currentScore = data.currentScore
      this.selectedBoard = data.selectedBoard
      this.event_id = data.event_id
      this.event_competition_id = data.event_competition_id
      this.event_category_id = data.event_category_id
      this.event = data.event

      })
    }

    getRounds() {
      this.hideScore = true
      this.arrow_no = 0
      this.round_no = 0
      this.eventScores = []
      this.currentScore = {arrow_no:0, id: 0, points:0, index:0, is_10_x:false}
      this.round_in_comp =  Array(this.selectedBoard.event.no_of_rounds).fill(1).map((x,i)=>i + 1)
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
      if (!this.judge_id) {
        this.judge_id = this.loggedInUser.id
        this.getJudgeEvents()
      }

    });
  }

}
