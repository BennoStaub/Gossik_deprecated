import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Capture } from '../../model/capture/capture.model';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';

import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-process-capture',
  templateUrl: 'process-capture.html',
})
export class ProcessCapturePage {
  
  capture: Capture;

  constructor(
	public navCtrl: NavController,
	public navParams: NavParams,
	private dataHandlingProvider: DataHandlingProvider) {
    this.capture = this.navParams.get('capture');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessCapturePage');
  }
  
  removeCapture(capture: Capture) {
    this.dataHandlingProvider.removeCapture(capture).then(ref => {
      this.navCtrl.setRoot(HomePage);
    })
  }

}
