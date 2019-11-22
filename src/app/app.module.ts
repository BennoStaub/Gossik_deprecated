import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Push } from '@ionic-native/push';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { firebaseConfig } from './firebase.credentials';

import { NgCalendarModule } from 'ionic2-calendar'

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPageModule } from '../pages/login/login.module';
import { LoginPage } from '../pages/login/login';
import { DataHandlingProvider } from '../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../providers/authentification/authentification';
import { CalendarEventModalPage } from '../pages/calendar-event-modal/calendar-event-modal';
import { CalendarEventModalPageModule } from '../pages/calendar-event-modal/calendar-event-modal.module';
import { ActionDetailsModalPage } from '../pages/action-details-modal/action-details-modal';
import { ActionDetailsModalPageModule } from '../pages/action-details-modal/action-details-modal.module';
import { DelegationDetailsModalPage } from '../pages/delegation-details-modal/delegation-details-modal';
import { DelegationDetailsModalPageModule } from '../pages/delegation-details-modal/delegation-details-modal.module';
import { MaterialDetailsModalPage } from '../pages/material-details-modal/material-details-modal';
import { MaterialDetailsModalPageModule } from '../pages/material-details-modal/material-details-modal.module';
import { DefineActionModalPage } from '../pages/define-action-modal/define-action-modal';
import { DefineActionModalPageModule } from '../pages/define-action-modal/define-action-modal.module';
import { DefineDelegationModalPage } from '../pages/define-delegation-modal/define-delegation-modal';
import { DefineDelegationModalPageModule } from '../pages/define-delegation-modal/define-delegation-modal.module';
import { DefineReferenceModalPage } from '../pages/define-reference-modal/define-reference-modal';
import { DefineReferenceModalPageModule } from '../pages/define-reference-modal/define-reference-modal.module';


import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
export function setTranslateLoader(http: HttpClient) {
 return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

// the second parameter 'fr' is optional
registerLocaleData(localeDe, 'de');


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
       provide: TranslateLoader,
       useFactory: (setTranslateLoader),
       deps: [HttpClient]
     }
    }),
	  AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    NgCalendarModule,
    LoginPageModule,
    CalendarEventModalPageModule,
    ActionDetailsModalPageModule,
    DelegationDetailsModalPageModule,
    MaterialDetailsModalPageModule,
    DefineActionModalPageModule,
    DefineDelegationModalPageModule,
    DefineReferenceModalPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CalendarEventModalPage,
    ActionDetailsModalPage,
    DelegationDetailsModalPage,
    MaterialDetailsModalPage,
    DefineActionModalPage,
    DefineDelegationModalPage,
    DefineReferenceModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    DataHandlingProvider,
    AuthentificationProvider,
    Push
  ]
})
export class AppModule {}
