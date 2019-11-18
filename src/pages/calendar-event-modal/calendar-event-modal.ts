import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';


import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';

import { CalendarEvent } from '../../model/calendarEvent/calendarEvent.model';
import { Goal } from '../../model/goal/goal.model';

@IonicPage()
@Component({
  selector: 'page-calendar-event-modal',
  templateUrl: 'calendar-event-modal.html',
})
export class CalendarEventModalPage {

  	event = {} as CalendarEvent;
  	eventStartTimeISOString: string;
  	eventEndTimeISOString: string;
  	minDate = new Date(new Date().setHours(0,0,0,0)).toISOString();
	goalList: Observable<Goal[]>;
	goalid: string;
 
  constructor(
  		public navCtrl: NavController,
  		private navParams: NavParams,
  		public viewCtrl: ViewController,
		private auth: AuthentificationProvider,
		private db: DataHandlingProvider
	) {
	    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
	    console.log('calendar event modal: preselectedDate');
	    console.log(preselectedDate);
	    this.eventStartTimeISOString = preselectedDate;
	    this.eventEndTimeISOString = preselectedDate;
	    this.goalList = this.db.getGoalList(this.auth.userid)
			  .snapshotChanges()
			  .map(
			  changes => {
				return changes.map(c => ({
				  key: c.payload.key, ...c.payload.val()
			}))
		});
  	}
 
	cancel() {
		this.viewCtrl.dismiss();
	}
 
	save() {
		this.event.startTime = this.eventStartTimeISOString;
		this.event.endTime = this.eventEndTimeISOString;
		this.event.goalid = this.goalid;
		this.viewCtrl.dismiss(this.event);
	}
 
}
