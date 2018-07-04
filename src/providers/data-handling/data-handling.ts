import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Capture } from '../../model/capture/capture.model';
import { Project } from '../../model/project/project.model';
import { User } from '../../model/user/user.model';


@Injectable()
export class DataHandlingProvider {
  private captureListRef : any;//this.db.list<Capture>('/capture', ref => ref.orderByChild('userid'));
  private projectListRef = this.db.list<Project>('project');
  userData: User = {
      email: ''
  };
 
    constructor(private db: AngularFireDatabase) { }
    
    createUser(userid, email) {
        console.log('create user with id ' + userid);
        this.userData.email = email;
        return this.db.list('users').set(userid, this.userData); 
    }

    getCaptureList(userid) {
        return this.db.list('/capture', ref => ref.orderByChild('userid').equalTo(userid));
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
