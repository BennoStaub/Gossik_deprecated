import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Capture } from '../../model/capture/capture.model';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';

import { HomePage } from '../home/home';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { LoginPage } from '../login/login';
 
@IonicPage()
@Component({
  selector: 'page-add-capture',
  templateUrl: 'add-capture.html',
})
export class AddCapturePage {
 
  capture = {} as Capture;
  errorMsg: string;
 
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DataHandlingProvider,
    private auth: AuthentificationProvider
  ) {
      if(!this.auth.checkLoggedIn) {
        this.navCtrl.setRoot(LoginPage);
      }
      this.capture.userid = this.auth.userid;
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCapturePage');
  }
 
  addCapture(capture: Capture) {
    if(capture.content !== '' && capture.content !== null && capture.content !== undefined) {
      this.errorMsg = "";
      this.db.addCapture(capture, this.auth.userid).then(ref => {
        this.navCtrl.setRoot(HomePage);
      })
    } else {
      this.errorMsg = "You cannot save an empty capture.";
    }
  }
 
}
