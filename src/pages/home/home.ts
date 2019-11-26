import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';

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
import { GoalDetailsModalPage } from '../goal-details-modal/goal-details-modal';
import { DefineActionModalPage } from '../define-action-modal/define-action-modal';
import { DefineDelegationModalPage } from '../define-delegation-modal/define-delegation-modal';
import { DefineReferenceModalPage } from '../define-reference-modal/define-reference-modal';

import 'rxjs/add/operator/take';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  	viewpoint: string;
	captureList: Observable<Capture[]>;
	takenActionList: Observable<Action[]>;
	captureListCheckEmpty: Observable<Capture[]>;
	takenActionListCheckEmpty: Observable<Action[]>;
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
	doableActionArray: Action[];
	doableHighPriorityActions: Action[];
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
	goals: number;
	takenActionListNotEmpty: boolean;
	captureListNotEmpty: boolean;
	language: string;
	captureArray: Capture[];
	actionArray: Action[];
	delegationArray: Delegation[];
	referenceArray: Reference[];
	takenActionArray: Action[];
	goalDict = {};
	projectColors: string[] = ['#F38787', '#F0D385', '#C784E4', '#B7ED7B', '#8793E8', '#87E8E5', '#B9BB86', '#EAA170']
 
  constructor(
		public navCtrl: NavController,
		private auth: AuthentificationProvider,
		private db: DataHandlingProvider,
		public platform: Platform,
		private fb: FormBuilder,
		public navParams: NavParams,
		private modalCtrl: ModalController,
		private alertCtrl: AlertController,
		public translate: TranslateService,
		private afDatabase: AngularFireDatabase
	) {
		if(!this.auth.checkLoggedIn) {
			this.navCtrl.setRoot(LoginPage);
		}
		this.isApp = !this.platform.is('core');
		if(this.isApp) {
			this.calendar.mode = 'day'
		} else {
			this.calendar.mode = 'week';
		}
		if(this.navParams.get('page') == 'capture') {
			this.goToCapturePage();
		} else if(this.navParams.get('page') == 'calendar') {
			this.goToCalendarPage();
		} else if(this.navParams.get('page') == 'todo') {
			this.goToToDoPage();
		} else if(this.navParams.get('page') == 'projects') {
			this.goToProjectsPage();
		} else if(this.navParams.get('page') == 'settings') {
			this.goToSettingsPage();
		} else {
			this.goToCapturePage();
		}
  	}

  	//HomePage functions
  	addCapture(capture: Capture) {
	    if(capture.content !== '' && capture.content !== null && capture.content !== undefined) {
	      this.errorMsg = "";
	      capture.userid = this.auth.userid;
	      capture.active = true;
	      this.db.addCapture(capture, this.auth.userid).then(ref => {
	        this.navCtrl.setRoot(HomePage);
	      })
	    } else {
	      this.errorMsg = "You cannot save an empty capture.";
	    }
  	}

  	deleteCapture(capture: Capture) {
  		this.db.deleteCapture(capture, this.auth.userid).then( () => this.goToCapturePage())
  	}

  	goToCapturePage() {
  		this.captureList = this.db.getCaptureListFromUser(this.auth.userid)
		.snapshotChanges()
		.map(
		changes => {
		return changes.map(c => ({
		  key: c.payload.key, userid: c.payload.val().userid, content: c.payload.val().content.replace(/\n/g, '<br>'), active: c.payload.val().active
		}))
		});
		this.captureList.subscribe( captureArray => {
			this.captureArray = []
			for(let capture of captureArray) {
				if(capture.active != false){
					this.captureArray.push(capture);
				}
			}
			this.captureListNotEmpty = (this.captureArray.length > 0);
		});
		this.takenActionList = this.db.getTakenActionListFromUser(this.auth.userid)
		.snapshotChanges()
		.map(
		changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
		});
		this.takenActionList.subscribe( takenActionArray => {
			this.takenActionArray = [];
			for(let action of takenActionArray) {
				if(action.active != false){
					this.takenActionArray.push(action);
				}
			}
			this.takenActionListNotEmpty = (this.takenActionArray.length > 0);
		});
  		this.viewpoint = 'CapturePage';
  		this.errorMsg = '';
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
		this.goalList.subscribe( goalArray => {
			this.goalArray = [];
			for(let goal of goalArray) {
				if(goal.active != false) {
					this.goalArray.push(goal);
				}
			}
		})
	  	this.newGoalForm = this.fb.group({
  			newGoal: ['', Validators.required]
    	});
  		this.viewpoint = 'ProcessCapturePage';
  		this.pageCtrl = '';
  		this.errorMsg = '';
  	}

  	goToProcessTakenActionPage(takenAction: Action) {
  		this.viewpoint = 'ProcessTakenActionPage';
  		this.pageCtrl = '';
  		this.takenAction = takenAction;
  		this.errorMsg = '';
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
	        	if(goal.active != false) {
		        	this.goalArray.push(goal);
			    	this.actionList = this.db.getNextActionListFromGoal(goal.key, this.auth.userid)
					  .snapshotChanges()
					  .map(
					  changes => {
						return changes.map(c => ({
						  key: c.payload.key, ...c.payload.val()
						}))
				    });
				    this.actionList.subscribe( actionArray => {
				    	this.actions[goal.key] = [];
				    	for(let action of actionArray) {
				    		if(action.active != false) {
				      			this.actions[goal.key].push(action);
				      		}
				      	}
				    });
				}
			};
	    });
  		this.viewpoint = 'ProjectsPage';
  		this.pageCtrl = '';
  		this.errorMsg = '';
  	}

  	goToToDoPage() {
  		this.goalList = this.db.getGoalList(this.auth.userid)
		  .snapshotChanges()
		  .map(
		  changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
	    });
		this.goalList.subscribe(
	      goalArray => {
  			this.goalArray = [];
	        for(let goal of goalArray) {
	        	if(goal.active != false) {
	        		this.goalDict[goal.key] = goal;
	        		this.goalArray.push(goal);
	        	}
	        }
	        console.log(this.goalDict)
	    })
  		this.giveTimeForm = this.fb.group({
      		timeEstimate: ['', Validators.required]
    	});
    	this.goal =  <Goal>{key: 'None'};;
    	this.viewpoint = 'ToDoPage';
    	this.pageCtrl = '';
    	this.errorMsg = '';
    	this.doableActionArray = [];
  	}

  	goToCalendarPage() {
  		this.goalArray = [];
  		this.goalList = this.db.getGoalList(this.auth.userid)
		  .snapshotChanges()
		  .map(
		  changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
	    });
	    this.goalList.subscribe(
	      goalArray => {
	        for(let goal of goalArray) {
	        	if(goal.active != false) {
	        		this.goalArray.push(goal);
	        	}
	        }
	    });
  		this.eventSource = [];
  		this.calendarEventList = this.db.getCalendarEventListFromUser(this.auth.userid)
			.snapshotChanges()
			.map(
			changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
			});
		this.calendarEventList.subscribe(
	      	calendarEventArray => {
	      	this.eventSource = [];
	        for(let calendarEvent of calendarEventArray) {
	        	if(calendarEvent.active != false) {
		        	let goal = this.goalArray.find(goal => goal.key == calendarEvent.goalid);
		        	if(goal) {
				    	calendarEvent.color = goal.color;
					} else {
						calendarEvent.color = "#C0C0C0";
					}
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
		this.viewpoint = 'CalendarPage';
		this.errorMsg = '';
  	}

  	goToSettingsPage() {
  		this.errorMsg = '';
  		this.viewpoint = 'SettingsPage';
  	}

  	// SettingsPage functions
  	logout() {
  		this.afDatabase.database.goOffline();
    	this.auth.signOut().then( () => this.navCtrl.setRoot(LoginPage));
    }

  	// ProcessCapturePage functions
  	addGoal(goalname) {
  		this.goalList.take(1).subscribe(
	      goalArray => {
	        if(goalname !== '' && goalname !== null && goalname !== undefined) {
				this.newGoal.userid = this.auth.userid;
				this.newGoal.name = goalname;
				this.newGoal.active = true;
				let numberGoals = goalArray.length;
				if(numberGoals < 8) {
					this.newGoal.color = this.projectColors[numberGoals];
				} else {
					this.newGoal.color = '#FFFFFF'
				}
				goalname = '';
				this.db.addGoal(this.newGoal, this.auth.userid);
				this.errorMsg = "";
			} else {
				this.errorMsg = "You cannot create a goal without a name.";
			}
	    });
	}

	addAction(goal, capture) {
		let modal = this.modalCtrl.create(DefineActionModalPage, {capture: capture});
		modal.present();
		modal.onDidDismiss(data => {
			if(data != 'cancel' && data.content) {
				let action: Action = data;
				action.userid = this.auth.userid;
				action.taken = false;
				action.goalid = goal.key;
				action.active = true;
				if(!action.priority) {
					action.priority = 0
				}
				if(!action.time) {
					action.time = 0
				}
				if(!capture) {
					capture = {} as Capture;
				}
				if(action.deadline) {
					let deadlineTime = new Date (action.deadline).setHours(2);
					let eventData: CalendarEvent = {
						userid: this.auth.userid,
						goalid: goal.key,
						startTime: new Date(action.deadline).toISOString(),
						endTime: new Date (deadlineTime).toISOString(),
						title: 'Deadline: ' + action.content,
						allDay: true,
						active: true,
						color: goal.color
					}
		            this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
		            	action.deadlineid = event.key;
		            	this.db.addAction(action, capture, this.auth.userid);
		            });
		        } else {
					this.db.addAction(action, capture, this.auth.userid);
				}
			}
		});
	}

	addDelegation(goal, capture) {
		let modal = this.modalCtrl.create(DefineDelegationModalPage, {capture: capture});
		modal.present();
		modal.onDidDismiss(data => {
			if(data != 'cancel' && data.content) {
				let delegation: Delegation = data;
				delegation.userid = this.auth.userid;
				delegation.goalid = goal.key;
				delegation.active = true;
				if(!capture) {
					capture = {} as Capture;
				}
				if(delegation.deadline) {
					let deadlineTime = new Date (delegation.deadline).setHours(2);
					let eventData: CalendarEvent = {
						userid: this.auth.userid,
						goalid: goal.key,
						startTime: new Date(delegation.deadline).toISOString(),
						endTime: new Date (deadlineTime).toISOString(),
						title: 'Deadline Delegation: ' + delegation.content,
						allDay: true,
						active: true,
						color: goal.color
					}
					this.db.addCalendarEvent(eventData, this.auth.userid).then( event => {
		            	delegation.deadlineid = event.key;
		            	this.db.addDelegation(delegation, capture, this.auth.userid);
		            });
				} else {
					this.db.addDelegation(delegation, capture, this.auth.userid);
				}
			}
		});
	}

	addReference(goal, capture) {
	    let modal = this.modalCtrl.create(DefineReferenceModalPage, {capture: capture});
		modal.present();
		modal.onDidDismiss(data => {
			if(data != 'cancel' && data.content) {
				let reference: Reference = data;
				reference.userid = this.auth.userid;
				reference.goalid = goal.key;
				reference.active = true;
				if(!capture) {
					capture = {} as Capture;
				}
				this.db.addReference(reference, capture, this.auth.userid);
			}
		});
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
		this.nextActionList = this.db.getNextActionListFromGoal(this.takenAction.goalid, this.auth.userid)
		  .snapshotChanges()
		  .map(
		  changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
	    });
		this.nextActionList.take(1).subscribe( nextActionArray => {
			if(nextActionArray.length == 1) {
				this.db.getGoalFromGoalid(this.takenAction.goalid, this.auth.userid).valueChanges().take(1).subscribe( goal => {
					goal.key = this.takenAction.goalid;
					this.db.deleteGoal(goal, this.auth.userid).then( () => {
						this.pageCtrl = 'goalFinished';
					});
				})
			} else {
				this.db.deleteAction(this.takenAction, this.auth.userid).then(() => this.goToCapturePage());
			}
		})
	}

	goalNotFinished() {
	this.db.getGoalFromGoalid(this.takenAction.goalid, this.auth.userid).valueChanges().take(1).subscribe( data => {
		let capture = {} as Capture;
		capture.content = 'Action finished: ' + this.takenAction.content + '\n from goal: ' + data.name;
		capture.userid = this.auth.userid;
		capture.active = true
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
			  key: c.payload.key, ...c.payload.val()
			}))
			});
		this.calendarEventList.subscribe(
	      	calendarEventArray => {
	      	this.eventSource = [];
	        for(let calendarEvent of calendarEventArray) {
	        	if(calendarEvent.active != false) {
		        	if(calendarEvent.goalid == goal.key) {
			        	calendarEvent.startTime = new Date(calendarEvent.startTime);
			        	calendarEvent.endTime = new Date(calendarEvent.endTime);
			        	this.eventSource.push(calendarEvent);
			        }
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
		this.referenceList.subscribe( referenceArray => {
			this.referenceArray = [];
			for( let reference of referenceArray) {
				if(reference.active != false) {
					this.referenceArray.push(reference);
				}
			}
		});
	    this.nextActionList = this.db.getNextActionListFromGoal(goal.key, this.auth.userid)
		  .snapshotChanges()
		  .map(
		  changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
	    });
		this.nextActionList.subscribe( actionArray => {
			this.actionArray = [];
			for( let action of actionArray) {
				if(action.active != false) {
					this.actionArray.push(action);
				}
			}
		});
	    this.delegationList = this.db.getDelegationListFromGoal(goal.key, this.auth.userid)
		  .snapshotChanges()
		  .map(
		  changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
	    });
		this.delegationList.subscribe( delegationArray => {
			this.delegationArray = [];
			for( let delegation of delegationArray) {
				if(delegation.active != false) {
					this.delegationArray.push(delegation);
				}
			}
		});
	}

  	reviewAction(action: Action) {
		let modal = this.modalCtrl.create(ActionDetailsModalPage, {action: action});
		modal.present()
		this.reviewGoal(this.goal);
  	}

	reviewDelegation(delegation: Delegation) {
		let modal = this.modalCtrl.create(DelegationDetailsModalPage, {delegation: delegation});
		modal.present();
		this.reviewGoal(this.goal);
	}

  	reviewReference(reference: Reference) {
		let modal = this.modalCtrl.create(MaterialDetailsModalPage, {reference: reference});
		modal.present();
		this.reviewGoal(this.goal);
  	}

  	editGoal(goal: Goal) {
  		let modal = this.modalCtrl.create(GoalDetailsModalPage, {goal: goal});
  		modal.present();
  		this.reviewGoal(this.goal);
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

  	deleteGoal(goal: Goal) {
  		console.log('goal.key');
  		console.log(goal);
  		this.translate.get(["Are you sure you want to delete this goal?", "No", "Delete"]).subscribe( alertMessage => {
  		let alert = this.alertCtrl.create({
			message: alertMessage["Are you sure you want to delete this goal?"],
			buttons: [
				    	{
					        text: alertMessage["No"]
				      	},
				      	{
					        text: alertMessage["Delete"],
					        handler: () => {
					          	this.db.deleteGoal(goal, this.auth.userid).then( () => this.goToProjectsPage());
					        }
				      	}
				    ]
		});
		alert.present();
  		});
  	}

  	// ToDoPage functions

  	chooseGoal(goalid) {
  		if(goalid != 'None') {
	  		this.db.getGoalFromGoalid(goalid, this.auth.userid).valueChanges().take(1).subscribe( goal => {
			this.goal = {key: goalid, name: goal.name, userid: goal.userid, color: goal.color};
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
	    this.actionList = this.db.getNextActionListFromUser(this.auth.userid)
		  .snapshotChanges()
		  .map(
		  changes => {
			return changes.map(c => ({
			  key: c.payload.key, ...c.payload.val()
			}))
	    });
	    this.actionList.subscribe(
	      actionArray => {
	      	this.doableActionArray = [];
	        for(let action of actionArray) {
	        	if(action.active != false) {
					if(Number(action.time) <= Number(this.giveTimeForm.value.timeEstimate) && !action.taken && ((action.goalid == this.goal.key) || this.goal.key == 'None')) {
					this.doableActionArray.push(action);
					}
				}
	        }
	        this.doableActionArray = this.doableActionArray.reverse();
	        if(this.doableActionArray.length == 0) {
	        	this.errorMsg = "There is no doable action for that time.";
	        } else {
	        	this.errorMsg = '';
	        }
	      }
	    );
  	}

  	takeThisAction(action: Action) {
	    action.taken = true;
	    this.db.editAction(action, this.auth.userid);
	    this.doableActionArray.splice(this.doableActionArray.indexOf(action), 1);
	    this.errorMsg = "Great, have fun while taking Action! Visit the Captures to process this action when you finished it.";
  	}

  	// CalendarPage functions
  	addEvent(){
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
	        	if(goal.active != false) {
	        		this.goalArray.push(goal);
	        	}
	        }
	    });
  		this.selectedDay = new Date();
		let modal = this.modalCtrl.create(CalendarEventModalPage, {selectedDay: this.selectedDay});
		modal.present();
		modal.onDidDismiss(data => {
			if(data) {
				let eventData: CalendarEvent = data;
				eventData.userid = this.auth.userid;
				eventData.allDay = false;
				eventData.active = true;
				if(!data.goalid) {
					eventData.color = "#C0C0C0";
					eventData.goalid = '';
				} else {
				    let goal = this.goalArray.find(goal => goal.key == data.goalid);
				    if(goal) {
				    	eventData.color = goal.color;
					} else {
						eventData.color = "#C0C0C0";
					}
				}
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
					message: goal + time,
					buttons: [
						    	{
							        text: 'OK'
						      	},
						      	{
							        text: 'Delete',
							        handler: () => {
							          	this.db.deleteCalendarEvent(event.key, this.auth.userid)
							          	this.goToCalendarPage();
							        }
						      	}
						    ]
			});
			alert.present();
		});
	}

	onViewTitleChanged(title) {
		this.viewTitle = title;
	}

	onTimeSelected(event) {
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
	        	if(goal.active != false) {
	        		this.goalArray.push(goal);
	        	}
	        }
	    });
		if(event.events == undefined || event.events.length == 0) {
		this.selectedDay = new Date(event.selectedTime);
		let modal = this.modalCtrl.create(CalendarEventModalPage, {selectedDay: this.selectedDay});
		modal.present();
		modal.onDidDismiss(data => {
			if(data){
				let eventData: CalendarEvent = data;
				eventData.userid = this.auth.userid;
				eventData.allDay = false;
				eventData.active = true;
				if(!data.goalid) {
					eventData.color = "#C0C0C0";
					eventData.goalid = '';
				} else {
				    let goal = this.goalArray.find(goal => goal.key == data.goalid);
				    if(goal) {
				    	eventData.color = goal.color;
					} else {
						eventData.color = "#C0C0C0";
					}
				}
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