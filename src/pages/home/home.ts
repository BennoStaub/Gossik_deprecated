import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Capture } from '../../model/capture/capture.model';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { LoginPage } from '../login/login';
import { Action } from '../../model/action/action.model';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  
	captureList: Observable<Capture[]>;
	takenActionList: Observable<Action[]>;
	newCapture = {} as Capture;
	errorMsg: String;
 
  constructor(
		public navCtrl: NavController,
		private auth: AuthentificationProvider,
		private db: DataHandlingProvider
	) {
		if(!this.auth.checkLoggedIn) {
			this.navCtrl.setRoot(LoginPage);
		}
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
 
}