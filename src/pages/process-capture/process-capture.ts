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
import { Delegation } from '../../model/delegation/delegation.model';
import { CalendarEvent } from '../../model/CalendarEvent/calendarEvent.model';

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
  delegationList: Observable<Delegation[]>;
  newGoal = {} as Goal;
  processCtrl: string = 'chooseGoal';
  assignedGoal = {} as Goal;
  showNextActions: boolean = false;
  showDelegations: boolean = false;
  showReferences: boolean = false;
  defineActionForm: FormGroup;
  defineDelegationForm: FormGroup;
  defineReferenceForm: FormGroup;
  checkDeadline;
  deadline: string;
  newAction = {} as Action;
  newDelegation = {} as Delegation;
  newReference = {} as Reference;
  errorMsg: string;

  constructor(
	  public navCtrl: NavController,
	  public navParams: NavParams,
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

  addGoal(goalname) {
    if(goalname !== '' && goalname !== null && goalname !== undefined) {
      this.newGoal.userid = this.auth.userid;
      this.newGoal.name = goalname;
      goalname = '';
      this.db.addGoal(this.newGoal, this.auth.userid);
      this.errorMsg = "";
    } else {
      this.errorMsg = "You cannot create a goal without a name.";
    }
  }

  addToGoal(goal){
    this.processCtrl = 'reviewGoal';
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
    this.assignedGoal = goal;
    
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

  goToDefineAction(){
    this.processCtrl = 'defineAction';
    this.defineActionForm = this.fb.group({
			content: ['', Validators.required],
      priority: ['', Validators.required],
      deadline: ['', Validators.required],
      time: ['', Validators.required]
    });
  }

  addAction() {
    this.errorMsg = "";
    this.newAction.content = this.defineActionForm.value.content;
    this.newAction.deadline = this.defineActionForm.value.deadline;
    this.newAction.priority = Number(this.defineActionForm.value.priority);
    this.newAction.time = Number(this.defineActionForm.value.time);
    this.newAction.goalid = this.assignedGoal.key;
    this.newAction.userid = this.auth.userid;
    this.newAction.taken = false;
    if(this.newAction.content !== '' && this.newAction.content !== null && this.newAction.content !== undefined) {
      if(this.newAction.priority != 0 && this.newAction.priority !== null && this.newAction.priority !== undefined) {
        if(this.newAction.time != 0 && this.newAction.time !== null && this.newAction.time !== undefined) {
          if(this.checkDeadline === true) {
            if(this.newAction.deadline !== '' && this.newAction.deadline !== null && this.newAction.deadline !== undefined) {
              this.errorMsg = "";
              let eventData: CalendarEvent = {
                userid: this.auth.userid,
                startTime: Date.parse(this.newAction.deadline),
                endTime: Date.parse(this.newAction.deadline) + 3600000,
                title: 'Deadline: ' + this.newAction.content
              }
              this.db.addCalendarEvent(eventData, this.auth.userid)
              this.db.addNextActionToGoal(this.newAction, this.assignedGoal, this.capture, this.auth.userid).then( () => {
              this.navCtrl.setRoot(HomePage);
              });
            } else {
              this.errorMsg = "Please define a deadline or deselct the deadline checkbox.";
            }
          } else {
            this.errorMsg = "";
            this.db.addNextActionToGoal(this.newAction, this.assignedGoal, this.capture, this.auth.userid).then( () => {
            this.navCtrl.setRoot(HomePage);
            });
          }
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

  goToDefineDelegation() {
    this.processCtrl = 'defineDelegation';
    this.defineDelegationForm = this.fb.group({
			content: ['', Validators.required],
      deadline: ['', Validators.required]
    });
  }

  addDelegation() {
    this.newDelegation.content = this.defineDelegationForm.value.content;
    this.newDelegation.deadline = this.defineDelegationForm.value.deadline;
    this.newDelegation.goalid = this.assignedGoal.key;
    this.newDelegation.userid = this.auth.userid;
    if(this.newDelegation.content !== '' && this.newDelegation.content !== null && this.newDelegation.content !== undefined) {
      if(this.checkDeadline === true) {
        if(this.newDelegation.deadline !== '' && this.newDelegation.deadline !== null && this.newDelegation.deadline !== undefined) {
          this.errorMsg = "";
          let eventData: CalendarEvent = {
              userid: this.auth.userid,
              startTime: Date.parse(this.newDelegation.deadline),
              endTime: Date.parse(this.newDelegation.deadline) + 3600000,
              title: 'Deadline: ' + this.newDelegation.content
            }
            this.db.addCalendarEvent(eventData, this.auth.userid)
          this.db.addDelegationToGoal(this.newDelegation, this.assignedGoal, this.capture, this.auth.userid).then( () => {
          this.navCtrl.setRoot(HomePage);
          });
        } else {
          this.errorMsg = "Please define a deadline or deselect the deadline checkbox.";
        }
      } else {
        this.errorMsg = "";
        this.db.addDelegationToGoal(this.newDelegation, this.assignedGoal, this.capture, this.auth.userid).then( () => {
        this.navCtrl.setRoot(HomePage);
        });
      }
    } else {
      this.errorMsg = "Please define what you are waiting for.";
    }
  }

  goToDefineReference() {
    this.processCtrl = 'defineReference';
    this.defineReferenceForm = this.fb.group({
			content: ['', Validators.required]
    });
  }

  addReference() {
    this.newReference.content = this.defineReferenceForm.value.content;
    this.newReference.goalid = this.assignedGoal.key;
    this.newReference.userid = this.auth.userid;
    if(this.newReference.content !== '' && this.newReference.content !== null && this.newReference.content !== undefined) {
      this.errorMsg = "";
      this.db.addReferenceToGoal(this.newReference, this.assignedGoal, this.capture, this.auth.userid).then( () => {
      this.navCtrl.setRoot(HomePage);
      });
    } else {
      this.errorMsg = "Please define what you want to save as reference.";
    }
  }

}
