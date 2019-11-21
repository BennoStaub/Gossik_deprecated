import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

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

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
  	public translate: TranslateService,
  	public fb: FormBuilder
  	) {
  	this.defineDelegationForm = this.fb.group({
		content: ['', Validators.required],
		deadline: ['', Validators.required]
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

}
