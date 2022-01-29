import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ApisService } from '../../services/apis.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  pages = [


  ];
  loggedInUser = { id: 0, first_name: "", last_name: "", role: ""}
  constructor(private authService: AuthenticationService,
    private api: ApisService,
    private router: Router,
    private alertController: AlertController,
    private localNotifications: LocalNotifications,
    private fileOpener: FileOpener,
    private transfer: FileTransfer, private file: File) { }

  fileTransfer: FileTransferObject = this.transfer.create();


  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to <strong>Logout & Exit</strong> the app?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {

          }
        }, {
          text: 'Yes',
          handler: () => {
            this.authService.logout().then(res => {
              navigator["app"].exitApp()
            })
          }
        }
      ]
    });

    await alert.present();
  }
  openLink() {
    let url = "https://5cube.io"
    window.open(url, '_blank', 'location=no');
  }

  logout() {
    this.presentAlertConfirm()
    
  }
  generateReportFmb() {
    const url = 'https://amfakhriyahadmin.herokuapp.com/generateReport?api_key=2e2921a4-c741-4148-8341-0e3cbceb6720&eventId=5f590abde7179a2f18dee681';
    this.fileTransfer.download(url, this.file.externalDataDirectory + 'fmb-report-file.xlsx').then((entry) => {
      this.localNotifications.schedule([{
        id: 1,
        title: "Report Generated",
        text: "Report has been generated successfully " + entry.toURL()
        }])
      console.log('download complete: ' + entry.toURL());
      this.fileOpener.showOpenWithDialog(entry.toURL(), "application/vnd.ms-excel")
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error opening file', e));

    }, (error) => {
      alert("Failed to download the file due to " + error)
    });
  }
  
  ngOnInit() {
    this.authService.getToken()
      .then(response => {
        if (!response) {
          this.router.navigate(['login'])
        }
        this.loggedInUser = response;
        if (this.loggedInUser.role === 'ADMIN') {
          this.pages.push(
            {
              title: 'Home',
              url: '/menu/eventlisting',
              button: "",
              icon: 'home'
            }
          )
        } else if (this.loggedInUser.role === 'USER') {
          this.pages.push(
            {
              title: 'Home',
              url: '/menu/userevents',
              button: "",
              icon: 'home'
            }
          )
        } else if(this.loggedInUser.role === 'JUDGE') {
          this.pages.push(
            {
              title: 'Home',
              url: '/menu/judgeevent',
              button: "",
              icon: 'home'
            }
          )
        }
        this.pages.push(
          {
            title: 'Leaderboard',
            url: '/menu/eventleaderboard',
            button: "",
            icon: 'analytics'
          }
        )
        this.pages.push(
          {
            title: 'Logout',
            url: "",
            button: 'logout()',
            icon: 'log-out'
            }
        )

      });

  }

}
