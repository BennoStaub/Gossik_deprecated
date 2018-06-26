import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';



import { Capture } from '../../model/capture/capture.model';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  
  captureList: Observable<Capture[]>
 
  constructor(public navCtrl: NavController, private dataHandlingProvider: DataHandlingProvider) {
	  this.captureList = this.dataHandlingProvider.getCaptureList()
	  .snapshotChanges()
	  .map(
	  changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
	  });
  }
 
}