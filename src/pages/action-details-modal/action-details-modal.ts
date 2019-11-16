import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { Action } from '../../model/action/action.model';
/**
 * Generated class for the ActionDetailsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-action-details-modal',
  templateUrl: 'action-details-modal.html',
})
export class ActionDetailsModalPage {

	action = {} as Action;
	deadline: boolean;

  constructor(
  	public navCtrl: NavController,
  	private navParams: NavParams,
  	public viewCtrl: ViewController
  	) {
    this.action = this.navParams.get('action');
    console.log(this.action);
    if(!this.action.deadline) {
    	this.deadline = false;
    } else {
    	this.deadline = true;
    }
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }
 
  save() {
    this.viewCtrl.dismiss(this.action);
  }

}
