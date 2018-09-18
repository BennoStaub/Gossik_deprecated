import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { firebaseConfig } from './firebase.credentials';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPageModule } from '../pages/login/login.module';
import { LoginPage } from '../pages/login/login';
import { DataHandlingProvider } from '../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../providers/authentification/authentification';
import { SignupPage } from '../pages/sign-up/sign-up';
import { SignupPageModule } from '../pages/sign-up/sign-up.module';
import { ReviewGoalPage } from '../pages/review-goal/review-goal';
import { ReviewGoalPageModule } from '../pages/review-goal/review-goal.module';
import { TakeActionPage } from '../pages/take-action/take-action';
import { TakeActionPageModule } from '../pages/take-action/take-action.module';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
	AngularFireModule.initializeApp(firebaseConfig),
  AngularFireDatabaseModule,
  LoginPageModule,
  SignupPageModule,
  ReviewGoalPageModule,
  TakeActionPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ReviewGoalPage,
    TakeActionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    DataHandlingProvider,
    AuthentificationProvider
  ]
})
export class AppModule {}
