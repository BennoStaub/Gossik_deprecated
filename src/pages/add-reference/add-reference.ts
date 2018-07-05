import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';
import { Capture } from '../../model/capture/capture.model';
import { Project } from '../../model/project/project.model';
import { LoginPage } from '../login/login';
import { Observable } from 'rxjs/Observable';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-add-reference',
  templateUrl: 'add-reference.html',
})
export class AddReferencePage {

  capture: Capture;
  projectList: Observable<Project[]>;
  newProject = {} as Project;
  projectname: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthentificationProvider,
    private db: DataHandlingProvider
  ) {
    if(!this.auth.checkLoggedIn) {
			this.navCtrl.setRoot(LoginPage);
		}
    this.capture = this.navParams.get('capture');
    this.projectList = this.db.getProjectList(this.auth.userid)
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

  addProject(projectname) {
    this.newProject.userid = this.auth.userid;
    this.newProject.name = projectname;
    this.db.addProject(this.newProject).then( ref => this.addToProject(ref));
  }

  addToProject(project){
    this.db.addReferenceToProject(this.capture, project).then( () => this.db.removeCapture(this.capture)).then( () => this.navCtrl.setRoot(HomePage));
  }

}
