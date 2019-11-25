import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { Reference } from '../../model/reference/reference.model';

@IonicPage()
@Component({
  selector: 'page-material-details-modal',
  templateUrl: 'material-details-modal.html',
})
export class MaterialDetailsModalPage {

	reference = {} as Reference;
  defineReferenceForm: FormGroup

  constructor(
	  	public navCtrl: NavController,
		private auth: AuthentificationProvider,
	  	private navParams: NavParams,
	  	private db: DataHandlingProvider,
	  	public viewCtrl: ViewController,
	  	public translate: TranslateService,
      public fb: FormBuilder
  	) {
    this.reference = this.navParams.get('reference');
    this.defineReferenceForm = this.fb.group({
      content: ['', Validators.required]
      });
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }

  deleteReference(reference: Reference) {
    	this.db.deleteReference(reference, this.auth.userid);
    	this.viewCtrl.dismiss();
  }

  saveReference() {
    this.reference.content = this.defineReferenceForm.value.content;
    let referencekey = this.reference.key;
    this.db.editReference(this.reference, this.auth.userid);
    this.reference.key = referencekey;
    this.viewCtrl.dismiss();
  }

}
