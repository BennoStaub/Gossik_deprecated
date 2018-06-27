import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { Capture } from '../../model/capture/capture.model';
import { Project } from '../../model/project/project.model';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-add-reference',
  templateUrl: 'add-reference.html',
})
export class AddReferencePage {

  capture: Capture;
  newProject: Project = {
   name: '' 
  };
  projectList: Observable<Project[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthentificationProvider,
    private dataHandlingProvider: DataHandlingProvider
  ) {
    if(!this.auth.checkLoggedIn) {
			this.navCtrl.setRoot(LoginPage);
		}
    this.capture = this.navParams.get('capture');
    this.projectList = this.dataHandlingProvider.getProjectList()
	  .snapshotChanges()
	  .map(
	  changes => {
		return changes.map(c => ({
		  key: c.payload.key, ...c.payload.val()
		}))
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddReferencePage with capture: ' + this.capture.content);
  }

  addProject(newProject) {
    this.dataHandlingProvider.addProject(newProject);
  }

}
