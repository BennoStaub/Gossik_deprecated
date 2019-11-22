import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { AuthentificationProvider } from '../providers/authentification/authentification';
import { HomePage } from '../pages/home/home';

import { TranslateService } from '@ngx-translate/core';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  private menu: MenuController;

  @ViewChild('content') nav;

  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private auth: AuthentificationProvider,
              menu: MenuController,
              public translate: TranslateService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.menu = menu;
      let language = this.translate.getBrowserLang();
      translate.setDefaultLang(language);
      statusBar.styleDefault();
      splashScreen.hide();
      this.auth.afAuth.authState
      .subscribe(
        user => {
          if (user) {
            this.rootPage = HomePage;
          } else {
            this.rootPage = LoginPage;
          }
        },
        () => {
          this.rootPage = LoginPage;
        }
      );
    });
  }


  logout() {
    this.menu.close();
    this.auth.signOut();
    this.nav.setRoot(LoginPage);
    }

  goToReviewGoalPage() {
    this.menu.close();
  }

  goToTakeActionPage() {
    this.menu.close();
  }

  goToCalendarPage() {
    this.menu.close();
  }

  goToHomePage() {
    this.menu.close();
    this.nav.setRoot(HomePage);
  }
  
}

