import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { AddCapturePage } from '../pages/add-capture/add-capture';
import { AuthentificationProvider } from '../providers/authentification/authentification';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  private menu: MenuController;
  logoutError: string;

  @ViewChild(Nav) nav: Nav;
  constructor(platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private auth: AuthentificationProvider,
              menu: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.menu = menu;
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  logout() {
    this.menu.close();
  this.auth.signOut()
			.then(
				() => this.nav.setRoot(LoginPage),
				error => this.logoutError = error.message
      );
    }
  
}

