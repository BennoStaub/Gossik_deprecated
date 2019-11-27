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
  monthLabels = [];
  dayLabels = [];
  edit: boolean = false;
  deadlineString: string;
  formatOptions: any;

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
    this.defineActionForm = this.fb.group({
    content: ['', Validators.required],
    priority: ['', Validators.required],
    time: ['', Validators.required]
    });
    this.translate.get(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']).subscribe( monthLabels => {
      this.monthLabels = [
      monthLabels['Jan'],
      monthLabels['Feb'],
      monthLabels['Mar'],
      monthLabels['Apr'],
      monthLabels['May'],
      monthLabels['Jun'],
      monthLabels['Jul'],
      monthLabels['Aug'],
      monthLabels['Sep'],
      monthLabels['Oct'],
      monthLabels['Nov'],
      monthLabels['Dec']
      ];
    });
    this.translate.get(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).subscribe( dayLabels => {
      this.dayLabels = [
      dayLabels['Sun'],
      dayLabels['Mon'],
      dayLabels['Tue'],
      dayLabels['Wed'],
      dayLabels['Thu'],
      dayLabels['Fri'],
      dayLabels['Sat']
      ];
    });
    this.formatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.deadlineString = new Date (this.action.deadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }

  deleteAction(action: Action) {
    this.db.deleteAction(action, this.auth.userid);
    this.viewCtrl.dismiss();
  }

  saveAction() {
    this.action.deadline = new Date (this.action.deadline).toISOString();
    this.action.content = this.defineActionForm.value.content;
    this.action.priority = this.defineActionForm.value.priority;
    this.action.time = this.defineActionForm.value.time;
    let actionkey = this.action.key;
    this.db.editAction(this.action, this.auth.userid);
    this.action.key = actionkey;
    this.viewCtrl.dismiss();
  }

  editDeadline() {
    this.edit = true;
  }

  deadlineSelected(event) {
    let deadlineFixed = new Date (event).setHours(2);
    this.action.deadline = new Date (deadlineFixed);
    this.deadlineString = new Date (this.action.deadline).toLocaleDateString(this.translate.currentLang, this.formatOptions);
    this.edit = false;
  }

}
