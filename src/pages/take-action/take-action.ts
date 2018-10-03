import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Action } from '../../model/action/action.model';
import { Observable } from 'rxjs/Observable';
import { Goal } from '../../model/goal/goal.model';
import 'rxjs/add/operator/take';


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
  doableHighPriorityActions: Action[] = [];
  goalFromAction = {} as Goal;
  

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
    this.doableActionList.take(1).subscribe(
      doableActionArray => {
        for(let doableAction of doableActionArray) {
          if(Number(doableAction.time) <= Number(this.giveTimeForm.value.timeEstimate) && !doableAction.taken) {
            this.doableActionArray.push(doableAction);
          }
        };
        if(this.doableActionArray.length > 0) {
          for(let numberDoableHighPriorityActions: number = 0; numberDoableHighPriorityActions < 3; numberDoableHighPriorityActions++) {
            if(this.doableActionArray.length == 0) {
              continue;
            }
            let maxPriority = 0;
            let index = 0;
            for(let counter: number = 0; counter <= this.doableActionArray.length-1; counter++) {
              if(this.doableActionArray[counter].priority > maxPriority) {
                maxPriority = this.doableActionArray[counter].priority;
                index = counter;
              }
            }
            this.doableHighPriorityActions.push(this.doableActionArray[index]);
            this.doableActionArray.splice(index, 1);
          }
          this.pageCtrl = 'showActions';
          this.errorMsg = '';
        } else {
          this.errorMsg = 'There is no doable action within that time.';
        };
      }
    );
  }

  takeThisAction(action: Action) {
    action.taken = true;
    this.db.editAction(action, this.auth.userid).then( () => {
      this.pageCtrl = 'actionTaken';
    });
  }

}
