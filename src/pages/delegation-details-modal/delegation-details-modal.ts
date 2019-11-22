import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';


import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
  defineDelegationForm: FormGroup

  constructor(
	  	public navCtrl: NavController,
		  private auth: AuthentificationProvider,
	  	private navParams: NavParams,
	  	private db: DataHandlingProvider,
	  	public viewCtrl: ViewController,
	  	public translate: TranslateService,
      public fb: FormBuilder
  	) {
    this.delegation = this.navParams.get('delegation');
    if(!this.delegation.deadline) {
    	this.deadline = false;
    } else {
    	this.deadline = true;
    }
    this.defineDelegationForm = this.fb.group({
      content: ['', Validators.required],
      deadline: ['', Validators.required]
    });
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }

  deleteDelegation(delegation) {
  	this.db.deleteDelegation(delegation, this.auth.userid);
  	this.viewCtrl.dismiss();
  }

  saveDelegation() {
    this.delegation.content = this.defineDelegationForm.value.content;
    this.delegation.deadline = this.defineDelegationForm.value.deadline;
    this.db.editDelegation(this.delegation, this.auth.userid);
    this.viewCtrl.dismiss();
  }

}