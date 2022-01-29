import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Toast } from '@ionic-native/toast/ngx';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toast: Toast,
    private router: Router
  ) {

    this.initializeApp();
  }
 
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.show();
      setTimeout(() => {
        this.splashScreen.hide(); 
        var notificationOpenedCallback = function(jsonData) {
          this.toast.show(JSON.stringify(jsonData), '5000', 'center').subscribe(() => { });
        };
    
        // window["plugins"].OneSignal
        //   .startInit("4bd862d0-29cc-419b-99bf-98843ce08713", "387477629525")
        //   .handleNotificationOpened(notificationOpenedCallback)
        //   .endInit();
      }, 1000);
    });
  }
}