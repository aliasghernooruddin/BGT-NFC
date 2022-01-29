import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicSelectableModule } from 'ionic-selectable';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
// import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Toast } from '@ionic-native/toast/ngx'
import { SMS } from '@ionic-native/sms/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FilterPipe } from './bgt/filter.pipe';
import { Base64 } from '@ionic-native/base64/ngx'

@NgModule({
  declarations: [AppComponent, FilterPipe],
  entryComponents: [],

  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    IonicSelectableModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })],

  providers: [
    StatusBar,
    SplashScreen,
    Toast,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // AndroidPermissions,
    // QRScanner,
    BarcodeScanner,
    HTTP,
    Network,
    Base64,
    FileOpener,
    FileTransfer,
    PDFGenerator,
    File,
    InAppBrowser,
    SMS,
    LocalNotifications
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
