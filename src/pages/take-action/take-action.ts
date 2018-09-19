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
  topPriorityDoableActions: Action[] = [];
  finalArray: Action[] = [];

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
        for(let doableAction of doableActionArray) {
          if(Number(doableAction.time) <= this.giveTimeForm.value.timeEstimate) {
            this.doableActionArray.push(doableAction);
          }
        };
        if(this.doableActionArray.length > 0) {
          let oldArray: Action[] = this.doableActionArray;
          let newArray: Action[] = [];
          for(let numberDoableHighPriorityActions:number = 0; numberDoableHighPriorityActions < 3; numberDoableHighPriorityActions++) {
            if(oldArray.length == 0) {
              continue;
            }
            let maxPriority = 0;
            let index = 0;
            for(let counter: number = 0; counter <= oldArray.length-1; counter++) {
              if(oldArray[counter].priority > maxPriority) {
                maxPriority = oldArray[counter].priority;
                index = counter;
              }
            }
            newArray.push(oldArray[index]);
            oldArray.splice(index, 1);
          }
          this.finalArray = newArray;
          this.pageCtrl = 'showActions';
          this.errorMsg = '';
        } else {
          this.errorMsg = 'There is no doable action within that time.';
        };
      }
    );
  }
}
