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
  defineOwnActionForm: FormGroup;
  defineDelegatedActionForm: FormGroup;
  defineReferenceForm: FormGroup;
  checkDeadline;
  deadline: string;
  newAction = {} as Action;
  newReference = {} as Reference;

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
    this.dataHandlingProvider.removeCapture(capture, this.auth.userid).then(ref => {
      this.navCtrl.setRoot(HomePage);
    })
  }

  goToProcessCapture() {
    this.processCtrl = 'chooseGoal';
  }

  addGoal(goalname) {
    this.newGoal.userid = this.auth.userid;
    this.newGoal.name = goalname;
    this.db.addGoal(this.newGoal, this.auth.userid);
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

  goToDefineOwnAction(){
    this.processCtrl = 'defineOwnAction';
    this.defineOwnActionForm = this.fb.group({
			content: ['', Validators.required],
      priority: ['', Validators.required],
      deadline: ['', Validators.required]
    });
  }

  defineOwnAction() {
    this.newAction.content = this.defineOwnActionForm.value.content;
    this.newAction.deadline = this.defineOwnActionForm.value.deadline;
    this.newAction.priority = this.defineOwnActionForm.value.priority;
    this.newAction.delegated = false;
    this.newAction.goalid = this.assignedGoal.key;
    this.newAction.userid = this.auth.userid;
    this.db.addNextActionToGoal(this.newAction, this.assignedGoal, this.capture, this.auth.userid).then( () => {
      this.navCtrl.setRoot(HomePage);
    });
  }

  goToDelegatedActionQuestion() {
    this.processCtrl = 'askDelegatedAction';
  }

  goToDefineDelegatedAction() {
    this.processCtrl = 'defineDelegatedAction';
    this.defineDelegatedActionForm = this.fb.group({
			content: ['', Validators.required],
      priority: ['', Validators.required],
      deadline: ['', Validators.required]
    });
  }

  defineDelegatedAction() {
    this.newAction.content = this.defineDelegatedActionForm.value.content;
    this.newAction.deadline = this.defineDelegatedActionForm.value.deadline;
    this.newAction.delegated = true;
    this.newAction.goalid = this.assignedGoal.key;
    this.newAction.userid = this.auth.userid;
    this.db.addNextActionToGoal(this.newAction, this.assignedGoal, this.capture, this.auth.userid).then( () => {
      this.navCtrl.setRoot(HomePage);
    });
  }

  goToAddReference() {
    this.processCtrl = 'defineReference';
    this.defineReferenceForm = this.fb.group({
			content: ['', Validators.required]
    });
  }
  addReference() {
    this.newReference.content = this.defineReferenceForm.value.content;
    this.newReference.goalid = this.assignedGoal.key;
    this.newReference.userid = this.auth.userid;
    this.db.addReferenceToGoal(this.newReference, this.assignedGoal, this.capture, this.auth.userid).then( () => {
      this.navCtrl.setRoot(HomePage);
    });
  }

}
