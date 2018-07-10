import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Capture } from '../../model/capture/capture.model';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';

import { HomePage } from '../home/home';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { Goal } from '../../model/goal/goal.model';
import { Reference } from '../../model/reference/reference.model';


@IonicPage()
@Component({
  selector: 'page-process-capture',
  templateUrl: 'process-capture.html',
})
export class ProcessCapturePage {
  
  capture: Capture;
  goalList: Observable<Goal[]>;
  referenceList: Observable<Reference[]>;
  newGoal = {} as Goal;
  processCtrl: string = 'start';
  assignedGoal = {} as Goal;

  constructor(
	  public navCtrl: NavController,
	  public navParams: NavParams,
    private dataHandlingProvider: DataHandlingProvider,
    private auth: AuthentificationProvider,
    private db: DataHandlingProvider
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
  
  removeCapture(capture: Capture) {
    this.dataHandlingProvider.removeCapture(capture).then(ref => {
      this.navCtrl.setRoot(HomePage);
    })
  }

  processCapture() {
    this.processCtrl = 'chooseGoal';
  }

  addGoal(goalname) {
    this.newGoal.userid = this.auth.userid;
    this.newGoal.name = goalname;
    this.db.addGoal(this.newGoal).then( ref => this.addToGoal(ref));
  }

  addToGoal(goal){
    this.processCtrl = 'reviewGoal';
    this.referenceList = this.db.getReferenceListFromGoal(goal.key)
	  .snapshotChanges()
	  .map(
	  changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
    });
    this.assignedGoal = goal;
    
  }

  
  //Adding reference to goal and remove capture then:
  //this.db.addReferenceToGoal(this.capture, project).then( () => this.db.removeCapture(this.capture)).then( () => this.navCtrl.setRoot(HomePage));
}
