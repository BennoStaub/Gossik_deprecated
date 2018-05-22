import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Capture } from '../../model/capture/capture.model';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';

import { HomePage } from '../home/home';
 
@IonicPage()
@Component({
  selector: 'page-add-capture',
  templateUrl: 'add-capture.html',
})
export class AddCapturePage {
 
  capture: Capture = {
    content: ''
  };
 
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private dataHandlingProvider: DataHandlingProvider) {
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCapturePage');
  }
 
  addCapture(capture: Capture) {
    this.dataHandlingProvider.addCapture(capture).then(ref => {
      this.navCtrl.setRoot(HomePage);
    })
  }
 
}
