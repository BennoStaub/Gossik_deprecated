import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Capture } from '../../model/capture/capture.model';
import { Project } from '../../model/project/project.model';
import { User } from '../../model/user/user.model';


@Injectable()
export class DataHandlingProvider {
    userData = {} as User;
 
    constructor(private db: AngularFireDatabase) { }
    
    createUser(userid, email) {
        console.log('create user with id ' + userid);
        this.userData.email = email;
        return this.db.list('users').set(userid, this.userData); 
    }

    getCaptureList(userid) {
        return this.db.list('/captures', ref => ref.orderByChild('userid').equalTo(userid));
    }
 
    addCapture(capture: Capture) {
        return this.db.list('/captures').push(capture);
    }
	
	removeCapture(capture: Capture) {
        return this.db.list('/captures').remove(capture.key);
	}
    
    getProjectList(userid) {
        return this.db.list('/projects', ref => ref.orderByChild('userid').equalTo(userid));
    }

    addProject(project: Project) {
        return this.db.list('/projects').push(project);
    }

    addReferenceToProject(reference, project){
        return this.db.list('/projects/' + project.key + '/references').push(reference.content);
    }
}
