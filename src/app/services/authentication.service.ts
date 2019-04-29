import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { NFC, Ndef } from '@ionic-native/nfc';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
 
  authenticationState = new BehaviorSubject(false);
  NFCstate = new BehaviorSubject(false);

  constructor(private storage: Storage, private plt: Platform) { 
    this.plt.ready().then(() => {
      this.checkNFC();
      this.checkToken();
    });
  }
 

  checkNFC(){
    NFC.enabled().then(() =>{
      this.NFCstate.next(true)
    })
  }

  hasNFC(){
    return this.NFCstate.value;
  }

  checkToken() {
    this.storage.get('collectorObject').then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }
 
  login(collectorObject) {
    return this.storage.set('collectorObject', collectorObject).then(() => {
      this.authenticationState.next(true);
    });
  }
 
  logout() {
    return this.storage.remove('collectorObject').then(() => {
      this.authenticationState.next(false);
    });
  }
 
  isAuthenticated() {
    return this.authenticationState.value;
  }

  getToken(){
    return this.storage.get('collectorObject')
  }
 
}