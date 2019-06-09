import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Camera } from '@ionic-native/camera';
import {HttpClientModule} from "@angular/common/http"

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import firebase from 'firebase';

let config = {
  apiKey: "AIzaSyAiNYHVm9DbdZYkQ4fHv9LcHi6UI3_2CRI",
  authDomain: "earnbyfeed.firebaseapp.com",
  databaseURL: "https://earnbyfeed.firebaseio.com",
  projectId: "earnbyfeed",
  storageBucket: "earnbyfeed.appspot.com",
  messagingSenderId: "85959255381"
};
firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true
})

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    Camera,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
