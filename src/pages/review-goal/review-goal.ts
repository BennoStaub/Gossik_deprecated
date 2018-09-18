import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Goal } from '../../model/goal/goal.model';
import { Observable } from 'rxjs/Observable';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { Reference } from '../../model/reference/reference.model';
import { Action } from '../../model/action/action.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-review-goal',
  templateUrl: 'review-goal.html',
})
export class ReviewGoalPage {

  reviewCtrl: string = '';
  goal = {} as Goal;
  goalList: Observable<Goal[]>;
  showNextActions: boolean = false;
  showWaitingFors: boolean = false;
  showReferences: boolean = false;
  referenceList: Observable<Reference[]>;
  nextActionList: Observable<Action[]>;
  waitingForList: Observable<Action[]>;
  showAction: string;
  showWaitingFor: boolean = false;
  showReference: boolean = false;
  action = {} as Action;
  newAction = {} as Action;
  reference = {} as Reference;
  editOwnActionForm: FormGroup;
  checkDeadline: boolean;
  errorMsg: string = '';


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DataHandlingProvider,
    private auth: AuthentificationProvider,
    private fb: FormBuilder
  ) {
    this.goal.name = '';
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
    console.log('ionViewDidLoad ReviewGoalPage');
  }

  reviewGoal(goal: Goal) {
    this.reviewCtrl = 'reviewGoal';
    this.goal = goal;
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

  reviewAction(action: Action) {
    this.showAction = action.key;
  }

  deleteAction(action: Action, goal) {
    this.db.removeAction(action, this.auth.userid, goal.key);
  }

  goToEditAction(action: Action) {
    this.action = action;
    this.reviewCtrl = 'editOwnAction';
    this.editOwnActionForm = this.fb.group({
			content: ['', Validators.required],
      priority: ['', Validators.required],
      deadline: [this.action.deadline, Validators.required],
      time: ['', Validators.required]
    });
  }

  editOwnAction() {
    if(this.editOwnActionForm.value.content !== '' && this.editOwnActionForm.value.content !== null && this.editOwnActionForm.value.content !== undefined) {
      if(this.editOwnActionForm.value.priority != 0 && this.editOwnActionForm.value.priority !== null && this.editOwnActionForm.value.priority !== undefined) {
        if(this.editOwnActionForm.value.time != 0 && this.editOwnActionForm.value.time !== null && this.editOwnActionForm.value.time !== undefined) {
          this.errorMsg = "";
          this.newAction.content = this.editOwnActionForm.value.content;
          this.newAction.deadline = this.editOwnActionForm.value.deadline;
          this.newAction.priority = this.editOwnActionForm.value.priority;
          this.newAction.time = this.editOwnActionForm.value.time;
          this.newAction.delegated = this.action.delegated;
          this.newAction.goalid = this.goal.key;
          this.newAction.userid = this.auth.userid;
          this.db.editNextAction(this.newAction, this.action, this.goal, this.auth.userid).then( () => {
          this.reviewCtrl = 'reviewGoal';
          });
        } else {
          this.errorMsg = "Please define a valid time estimate for this action";
        }
      } else {
        this.errorMsg = "Please define a priority.";
      }
    } else {
      this.errorMsg = "Please define an action.";
    }
  }


}
