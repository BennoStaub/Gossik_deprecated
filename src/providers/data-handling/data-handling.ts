import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Capture } from '../../model/capture/capture.model';
import { Goal } from '../../model/goal/goal.model';
import { User } from '../../model/user/user.model';
import { Action } from '../../model/action/action.model';
import { Reference } from '../../model/reference/reference.model';


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
 
    addCapture(capture: Capture, userid) {
        return this.db.list('/captures').push(capture).then( ref => {
            this.db.list('/users/' + userid + '/captures').set(ref.key, capture);
        });
    }
	
	removeUnprocessedCapture(capture: Capture, userid) {
        this.db.list('/users/' + userid + '/captures').remove(capture.key);
        return this.db.list('/captures').remove(capture.key);
    }
    
    removeAction(action: Action, userid, goalkey) {
        console.log(action);
        this.db.list('/users/' + userid + '/nextActions').remove(action.key);
        this.db.list('/goals/' + goalkey + '/nextActions').remove(action.key);
        return this.db.list('/nextActions').remove(action.key);
	}
    
    getGoalList(userid) {
        return this.db.list('/goals', ref => ref.orderByChild('userid').equalTo(userid));
    }

    addGoal(goal: Goal, userid) {
        return this.db.list('/goals').push(goal).then( ref => {
            this.db.list('/users/' + userid + '/goals').set(ref.key, goal);
        });
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

    addNextActionToGoal(action: Action, goal: Goal, capture: Capture, userid) {
        return this.db.list('/goals/' + goal.key + '/nextActions').push(action).then( ref => {
            this.db.list('/nextActions').set(ref.key, action);
            this.db.list('users/' + userid + '/nextActions').set(ref.key, action);
        }).then( () => this.removeUnprocessedCapture(capture, userid));
    }
    
    editNextAction(newAction: Action, action: Action, goal: Goal, userid) {
        console.log(action);
        return this.removeAction(action, userid, goal.key).then( () => {this.db.list('/goals/' + goal.key + '/nextActions').push(newAction).then( ref => {
            this.db.list('/nextActions').set(ref.key, newAction);
            this.db.list('users/' + userid + '/nextActions').set(ref.key, newAction);
        })});
    }

    addReferenceToGoal(reference: Reference, goal: Goal, capture: Capture, userid){
        return this.db.list('/goals/' + goal.key + '/references').push(reference).then( ref => {
            this.db.list('/references').set(ref.key, reference);
            this.db.list('/users/' + userid + '/references').set(ref.key, reference);
        }).then( () => this.removeUnprocessedCapture(capture, userid));
    }
}
