import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { AuthentificationProvider } from '../../providers/authentification/authentification';

import { TranslateService } from '@ngx-translate/core';

import { Reference } from '../../model/reference/reference.model';

@IonicPage()
@Component({
  selector: 'page-material-details-modal',
  templateUrl: 'material-details-modal.html',
})
export class MaterialDetailsModalPage {

	material = {} as Reference;

  constructor(
	  	public navCtrl: NavController,
		private auth: AuthentificationProvider,
	  	private navParams: NavParams,
	  	private db: DataHandlingProvider,
	  	public viewCtrl: ViewController,
	  	public translate: TranslateService
  	) {
    this.material = this.navParams.get('material');
  }
 
  cancel() {
    this.viewCtrl.dismiss();
  }

  deleteMaterial(material: Reference) {
    	this.db.deleteReference(material, this.auth.userid);
    	this.viewCtrl.dismiss();
  }

}
