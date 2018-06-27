import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Capture } from '../../model/capture/capture.model';
import { Project } from '../../model/project/project.model';
import { User } from '../../model/user/user.model';


@Injectable()
export class DataHandlingProvider {

  private captureListRef = this.db.list<Capture>('capture');
  private projectListRef = this.db.list<Project>('project');
  userData: User = {
      userid: '',
      email: ''
  };
 
    constructor(private db: AngularFireDatabase) { }
    
    createUser(userid, email) {
        console.log('create user with id ' + userid);
        this.userData.userid = userid;
        this.userData.email = email;
        return this.db.list('users').set(userid, this.userData); 
    }

    getCaptureList() {
        return this.captureListRef;
    }
 
    addCapture(capture: Capture) {
        return this.captureListRef.push(capture);
    }
	
	removeCapture(capture: Capture) {
        return this.captureListRef.remove(capture.key);
	}
    
    getProjectList() {
        return this.projectListRef;
    }

    addProject(project: Project) {
        return this.projectListRef.push(project);
    }
}
