import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class UtilService {


  constructor(private storage: Storage, private plt: Platform) {
  }


  saveQrCode(qrCode) {
    this.storage.set('qrCode', qrCode).then(() => {
        return true
      });
  }

 

  getQrCode() {
    return this.storage.get('qrCode')
  }

  removeQrCode() {
    return this.storage.remove('qrCode').then(() => {
      return true
    });
  }

  saveJudgeSession(data) {
    return this.storage.set('judgesession', data).then(() => {
      
    });
  }


  getJudgeSession() {
    return this.storage.get('judgesession')
  }

  calculateTotal(data) {
    let total = 0
    data.forEach(element => {
      total += element.paymentAmount
    });
    return total
  }

}