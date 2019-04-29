import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


const loginObjectUrl = 'https://qutbifinance.herokuapp.com/getAllUsers?api_key=eca1811f-10d0-4e53-a017-43d78f138792';
const checkLoginUrl = 'https://qutbifinance.herokuapp.com/sessions/create?api_key=eca1811f-10d0-4e53-a017-43d78f138792';
const getEventsUrl = 'https://qutbifinance.herokuapp.com/getAllEvents?api_key=eca1811f-10d0-4e53-a017-43d78f138792';
const getUserDetailsUrl = 'https://qutbifinance.herokuapp.com/getAllMemberContribution?api_key=eca1811f-10d0-4e53-a017-43d78f138792';
const sendDataUrl = 'https://qutbifinance.herokuapp.com/savePayment?api_key=eca1811f-10d0-4e53-a017-43d78f138792';
const receiveDataUrl = 'https://qutbifinance.herokuapp.com/savePayment?api_key=eca1811f-10d0-4e53-a017-43d78f138792';


@Injectable({
  providedIn: 'root'
})


export class ApisService {
  parameters: {};

  constructor(public http: HttpClient) { }

  getLoginObject() {
    return new Promise(resolve => {
      this.http.get(loginObjectUrl).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  postLoginObject(loginObject): Observable<object> {
    return this.http.post(checkLoginUrl, loginObject, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    }).pipe(map(data => {
      return data;
    }));
  }


  getEvents() {
    return new Promise(resolve => {
      this.http.get(getEventsUrl).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  getUserDetails(apiType, id) {
    if (apiType === 'rfid') {
      this.parameters = { rfid: id };
    } else {
      this.parameters = { its: id };
    }
    return this.http.get(getUserDetailsUrl, { params: this.parameters }
    ).pipe(map(data => {
      if (!data['user']) {
        return 'error';
      }
      return data;
    }));
  }


  sendData(sendersDetails): Observable<object> {
    console.log(sendersDetails);
    return this.http.post(sendDataUrl, sendersDetails, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    }).pipe(map(data => {
      return data;
    }));
  }


  receiveData(receiversDetails): Observable<object> {
    return this.http.post(receiveDataUrl, receiversDetails, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    }).pipe(map(data => {
      return data;
    }));
  }
}
