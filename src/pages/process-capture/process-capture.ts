import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Capture } from '../../model/capture/capture.model';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { HomePage } from '../home/home';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { Goal } from '../../model/goal/goal.model';
import { Reference } from '../../model/reference/reference.model';
import { Action } from '../../model/action/action.model';


@IonicPage()
@Component({
  selector: 'page-process-capture',
  templateUrl: 'process-capture.html',
})
export class ProcessCapturePage {
  
  capture: Capture;
  goalList: Observable<Goal[]>;
  referenceList: Observable<Reference[]>;
  nextActionList: Observable<Action[]>;
  waitingForList: Observable<Action[]>;
  newGoal = {} as Goal;
  processCtrl: string = 'start';
  assignedGoal = {} as Goal;
  showNextActions: boolean = false;
  showWaitingFors: boolean = false;
  showReferences: boolean = false;
  defineActionForm: FormGroup;
  checkDeadline;
  deadline: string;

  constructor(
	  public navCtrl: NavController,
	  public navParams: NavParams,
    private dataHandlingProvider: DataHandlingProvider,
    private auth: AuthentificationProvider,
    private db: DataHandlingProvider,
    private fb: FormBuilder
) {
    if(!this.auth.checkLoggedIn) {
			this.navCtrl.setRoot(LoginPage);
		}
    this.capture = this.navParams.get('capture');
    this.goalList = this.db.getGoalList(this.auth.userid)
	  .snapshotChanges()
	  .map(
	  changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessCapturePage with capture: ' + this.capture.content);
  }
  
  removeCapture(capture: Capture) {
    this.dataHandlingProvider.removeCapture(capture).then(ref => {
      this.navCtrl.setRoot(HomePage);
    })
  }

  goToProcessCapture() {
    this.processCtrl = 'chooseGoal';
  }

  addGoal(goalname) {
    this.newGoal.userid = this.auth.userid;
    this.newGoal.name = goalname;
    this.db.addGoal(this.newGoal).then( ref => this.addToGoal(ref));
  }

  addToGoal(goal){
    this.processCtrl = 'reviewGoal';
    this.referenceList = this.db.getReferenceListFromGoal(goal.key)
	  .snapshotChanges()
	  .map(
	  changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
    });
    this.nextActionList = this.db.getNextActionListFromGoal(goal.key)
	  .snapshotChanges()
	  .map(
	  changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
    });
    this.waitingForList = this.db.getWaitingForListFromGoal(goal.key)
	  .snapshotChanges()
	  .map(
	  changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
    });
    this.assignedGoal = goal;
    
  }

  nextActions() {
    this.showNextActions = !this.showNextActions;
  }

  waitingFors() {
    this.showWaitingFors = !this.showWaitingFors;
  }

  references() {
    this.showReferences = !this.showReferences;
  }

  goToDefineAction(){
    this.processCtrl = 'defineAction';
    this.defineActionForm = this.fb.group({
			content: ['', Validators.required],
      priority: ['', Validators.required],
      deadline: ['', Validators.required]
    });
    // deadline for 12.aug.2018 17:09:00 is following: 2018-08-12T17:09:00Z
  }

  defineAction() {
    console.log(this.defineActionForm.value.content);
    console.log(this.defineActionForm.value.deadline);
  }

  goToDelegatingQuestion() {
    this.processCtrl = 'delegatingQuestion';
  }
  //Adding reference to goal and remove capture then:
  //this.db.addReferenceToGoal(this.capture, project).then( () => this.db.removeCapture(this.capture)).then( () => this.navCtrl.setRoot(HomePage));
}
