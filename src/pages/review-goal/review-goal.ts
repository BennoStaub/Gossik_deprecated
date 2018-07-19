import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Goal } from '../../model/goal/goal.model';
import { Observable } from 'rxjs/Observable';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { Reference } from '../../model/reference/reference.model';
import { Action } from '../../model/action/action.model';

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
  reference = {} as Reference;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DataHandlingProvider,
    private auth: AuthentificationProvider
  ) {
    this.goal.name = '';
    console.log(this.goal.name);
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
    console.log('removing' + action);
    this.db.removeAction(action, this.auth.userid, goal.key);
  }

}
