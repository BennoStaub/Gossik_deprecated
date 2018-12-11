import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment'

/**
 * Generated class for the CalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html',
})
export class CalendarPage {

	eventSource = [];
  	viewTitle: string;
  	selectedDay = new Date();
 
  	calendar = {
    	mode: 'month',
    	currentDate: new Date()
  	};
  	constructor(
  			public navCtrl: NavController,
  			public navParams: NavParams,
  			private modalCtrl: ModalController,
  			private alertCtrl: AlertController
  		) {
  	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad CalendarPage');
  	}

  	addEvent(){
  		let modal = this.modalCtrl.create('CalendarEventModalPage', {selectedDay: this.selectedDay});
	    modal.present();
	    modal.onDidDismiss(data => {
	      if (data) {
	        let eventData = data;
	 
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
      		subTitle: 'From: ' + start + '<br>To: ' + end,
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
