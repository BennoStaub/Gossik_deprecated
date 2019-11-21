import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

/**
 * Generated class for the DefineReferenceModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-define-reference-modal',
  templateUrl: 'define-reference-modal.html',
})
export class DefineReferenceModalPage {

	defineReferenceForm: FormGroup;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public viewCtrl: ViewController,
  	public translate: TranslateService,
  	public fb: FormBuilder
  	) {
  		this.defineReferenceForm = this.fb.group({
			content: ['', Validators.required]
	    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DefineReferenceModalPage');
  }

  cancel() {
    this.viewCtrl.dismiss('cancel');
  }

  addReference() {
  	this.viewCtrl.dismiss(this.defineReferenceForm.value)
  }

}
