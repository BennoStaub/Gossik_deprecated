import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Action } from '../../model/action/action.model';
import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-take-action',
  templateUrl: 'take-action.html',
})
export class TakeActionPage {

  pageCtrl: string = '';
  doableActionList: Observable<Action[]>;
  doableAction = {} as Action;
  giveTimeForm: FormGroup;
  doableActionArray: Action[] = [];
  errorMsg: string = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: DataHandlingProvider,
    private auth: AuthentificationProvider,
    private fb: FormBuilder
  ) {
    this.giveTimeForm = this.fb.group({
      timeEstimate: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TakeActionPage');
  }

  showDoableActions() {
    this.doableActionList = this.db.getNextActionListFromUser(this.auth.userid)
	  .snapshotChanges()
	  .map(
	  changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
    });
    this.doableActionList.subscribe(
      doableActionArray => {
        for(this.doableAction of doableActionArray) {
          if(this.doableAction.time <= this.giveTimeForm.value.timeEstimate) {
            console.log(this.doableActionArray.indexOf(this.doableAction));
            this.doableActionArray.push(this.doableAction)
          }
        };
        if(this.doableActionArray.length > 0) {
          this.pageCtrl = 'showActions';
          this.errorMsg = '';
        } else {
          this.errorMsg = 'There is no doable action within that time.';
        };
      }
    );
  }
}
