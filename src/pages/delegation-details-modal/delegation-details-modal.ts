import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';

import { Delegation } from '../../model/delegation/delegation.model';

/**
 * Generated class for the DelegationDetailsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delegation-details-modal',
  templateUrl: 'delegation-details-modal.html',
})
export class DelegationDetailsModalPage {

	delegation = {} as Delegation;
	deadline: boolean;

  constructor(
	  	public navCtrl: NavController,
		private auth: AuthentificationProvider,
	  	private navParams: NavParams,
	  	private db: DataHandlingProvider,
	  	public viewCtrl: ViewController
  	) {
    this.delegation = this.navParams.get('delegation');
    if(!this.delegation.deadline) {
    	this.deadline = false;
    } else {
    	this.deadline = true;
    }
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }

  deleteDelegation(delegation: Delegation) {
    	this.db.deleteDelegation(delegation, this.auth.userid);
    	this.viewCtrl.dismiss();
  }

}