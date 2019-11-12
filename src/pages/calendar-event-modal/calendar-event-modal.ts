import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';


import { CalendarEvent } from '../../model/CalendarEvent/calendarEvent.model';

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
 
  constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    console.log('calendar event modal: preselectedDate');
    console.log(preselectedDate);
    this.eventStartTimeISOString = preselectedDate;
    this.eventEndTimeISOString = preselectedDate;
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }
 
  save() {
  	this.event.startTime = new Date(this.eventStartTimeISOString);
  	this.event.endTime = new Date(this.eventEndTimeISOString);
    this.viewCtrl.dismiss(this.event);
  }
 
}
