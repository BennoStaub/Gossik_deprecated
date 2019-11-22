import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { Capture } from '../../model/capture/capture.model';

/**
 * Generated class for the DefineActionModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-define-action-modal',
  templateUrl: 'define-action-modal.html',
})
export class DefineActionModalPage {

	deadline: boolean;
	defineActionForm: FormGroup;
  capture = {} as Capture;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
  	public translate: TranslateService,
  	public fb: FormBuilder
  	) {
    this.capture = this.navParams.get('capture');
  	this.defineActionForm = this.fb.group({
		content: ['', Validators.required],
		priority: ['', Validators.required],
		deadline: ['', Validators.required],
		time: ['', Validators.required]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DefineActionModalPage');
  }

  cancel() {
    this.viewCtrl.dismiss('cancel');
  }

  addAction() {
  	this.viewCtrl.dismiss(this.defineActionForm.value)
  }

}
