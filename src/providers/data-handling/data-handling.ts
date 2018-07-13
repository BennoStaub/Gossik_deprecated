import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Capture } from '../../model/capture/capture.model';
import { Goal } from '../../model/goal/goal.model';
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
    
    getGoalList(userid) {
        return this.db.list('/goals', ref => ref.orderByChild('userid').equalTo(userid));
    }

    addGoal(goal: Goal) {
        return this.db.list('/goals').push(goal);
    }

    getReferenceListFromGoal(goalid) {
        return this.db.list('/goals/' + goalid + '/references');
    }

    getNextActionListFromGoal(goalid) {
        return this.db.list('/goals/' + goalid + '/nextActions', ref => ref.orderByChild('delegated').equalTo(false));
    }

    getWaitingForListFromGoal(goalid) {
        return this.db.list('/goals/' + goalid + '/nextActions', ref => ref.orderByChild('delegated').equalTo(true));
    }

    addNextActionToGoal(action, goal, capture) {
        return this.db.list('/goals/' + goal.key + '/nextActions').push(action).then( () => this.removeCapture(capture));
    }

    addReferenceToGoal(reference, goal){
        return this.db.list('/goals/' + goal.key + '/references').push(reference.content);
    }
}
