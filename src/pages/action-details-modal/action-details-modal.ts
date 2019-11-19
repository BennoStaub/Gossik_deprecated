import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';

import { Action } from '../../model/action/action.model';


import { TranslateService } from '@ngx-translate/core';
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
		private auth: AuthentificationProvider,
	  	private navParams: NavParams,
	  	private db: DataHandlingProvider,
	  	public viewCtrl: ViewController,
	  	public translate: TranslateService
  	) {
    this.action = this.navParams.get('action');
    if(!this.action.deadline) {
    	this.deadline = false;
    } else {
    	this.deadline = true;
    }
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }

  deleteAction(action: Action) {
    	this.db.deleteAction(action, this.auth.userid);
    	this.viewCtrl.dismiss();
  }

}
