import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import * as moment from 'moment'

import { CalendarEvent } from '../../model/CalendarEvent/calendarEvent.model';


@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

	eventSource = [];
	calendarEventList: Observable<CalendarEvent[]>;
	viewTitle: string;
	selectedDay = new Date();

	calendar = {
		mode: 'week',
		currentDate: new Date()
	};
	constructor(
			public navCtrl: NavController,
			public navParams: NavParams,
			private modalCtrl: ModalController,
			private alertCtrl: AlertController,
			private auth: AuthentificationProvider,
			private db: DataHandlingProvider
		) {
			if(!this.auth.checkLoggedIn) {
				this.navCtrl.setRoot(LoginPage);
			}
			
			this.calendarEventList = this.db.getCalendarEventListFromUser(this.auth.userid)
			.snapshotChanges()
			.map(
			changes => {
			return changes.map(c => ({
			  key: c.payload.key, userid: c.payload.val().userid, goalid: c.payload.val().goalid, startTime: c.payload.val().startTime, endTime: c.payload.val().endTime, title: c.payload.val().title
			}))
			});
			this.calendarEventList.take(1).subscribe(
		      calendarEventArray => {
		        for(let calendarEvent of calendarEventArray) {
		        	console.log('startTime');
		        	console.log(calendarEvent.startTime);
		        	console.log('endTime');
		        	console.log(calendarEvent.endTime);
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
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad CalendarPage');
	}


	addEvent(){
		let modal = this.modalCtrl.create('CalendarEventModalPage', {selectedDay: this.selectedDay});
		modal.present();
		modal.onDidDismiss(data => {
			if (data) {
				let eventData: CalendarEvent = data;
				eventData.userid = this.auth.userid;
				eventData.startTime = Date.parse(data.startTime);
				eventData.endTime = Date.parse(data.endTime);
				this.db.addCalendarEvent(eventData, this.auth.userid)
				eventData.startTime = new Date(data.startTime);
				eventData.endTime = new Date(data.endTime);
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
		let start = moment(event.startTime).format('LLLL');
		let end = moment(event.endTime).format('LLLL');

		let alert = this.alertCtrl.create({
				title: '' + event.title,
				subTitle: 'Userid:' + event.userid + 'Goalid:' + event.goalid + 'From: ' + start + '<br>To: ' + end,
				buttons: ['OK']
		})
	alert.present();
	}

	onViewTitleChanged(title) {
		this.viewTitle = title;
	}

	onTimeSelected(event) {
		this.selectedDay = event.selectedTime
	}

}
