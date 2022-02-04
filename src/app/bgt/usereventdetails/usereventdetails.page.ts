import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { UtilService } from '../../services/utilService.service';
import { Platform } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { ApisService } from '../../services/apis.service'
import { File } from '@ionic-native/file/ngx';

import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, PatternValidator,  } from '@angular/forms';
import { Network } from '@ionic-native/network/ngx';
import { jsPDF } from "jspdf";
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import autoTable from 'jspdf-autotable'
import { Base64 } from '@ionic-native/base64/ngx'

@Component({
  selector: 'app-usereventdetails',
  templateUrl: './usereventdetails.page.html',
  styleUrls: ['./usereventdetails.page.scss'],
})

export class UsereventdetailsPage implements OnInit {

  @ViewChild('pdfReport') pdfReport: ElementRef;
  alertPresent = false
  eventCompList = []
  eventScoresList = []
  showSpinner = false
  totalScore = 0
  newEventCategory = false
  selectedComp = {id: 0}
event = {id: 0, event_category: {id: 0, name:0},name: "", no_of_rounds:0, no_of_arrows:0 } 
  user_id = 0
  loggedInUser = { id: 0};

  constructor(
    private fileU: File,
    private authService: AuthenticationService,
    private platform: Platform,
    private network: Network,
    private util: UtilService,
    private base64: Base64,
    private pdfGenerator: PDFGenerator,
    private route: ActivatedRoute,
    private toast: Toast,
    private router: Router,
    private alertController: AlertController,
    private apiservice: ApisService) { 
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation() && this.router.getCurrentNavigation().extras.state) {
          this.event = this.router.getCurrentNavigation().extras.state.event;
          this.user_id = (this.router.getCurrentNavigation().extras.state.user_id);
        } 
        console.log(this.event, this.user_id)
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

    getCompScores(id) {
      if(!this.isConnected()) {
        alert("Please connect to internet and then continue")
        return
      }
      this.showSpinner = true
      this.apiservice.getEventsScores({event_competition_id: parseInt(id), user_id: this.user_id}).then(res => {
        if (!!res["status"] && res["status"]) {
          this.eventScoresList = res["data"]
          this.eventScoresList.forEach((val) => {
            this.totalScore += val.points
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

    downloadReport() {
      var doc = new jsPDF("p", "pt", "letter");
      doc.setFont("times");
      doc.setTextColor("black");
      doc.setFontSize(12);
      
      let docHeaderText1 = `Archery Event Name: ${this.event.name} `
      let docHeaderText2 = `Category: ${this.event.event_category.name}`
      let docHeaderText3 = `Archer Name: ${this.eventScoresList[0].event_participant.user.first_name} ${this.eventScoresList[0].event_participant.user.last_name}`
      let docHeadertext5 = `Total Score: ${this.totalScore}`
      let docHeadertext4 = `Rank: ${this.eventScoresList[0].event_participant.rank}`
      let str = []
      str.push(docHeaderText1)

      str.push(docHeaderText2)
      str.push("")
      str.push(docHeaderText3)
      str.push("")
      str.push(docHeadertext4)
      str.push(docHeadertext5)

      
      // var imgData = 'data:image/jpeg;base64,'+ this.base64.encodeFile('');
      var img = new Image();
      var src = "../../assets/img/letterheadanb.png";
      img.src = src;
      doc.addImage(img, 'JPEG', 1, 10, 620, 120);
      console.log(img)
      let header = ['Round'] 
      for(let i=1; i<this.event.no_of_arrows+1;i++) {
        header.push(`Arrow # ${i}`)
      }
     
      header.push('Total')
      header.push('Average')
      let head = [header]
      let data = []
      let totalAvg = 0
      // [[round, arrow1, arrow2, arrow3, total, average]]
      for(let i=1; i<this.event.no_of_rounds+1;i++) {
        let d = []
        d.push(i)
        let tSc = 0
        this.eventScoresList.forEach((score) => {
          if (score.round_no == i) {
            if(score.is_10_x) {
              d.push("10X")
            }
            else {
              d.push(score.points)
            }
            tSc += score.points
          }
        })
        d.push(tSc)
        let avg = tSc / this.event.no_of_arrows
        totalAvg +=avg
        d.push(`${avg.toFixed(2)} %`)
        data.push(d)
      }
      str.push(`Total Average: ${totalAvg.toFixed(2)} %`)
      str.push("")


      doc.text(str, 40, 175, {align: "left"})

      doc.text("Score Summary:", 40, 310, {align: "left"})
      let header2 = []
      header2.push('M')
      for(let i=1; i<=10;i++) {
        header2.push(i)
      }
      header2.push("10X")
      
      let head2 = [header2]
      let d2 = []
      this.eventScoresList.forEach((score) => {
         if (score.is_10_x) {
          if (!d2[11]) {
            d2[11] = 0
          }
          d2[11] +=1

         } else {
          if (!d2[score.points]) {
            d2[score.points] = 0
          }
          d2[score.points] +=1
        }
      })
      let data2 = [d2]
      autoTable(doc, {
        styles: { halign: 'center' },
        margin: { top: 10 },
          head: head2,
          body: data2,
          startY: 320,
          didDrawCell: (data) => {
          console.log(data.column.index)
          },
      })

      doc.text("Score Sheet:", 40, 410, {align: "left"})
      autoTable(doc, {
        styles: { halign: 'center' },
        margin: { top: 10 },
          head: head,
          body: data,
          startY: 420,
          didDrawCell: (data) => {
          console.log(data.column.index)
          },
      })

      var img = new Image();
      var src = "../../assets/img/footer.png";
      img.src = src;
      doc.addImage(img, 'JPEG', 208, 722, 200, 67);
      let fileName = `${this.eventScoresList[0].event_participant.user.first_name}_${this.eventScoresList[0].event_participant.user.last_name}_${this.event.event_category.name}.pdf`
      doc.save(fileName);
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
      if (!this.user_id) {
        this.user_id = this.loggedInUser.id
      }
      console.log(this.user_id)
      this.getEventCompetitions({event_id: this.event.id, event_category_id: this.event.event_category.id})

    });
  }

}
