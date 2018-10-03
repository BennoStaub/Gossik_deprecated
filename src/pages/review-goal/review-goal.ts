import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Goal } from '../../model/goal/goal.model';
import { Observable } from 'rxjs/Observable';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { Reference } from '../../model/reference/reference.model';
import { Action } from '../../model/action/action.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Delegation } from '../../model/delegation/delegation.model';

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
  showDelegations: boolean = false;
  showReferences: boolean = false;
  referenceList: Observable<Reference[]>;
  nextActionList: Observable<Action[]>;
  delegationList: Observable<Action[]>;
  showAction: string;
  showDelegation: string;
  showReference: string;
  action = {} as Action;
  delegation = {} as Delegation;
  reference = {} as Reference;
  newAction = {} as Action;
  newDelegation = {} as Delegation;
  newReference = {} as Reference;
  editActionForm: FormGroup;
  editDelegationForm: FormGroup;
  editReferenceForm: FormGroup;
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
    this.goalList.subscribe( goalList => {
      if(goalList.length == 0) {
        this.errorMsg = 'You don\'t have any goals yet. Capture your thoughts and process them to create goals!';
      }
    })
    console.log(this.goalList);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewGoalPage');
  }

  reviewGoal(goal: Goal) {
    this.reviewCtrl = 'reviewGoal';
    this.goal = goal;
    this.referenceList = this.db.getReferenceListFromGoal(goal.key, this.auth.userid)
	  .snapshotChanges()
	  .map(
	  changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
    });
    this.nextActionList = this.db.getNextActionListFromGoal(goal.key, this.auth.userid)
	  .snapshotChanges()
	  .map(
	  changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
    });
    this.delegationList = this.db.getDelegationListFromGoal(goal.key, this.auth.userid)
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

  delegations() {
    this.showDelegations = !this.showDelegations;
  }

  references() {
    this.showReferences = !this.showReferences;
  }

  reviewAction(action: Action) {
    this.showAction = action.key;
  }

  reviewDelegation(delegation: Delegation) {
    this.showDelegation = delegation.key
  }

  reviewReference(reference: Reference) {
    this.showReference = reference.key;
  }

  deleteAction(action: Action, goal) {
    this.db.removeAction(action, this.auth.userid);
  }

  deleteDelegation(delegation: Delegation, goal) {
    this.db.removeDelegation(delegation, this.auth.userid);
  }

  deleteReference(reference: Reference, goal) {
    this.db.removeReference(reference, this.auth.userid);
  }

  goToEditAction(action: Action) {
    this.action = action;
    this.reviewCtrl = 'editAction';
    this.editActionForm = this.fb.group({
			content: ['', Validators.required],
      priority: ['', Validators.required],
      deadline: [this.action.deadline, Validators.required],
      time: ['', Validators.required]
    });
  }

  goToEditDelegation(delegation: Delegation) {
    this.delegation = delegation;
    this.reviewCtrl = 'editDelegation';
    this.editDelegationForm = this.fb.group({
			content: ['', Validators.required],
      deadline: [this.delegation.deadline, Validators.required]
    });
  }

  goToEditReference(reference: Reference) {
    this.reference = reference;
    this.reviewCtrl = 'editReference';
    this.editReferenceForm = this.fb.group({
			content: ['', Validators.required]
    });
  }


  editAction() {
    if(this.editActionForm.value.content !== '' && this.editActionForm.value.content !== null && this.editActionForm.value.content !== undefined) {
      if(this.editActionForm.value.priority != 0 && this.editActionForm.value.priority !== null && this.editActionForm.value.priority !== undefined) {
        if(this.editActionForm.value.time != 0 && this.editActionForm.value.time !== null && this.editActionForm.value.time !== undefined) {
          this.errorMsg = "";
          this.action.content = this.editActionForm.value.content;
          this.action.deadline = this.editActionForm.value.deadline;
          this.action.priority = this.editActionForm.value.priority;
          this.action.time = this.editActionForm.value.time;
          this.db.editAction(this.action, this.auth.userid).then( () => {
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

  editDelegation() {
    if(this.editDelegationForm.value.content !== '' && this.editDelegationForm.value.content !== null && this.editDelegationForm.value.content !== undefined) {
      this.errorMsg = "";
      this.delegation.content = this.editDelegationForm.value.content;
      this.delegation.deadline = this.editDelegationForm.value.deadline;
      this.db.editDelegation(this.delegation, this.auth.userid).then( () => {
      this.reviewCtrl = 'reviewGoal';
      });
    } else {
      this.errorMsg = "Please define what you are waiting for.";
    }
  }

  editReference() {
    if(this.editReferenceForm.value.content !== '' && this.editReferenceForm.value.content !== null && this.editReferenceForm.value.content !== undefined) {
      this.errorMsg = "";
      this.reference.content = this.editReferenceForm.value.content;
      this.db.editReference(this.reference, this.auth.userid).then( () => {
      this.reviewCtrl = 'reviewGoal';
      });
    } else {
      this.errorMsg = "Please define a valid reference.";
    }
  }

  deleteGoal(goal: Goal) {
    this.db.deleteGoal(goal.key, this.auth.userid).then( () => {
      this.reviewCtrl = '';
    });
  }


}
