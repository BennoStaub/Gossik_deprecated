import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Capture } from '../../model/capture/capture.model';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { LoginPage } from '../login/login';
import { Action } from '../../model/action/action.model';
import { Reference } from '../../model/reference/reference.model';
import { Delegation } from '../../model/delegation/delegation.model';
import { Goal } from '../../model/goal/goal.model';
import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';
import { CalendarEventModalPage } from '../calendar-event-modal/calendar-event-modal';
import { ActionDetailsModalPage } from '../action-details-modal/action-details-modal';
import { DelegationDetailsModalPage } from '../delegation-details-modal/delegation-details-modal';
import { MaterialDetailsModalPage } from '../material-details-modal/material-details-modal';

import 'rxjs/add/operator/take';
import * as moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  	viewpoint: string;
	captureList: Observable<Capture[]>;
	takenActionList: Observable<Action[]>;
	newCapture = {} as Capture;
	errorMsg: string;
	isApp: boolean;
	platforms: string;
	capture: Capture;
	goalList: Observable<Goal[]>;
	goalArray: Goal[];
	referenceList: Observable<Reference[]>;
	nextActionList: Observable<Action[]>;
	delegationList: Observable<Delegation[]>;
	newGoal = {} as Goal;
	pageCtrl: string;
	assignedGoal = {} as Goal;
	showNextActions: boolean = false;
	showDelegations: boolean = false;
	showReferences: boolean = false;
	defineActionForm: FormGroup;
	defineDelegationForm: FormGroup;
	defineReferenceForm: FormGroup;
	checkDeadline: boolean;
	deadline: string;
	newAction = {} as Action;
	newDelegation = {} as Delegation;
	newReference = {} as Reference;
	takenAction = {} as Action;
	goal = {} as Goal;
  	showAction: string;
  	showDelegation: string;
  	showReference: string;
  	action = {} as Action;
  	delegation = {} as Delegation;
  	reference = {} as Reference;
  	newGoalForm: FormGroup;
  	editActionForm: FormGroup;
  	editDelegationForm: FormGroup;
  	editReferenceForm: FormGroup;
  	doableActionList: Observable<Action[]>;
	doableAction = {} as Action;
	giveTimeForm: FormGroup;
	doableActionArray: Action[] = [];
	doableHighPriorityActions: Action[] = [];
	goalFromAction = {} as Goal;
	eventSource = [];
	calendarEventList: Observable<CalendarEvent[]>;
	actionList: Observable<Action[]>;
	viewTitle: string;
	selectedDay = new Date();
	calendar = {
		mode: 'week',
		currentDate: new Date()
	};
	actions = {};
 
  constructor(
		public navCtrl: NavController,
		private auth: AuthentificationProvider,
		private db: DataHandlingProvider,
		public platform: Platform,
		private fb: FormBuilder,
		public navParams: NavParams,
		private modalCtrl: ModalController,
		private alertCtrl: AlertController,
	) {
		if(!this.auth.checkLoggedIn) {
			this.navCtrl.setRoot(LoginPage);
		}
		this.isApp = !this.platform.is('core');
		this.viewpoint = 'CapturePage';
		this.captureList = this.db.getCaptureListFromUser(this.auth.userid)
		.snapshotChanges()
		.map(
		changes => {
		return changes.map(c => ({
		  key: c.payload.key, userid: c.payload.val().userid, content: c.payload.val().content.replace(/\n/g, '<br>')
		}))
		});
		this.takenActionList = this.db.getTakenActionListFromUser(this.auth.userid)
		.snapshotChanges()
		.map(
		changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
		});
  	}

  	//HomePage functions
  	addCapture(capture: Capture) {
	    if(capture.content !== '' && capture.content !== null && capture.content !== undefined) {
	      this.errorMsg = "";
	      capture.userid = this.auth.userid;
	      this.db.addCapture(capture, this.auth.userid).then(ref => {
	        this.navCtrl.setRoot(HomePage);
	      })
	    } else {
	      this.errorMsg = "You cannot save an empty capture.";
	    }
  	}

  	removeCapture(capture: Capture) {
  		this.db.deleteCapture(capture, this.auth.userid)
  	}

  	goToCapturePage() {
  		this.viewpoint = 'CapturePage';
  	}

  	goToProcessCapturePage(capture: Capture) {
  		this.capture = capture;
  		this.goalList = this.db.getGoalList(this.auth.userid)
		  .snapshotChanges()
		  .map(
		  changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
	    });
	  	this.newGoalForm = this.fb.group({
  			newGoal: ['', Validators.required]
    	});
  		this.viewpoint = 'ProcessCapturePage';
  		this.pageCtrl = '';
  	}

  	goToProcessTakenActionPage(takenAction: Action) {
  		this.viewpoint = 'ProcessTakenActionPage';
  		this.pageCtrl = '';
  		this.takenAction = takenAction;
  	}

  	goToProjectsPage() {
  		this.goal.name = '';
  		this.goalArray = [];
	    this.goalList = this.db.getGoalList(this.auth.userid)
		  .snapshotChanges()
		  .map(
		  changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
	    });
	    this.goalList.take(1).subscribe(
	      goalArray => {
	        for(let goal of goalArray) {
	        	this.goalArray.push(goal);
	        }
	        for(let goal of this.goalArray) {
		    	this.actionList = this.db.getNextActionListFromGoal(goal.key, this.auth.userid)
				  .snapshotChanges()
				  .map(
				  changes => {
					return changes.map(c => ({
					  key: c.payload.key, ...c.payload.val()
					}))
			    });
			    this.actionList.subscribe( actionList => {
			      	this.actions[goal.key] = actionList;
			    });
			};
	    });
  		this.viewpoint = 'ProjectsPage';
  		this.pageCtrl = '';
  	}

  	goToToDoPage() {
  		this.goalArray = [];
  		this.goalList = this.db.getGoalList(this.auth.userid)
		  .snapshotChanges()
		  .map(
		  changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
	    });
		this.goalList.take(1).subscribe(
	      goalArray => {
	        for(let goal of goalArray) {
	        	this.goalArray.push(goal);
	        }
	    })
  		this.giveTimeForm = this.fb.group({
      		timeEstimate: ['', Validators.required]
    	});
    	this.doableHighPriorityActions = [];
    	this.goal =  <Goal>{key: 'None'};;
    	this.viewpoint = 'ToDoPage';
    	this.pageCtrl = '';
    	this.errorMsg = '';
  	}

  	goToCalendarPage() {
  		this.eventSource = [];
  		this.calendarEventList = this.db.getCalendarEventListFromUser(this.auth.userid)
			.snapshotChanges()
			.map(
			changes => {
			return changes.map(c => ({
			  key: c.payload.key, userid: c.payload.val().userid, goalid: c.payload.val().goalid, startTime: c.payload.val().startTime, endTime: c.payload.val().endTime, title: c.payload.val().title, allDay: c.payload.val().allDay
			}))
			});
			this.calendarEventList.take(1).subscribe(
		      	calendarEventArray => {
		      	this.eventSource = [];
		        for(let calendarEvent of calendarEventArray) {
		        	calendarEvent.startTime = new Date(calendarEvent.startTime);
		        	calendarEvent.endTime = new Date(calendarEvent.endTime);
		        	this.eventSource.push(calendarEvent);
		        };
		        let events = this.eventSource;
				this.eventSource = [];
				setTimeout(() => {
					this.eventSource = events;
				});
			});
		this.viewpoint = 'CalendarPage';
  	}

  	// ProcessCapturePage functions
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

	

	nextActions() {
	    this.showNextActions = !this.showNextActions;
	}

	delegations() {
		this.showDelegations = !this.showDelegations;
	}

	references() {
	    this.showReferences = !this.showReferences;
	}

	goToDefineAction(goal){
		this.assignedGoal = goal
	    this.pageCtrl = 'defineAction';
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
	            if(this.newAction.deadline !== undefined && this.newAction.deadline !== null) {
	              this.errorMsg = "";
	              let newEndTime = new Date (this.newAction.deadline).setHours(2);
	              let eventData: CalendarEvent = {
	                userid: this.auth.userid,
	                goalid: this.assignedGoal.key,
	                startTime: new Date(this.newAction.deadline).toISOString(),
	                endTime: new Date (newEndTime).toISOString(),
	                title: 'Deadline: ' + this.newAction.content,
	                allDay: true
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

	goToDefineDelegation(goal) {
		this.assignedGoal = goal
	    this.pageCtrl = 'defineDelegation';
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
	        if(this.newDelegation.deadline !== null && this.newDelegation.deadline !== undefined) {
	          this.errorMsg = "";
	          let eventData: CalendarEvent = {
	              userid: this.auth.userid,
	              goalid: this.assignedGoal.key,
	              startTime: this.newDelegation.deadline,
	              endTime: this.newDelegation.deadline,
	              title: 'Deadline: ' + this.newDelegation.content,
	              allDay: true
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

	goToDefineMaterial(goal) {
		this.assignedGoal = goal
	    this.pageCtrl = 'defineReference';
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

	// ProcessTakenActionPage function
	actionFinished() {
		this.pageCtrl = 'actionFinished';
	}

	abortAction() {
		this.takenAction.taken = false;
		this.db.editAction(this.takenAction, this.auth.userid);
		this.pageCtrl = 'actionAborted';
	}

	goalFinished() {
		this.db.deleteGoal(this.takenAction.goalid, this.auth.userid).then( () => {
			this.pageCtrl = 'goalFinished';
		});
	}

	goalNotFinished() {
	this.db.getGoalFromGoalid(this.takenAction.goalid, this.auth.userid).valueChanges().take(1).subscribe( data => {
		let capture = {} as Capture;
		capture.content = 'Action finished: ' + this.takenAction.content + '\n from goal: ' + data.name;
		capture.userid = this.auth.userid;
		this.db.deleteAction(this.takenAction, this.auth.userid).then( () => {
			this.db.addCapture(capture, this.auth.userid);
			this.navCtrl.setRoot(HomePage);
		});
	});
	}

	// ProjectsPage functions
	reviewGoal(goal: Goal) {
		this.eventSource = [];
  		this.calendarEventList = this.db.getCalendarEventListFromUser(this.auth.userid)
			.snapshotChanges()
			.map(
			changes => {
			return changes.map(c => ({
			  key: c.payload.key, userid: c.payload.val().userid, goalid: c.payload.val().goalid, startTime: c.payload.val().startTime, endTime: c.payload.val().endTime, title: c.payload.val().title, allDay: c.payload.val().allDay
			}))
			});
			this.calendarEventList.take(1).subscribe(
		      	calendarEventArray => {
		      	this.eventSource = [];
		        for(let calendarEvent of calendarEventArray) {
		        	if(calendarEvent.goalid == goal.key) {
			        	calendarEvent.startTime = new Date(calendarEvent.startTime);
			        	calendarEvent.endTime = new Date(calendarEvent.endTime);
			        	this.eventSource.push(calendarEvent);
			        }
		        };
		        let events = this.eventSource;
				this.eventSource = [];
				setTimeout(() => {
					this.eventSource = events;
				});
			});
	    this.pageCtrl = 'ProjectOverview';
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

  	reviewAction(action: Action) {
		let modal = this.modalCtrl.create(ActionDetailsModalPage, {action: action});
		modal.present();
  	}

	reviewDelegation(delegation: Delegation) {
		let modal = this.modalCtrl.create(DelegationDetailsModalPage, {delegation: delegation});
		modal.present();
	}

  	reviewReference(reference: Reference) {
		let modal = this.modalCtrl.create(MaterialDetailsModalPage, {material: reference});
		modal.present();
  	}

  	deleteAction(action: Action, goal) {
    	this.db.deleteAction(action, this.auth.userid);
  	}

  	deleteDelegation(delegation: Delegation, goal) {
    	this.db.deleteDelegation(delegation, this.auth.userid);
  	}

  	deleteReference(reference: Reference, goal) {
    	this.db.deleteReference(reference, this.auth.userid);
  	}

  	goToEditAction(action: Action) {
	    this.action = action;
	    this.pageCtrl = 'editAction';
	    this.editActionForm = this.fb.group({
				content: ['', Validators.required],
	      priority: ['', Validators.required],
	      deadline: [this.action.deadline, Validators.required],
	      time: ['', Validators.required]
	    });
  	}

  	goToEditDelegation(delegation: Delegation) {
	    this.delegation = delegation;
	    this.pageCtrl = 'editDelegation';
	    this.editDelegationForm = this.fb.group({
				content: ['', Validators.required],
	      deadline: [this.delegation.deadline, Validators.required]
	    });
	}

  	goToEditReference(reference: Reference) {
	    this.reference = reference;
	    this.pageCtrl = 'editReference';
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
	          this.pageCtrl = 'reviewGoal';
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
	      this.pageCtrl = 'reviewGoal';
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
	      this.pageCtrl = 'reviewGoal';
	      });
	    } else {
	      this.errorMsg = "Please define a valid reference.";
	    }
  	}

  	deleteGoal(goal: Goal) {
	    this.db.deleteGoal(goal.key, this.auth.userid).then( () => {
	      this.pageCtrl = '';
	    });
  	}

  	// ToDoPage functions

  	chooseGoal(goalid) {
  		if(goalid != 'None') {
	  		this.db.getGoalFromGoalid(goalid, this.auth.userid).valueChanges().take(1).subscribe( goal => {
			this.goal = {key: goalid, name: goal.name, userid: goal.userid};
			});
		} else {
			this.goal.key = 'None';
		}
  		this.showDoableActions();
  	}

  	showDoableActions() {
  		if(!this.giveTimeForm.value.timeEstimate) {
  			this.giveTimeForm.value.timeEstimate = 10000000;
  		}
  		this.doableActionArray = [];
  		this.doableHighPriorityActions = [];
	    this.doableActionList = this.db.getNextActionListFromUser(this.auth.userid)
		  .snapshotChanges()
		  .map(
		  changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
	    });
	    this.doableActionList.take(1).subscribe(
	      doableActionArray => {
	        for(let doableAction of doableActionArray) {
	        	console.log('goal');
	        	console.log(this.goal);
	          if(Number(doableAction.time) <= Number(this.giveTimeForm.value.timeEstimate) && !doableAction.taken && ((doableAction.goalid == this.goal.key) || this.goal.key == 'None')) {
	            this.doableActionArray.push(doableAction);
	          }
	        };
	      }
	    );
  	}

  	takeThisAction(action: Action) {
	    action.taken = true;
	    this.db.editAction(action, this.auth.userid).then( () => {
	      this.errorMsg = 'Great, have fun while taking Action! Visit the Captures to process this action when you finished it.';
	    });
	    this.showDoableActions();
  	}

  	// CalendarPage functions
  	addEvent(){
  		this.selectedDay = new Date();
		let modal = this.modalCtrl.create(CalendarEventModalPage, {selectedDay: this.selectedDay});
		modal.present();
		modal.onDidDismiss(data => {
			if(data) {
				let eventData: CalendarEvent = data;
				eventData.userid = this.auth.userid;
				eventData.allDay = false;
				this.db.addCalendarEvent(eventData, this.auth.userid)
				eventData.startTime = new Date(eventData.startTime);
		        eventData.endTime = new Date(eventData.endTime);
				let events = this.eventSource;
				events.push(eventData);
				this.eventSource = [];
				setTimeout(() => {
					this.eventSource = events;
				});
				
			}
		});
	}

	onEventSelected(event){
		this.db.getGoalFromGoalid(event.goalid, this.auth.userid).valueChanges().take(1).subscribe( data => {
			let goal = '';
			let time = ''
			if(data != null) {
				goal = 'Goal: ' + data.name + '<br>';
			}
			if(!event.allDay) {
				let start = moment(event.startTime).format('HH:mm');
				let end = moment(event.endTime).format('HH:mm');
				time = 'Time: ' + start + ' - ' + end;
			}
			let alert = this.alertCtrl.create({
					title: '' + event.title,
					subTitle: goal + time,
					buttons: ['OK']
			});
			alert.present();
		});
	}

	onViewTitleChanged(title) {
		this.viewTitle = title;
	}

	onTimeSelected(event) {
			if(event.events == undefined || event.events.length == 0) {
			this.selectedDay = new Date(event.selectedTime);
			let modal = this.modalCtrl.create(CalendarEventModalPage, {selectedDay: this.selectedDay});
			modal.present();
			modal.onDidDismiss(data => {
				if(data) {
					let eventData: CalendarEvent = data;
					eventData.userid = this.auth.userid;
					eventData.allDay = false;
					this.db.addCalendarEvent(eventData, this.auth.userid)
					eventData.startTime = new Date(eventData.startTime);
			        eventData.endTime = new Date(eventData.endTime);
					let events = this.eventSource;
					events.push(eventData);
					this.eventSource = [];
					setTimeout(() => {
						this.eventSource = events;
					});
					
				}
			});
		}
	}
 
}