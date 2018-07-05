import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { Capture } from '../../model/capture/capture.model';
import { Goal } from '../../model/goal/goal.model';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-add-reference',
  templateUrl: 'add-reference.html',
})
export class AddReferencePage {

  capture: Capture;
  goalList: Observable<Goal[]>;
  newGoal = {} as Goal;
  goalname: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
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
    console.log('ionViewDidLoad AddReferencePage with capture: ' + this.capture.content);
  }

  addGoal(goalname) {
    this.newGoal.userid = this.auth.userid;
    this.newGoal.name = goalname;
    this.db.addGoal(this.newGoal).then( ref => this.addToGoal(ref));
  }

  addToGoal(project){
    this.db.addReferenceToGoal(this.capture, project).then( () => this.db.removeCapture(this.capture)).then( () => this.navCtrl.setRoot(HomePage));
  }

}
