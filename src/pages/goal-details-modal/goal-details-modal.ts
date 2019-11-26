import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';

import { Goal } from '../../model/goal/goal.model';

/**
 * Generated class for the GoalDetailsModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-goal-details-modal',
  templateUrl: 'goal-details-modal.html',
})
export class GoalDetailsModalPage {

	goal = {} as Goal;
  	editGoalForm: FormGroup;

  constructor(
  	public navCtrl: NavController,
  	public viewCtrl: ViewController,
  	public navParams: NavParams,
  	public translate: TranslateService,
  	public fb: FormBuilder,
  	private db: DataHandlingProvider,
  	private auth: AuthentificationProvider
  	) {
  	this.goal = this.navParams.get('goal');
    this.editGoalForm = this.fb.group({
      name: ['', Validators.required]
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoalDetailsModalPage');
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  saveGoal() {
    this.goal.name = this.editGoalForm.value.name;
    let goalkey = this.goal.key;
    this.db.editGoal(this.goal, this.auth.userid);
    this.goal.key = goalkey;
    this.viewCtrl.dismiss();
  }

}
