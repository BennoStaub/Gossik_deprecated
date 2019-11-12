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
  minDate = new Date(new Date().setHours(0,0,0,0)).toISOString();
 
  constructor(public navCtrl: NavController, private navParams: NavParams, public viewCtrl: ViewController) {
    let preselectedDate = moment(this.navParams.get('selectedDay')).format();
    this.event.startTime = preselectedDate;
    this.event.endTime = preselectedDate;
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }
 
  save() {
    console.log('save modal this.event.startTime');
    console.log(this.event.startTime)
    this.viewCtrl.dismiss(this.event);
  }
 
}
