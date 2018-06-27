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
      userid: 'hello'
  };
 
    constructor(private db: AngularFireDatabase) { }
    
    createUser(user) {
        console.log('create user with id' + user.userid);
        //this.db.list<User>('users').push(this.userData);
        //this.db.list('users/').set(user.userid, {userid: 'mim'});
        //this.db.list('users').set(user.userid, this.userData);
        //this.db.list('users/').set(user.userid, this.userData);
        //this.db.list('users').set(user.userid, {userid: 'mim'});
        //this.db.list('users/').set('hihosdfkasflf', {userid: 'mim'});
        //this.db.list('users').set('hihosdfkasflf', this.userData);
        //this.db.list('users/').set('hihosdfkasflf', this.userData);
        //this.db.list('users').set('hihosdfkasflf', this.userData);
        return this.db.list('users').set(user.userid, {userid: 'mim'}); 
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
