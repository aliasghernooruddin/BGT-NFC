import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service'
import { Router } from '@angular/router';
import { ApisService } from '../../services/apis.service'
import { Toast } from '@ionic-native/toast/ngx'
import { NFC } from '@ionic-native/nfc';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  eventDetails = null
  userDetails = null
  show: boolean = false
  collectorsObject = null
  type = null
  id = null
  nfc = null

  submitDetails = {
    paymentName: null,
    paymentDescription: null,
    paymentAmount: null,
  }

  sendDetails = {
    paymentName: this.submitDetails.paymentName,
    paymentType: 'CASH',
    paymentDescription: this.submitDetails.paymentDescription,
    destination: this.collectorsObject,
    paymentAmount: this.submitDetails.paymentAmount,
    receivedBy: this.collectorsObject,
    timestamp: new Date().getTime(),
    id: null,
    received: true,
    sent: false
  }

  receiveDetails = {
    paymentName: this.submitDetails.paymentName,
    paymentType: 'CASH',
    paymentDescription: this.submitDetails.paymentDescription,
    destination: this.userDetails,
    paymentAmount: this.submitDetails.paymentAmount,
    receivedBy: this.collectorsObject,
    timestamp: new Date().getTime(),
    id: null,
    received: false,
    sent: true
  }

  constructor(private authService: AuthenticationService, 
              private router: Router, 
              private api: ApisService, 
              private toast: Toast) { }


  addListenNFC() {
    NFC.addTagDiscoveredListener(nfcEvent => this.sesReadNFC(nfcEvent.tag)).subscribe(data => {
        if (data && data.tag && data.tag.id) {
            let tagId = NFC.bytesToHexString(data.tag.id);
            if (tagId) {
                this.id = tagId;
            } else {
                this.toast.show('NFC_NOT_DETECTED', '5000', 'center').subscribe();
            }
        }
    });
}


sesReadNFC(data): void {
  this.toast.show('NF OWRKING', '5000', 'center').subscribe(
    toast => {
      console.log(toast);
    }
  );
}


  clickMe() {
    this.type = 'its'
    this.id = 40496185
    this.api.getUserDetails(this.type,this.id)
      .subscribe(response => {
        this.userDetails = response
        this.sendDetails['id'] = this.userDetails['id']
        this.show = true
      })
  }


  onSubmit() {
    this.api.sendData(this.sendDetails)
      .subscribe(response => {
        this.toast.show("Posted", '5000', 'center')
      })
    this.api.receiveData(this.receiveDetails)
      .subscribe(response => {
        this.toast.show("Posted", '5000', 'center')
      })
  }


  ngOnInit() {
    this.api.getEvents()
      .then(response => {
        this.eventDetails = response
      })

    this.authService.getToken()
      .then(response => {
        this.collectorsObject = response
        this.receiveDetails['id'] = this.collectorsObject['id']
      })

      this.nfc = this.authService.hasNFC

  }


  logout() {
    this.authService.logout()
    this.router.navigate(['login'])
  }
}
