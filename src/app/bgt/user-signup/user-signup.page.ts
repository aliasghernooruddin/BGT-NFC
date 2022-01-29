import { Component, OnInit } from '@angular/core';
import { ApisService } from '../../services/apis.service'
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.page.html',
  styleUrls: ['./user-signup.page.scss'],
})
export class UserSignupPage implements OnInit {
  showSpinner = false
  loggedInUser = { email: "", role: ""}
  userInfo = { UserPassword: "", ITS: "" }
  signupData = {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    mobile_no:  "",
    cnic: "",
    gender: "",
    dob: "",
    archery_years: "",
    education: "",
    club_name: ""
  }


  constructor(private API: ApisService, private authService: AuthenticationService, private router: Router) {

  }

  validateEmail(email) {
    return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  }
  
  register() {
    console.log(this.signupData)
    let isValidated = true;
    for (let key of Object.keys(this.signupData)) {
      if (!this.signupData[key]) {
        alert("All the fields are required")
        isValidated = false
        break
      }
    }

    if (!isValidated) {
      return;
    }
    if (!this.validateEmail(this.signupData.email)) {
      alert("Please provide a valid email address")
      return
    }

    if(this.signupData.password !== this.signupData.confirm_password) {
      alert("Please provide a valid password")
      return
    }

    delete this.signupData["confirm_password"]

    this.signupData["email"] = this.signupData.email.toLowerCase()

    this.showSpinner = true

    this.API.postSignup(this.signupData).then(res => {
        alert(res["message"])
    }).finally(()=> {
      this.showSpinner = false
      this.goToLogin()
    })

  }

  ionViewCanEnter() {
    this.checkAuth()
  }
  goToLogin(){
    this.router.navigate(['login'])
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
