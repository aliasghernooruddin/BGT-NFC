import { Component, OnInit } from '@angular/core';
import { ApisService } from '../../services/apis.service'
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showSpinner = false
  loggedInUser = { email: "", role: ""}
  userInfo = { UserPassword: "", ITS: "" }
  loginData = {
    email: "",
    password: ""
    }
  registerData = {
    ITS: "",
    UserPassword: "",
    Email: "",
    Cell01: "+92",
    Cell02: "+92",
    IMEI: "",
    OSType: ""
  }
  registrationForm = false;

  constructor(private API: ApisService, private authService: AuthenticationService, private router: Router) {

  }

  login() {
    if(!this.loginData.email || !this.loginData.password) {
      alert("Please enter valid Email and Password")
      return
    }
    this.showSpinner = true
    this.loginData["email"] = this.loginData.email.toLowerCase()
    
    this.API.loginUser(this.loginData).then(res => {
      
      if (!!res['status'] && res['status']) {
        this.authService.login(res['data']).then(() => {
          if(res['data'].role == 'ADMIN') {
            this.router.navigate(['menu/eventlisting'])
          } else if (res['data'].role == 'USER') {
            this.router.navigate(['menu/userevents'])
          } else if (res['data'].role == 'JUDGE') {
            this.router.navigate(['menu/judgeevent'])
          }
        })
      } else {
        alert(res["message"])
      }
    }).finally(()=> {
      console.log('here')
      this.showSpinner = false
    })

  }
  ionViewCanEnter() {
    this.checkAuth()
  }
  goToRegisterPage(){
    this.router.navigate(['user-signup'])
  }
  checkAuth() {
    this.authService.authenticationState.subscribe(state => {
      if (!!state) {
        this.authService.getToken().then(user => {
          if (!!user) {
            this.loggedInUser = user
            if(this.loggedInUser.role == 'ADMIN') {
              this.router.navigate(['menu/eventlisting'])
            } else if (this.loggedInUser.role == 'USER') {
              this.router.navigate(['menu/userevents'])
            }
          }
        })
      }
    });
  }
  ngOnInit() {
    this.checkAuth()
  }

}
