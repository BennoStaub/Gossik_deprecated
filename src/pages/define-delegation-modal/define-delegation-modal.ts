import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Capture } from '../../model/capture/capture.model';

/**
 * Generated class for the DefineDelegationModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-define-delegation-modal',
  templateUrl: 'define-delegation-modal.html',
})
export class DefineDelegationModalPage {

	deadline: boolean;
	defineDelegationForm: FormGroup;
  capture = {} as Capture;
  monthLabels = [];
  dayLabels = [];

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
  	public translate: TranslateService,
  	public fb: FormBuilder
  	) {
    if(this.navParams.get('capture')) {
      this.capture = this.navParams.get('capture');
    } else {
      this.capture = {} as Capture;
    }
    this.defineDelegationForm = this.fb.group({
		  content: ['', Validators.required],
		  deadline: ['', Validators.required]
    });
    this.translate.get(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']).subscribe( monthLabels => {
      this.monthLabels = [
      monthLabels['Jan'],
      monthLabels['Feb'],
      monthLabels['Mar'],
      monthLabels['Apr'],
      monthLabels['May'],
      monthLabels['Jun'],
      monthLabels['Jul'],
      monthLabels['Aug'],
      monthLabels['Sep'],
      monthLabels['Oct'],
      monthLabels['Nov'],
      monthLabels['Dec']
      ];
    });
    this.translate.get(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).subscribe( dayLabels => {
      this.dayLabels = [
      dayLabels['Sun'],
      dayLabels['Mon'],
      dayLabels['Tue'],
      dayLabels['Wed'],
      dayLabels['Thu'],
      dayLabels['Fri'],
      dayLabels['Sat']
      ];
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DefineDelegationModalPage');
  }

  cancel() {
    this.viewCtrl.dismiss('cancel');
  }

  addDelegation() {
  	this.viewCtrl.dismiss(this.defineDelegationForm.value)
  }

  deadlineSelected(event) {
    let deadlineFixed = new Date (event).setHours(2);
    this.defineDelegationForm.value.deadline = new Date (deadlineFixed).toISOString();
  }

}
