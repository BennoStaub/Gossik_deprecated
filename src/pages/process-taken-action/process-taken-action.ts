import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Action } from '../../model/action/action.model';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { Capture } from '../../model/capture/capture.model';
import { HomePage } from '../home/home';

/**
 * Generated class for the ProcessTakenActionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-process-taken-action',
  templateUrl: 'process-taken-action.html',
})
export class ProcessTakenActionPage {

  takenAction = {} as Action;
  pageCtrl: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DataHandlingProvider,
    private auth: AuthentificationProvider
    ) {
      this.pageCtrl = '';
      this.takenAction = this.navParams.get('takenAction');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProcessTakenActionPage');
  }

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
      this.db.removeAction(this.takenAction, this.auth.userid).then( () => {
        this.db.addCapture(capture, this.auth.userid);
        this.navCtrl.setRoot(HomePage);
      });
    });
  }
}
