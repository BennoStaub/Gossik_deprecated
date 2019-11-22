import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';

import { Action } from '../../model/action/action.model';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  defineActionForm: FormGroup;

  constructor(
	  	public navCtrl: NavController,
		  private auth: AuthentificationProvider,
	  	private navParams: NavParams,
	  	private db: DataHandlingProvider,
	  	public viewCtrl: ViewController,
	  	public translate: TranslateService,
      public fb: FormBuilder
  	) {
    this.action = this.navParams.get('action');
    this.deadline = !(!this.action.deadline);
    if(!this.action.deadline) {
    	this.deadline = false;
    } else {
    	this.deadline = true;
    }
    this.defineActionForm = this.fb.group({
    content: ['', Validators.required],
    priority: ['', Validators.required],
    deadline: ['', Validators.required],
    time: ['', Validators.required]
    });
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }

  deleteAction(action: Action) {
    	this.db.deleteAction(action, this.auth.userid);
    	this.viewCtrl.dismiss();
  }

  saveAction() {
    this.action.content = this.defineActionForm.value.content;
    this.action.priority = this.defineActionForm.value.priority;
    this.action.deadline = this.defineActionForm.value.deadline;
    this.action.time = this.defineActionForm.value.time
    this.db.editAction(this.action, this.auth.userid);
    this.viewCtrl.dismiss();
  }

}
