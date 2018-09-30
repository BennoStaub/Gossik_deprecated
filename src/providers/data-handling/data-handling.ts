import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Capture } from '../../model/capture/capture.model';
import { Goal } from '../../model/goal/goal.model';
import { User } from '../../model/user/user.model';
import { Action } from '../../model/action/action.model';
import { Reference } from '../../model/reference/reference.model';
import { Delegation } from '../../model/delegation/delegation.model';


@Injectable()
export class DataHandlingProvider {
    userData = {} as User;
 
    constructor(private db: AngularFireDatabase) { }
    
    createUser(userid, email) {
        this.userData.email = email;
        return this.db.list('users').set(userid, this.userData); 
    }

    getCaptureList(userid) {
        return this.db.list('/users/' + userid + '/captures');
    }
 
    addCapture(capture: Capture, userid) {
        return this.db.list('/users/' + userid + '/captures').push(capture);
    }
	
	removeUnprocessedCapture(capture: Capture, userid) {
        return this.db.list('/users/' + userid + '/captures').remove(capture.key);
    }
    
    removeAction(action: Action, userid) {
        return this.db.list('/users/' + userid + '/nextActions').remove(action.key);
    }

    removeDelegation(delegation: Delegation, userid) {
        return this.db.list('/users/' + userid + '/delegations').remove(delegation.key);
    }
    
    removeReference(reference: Reference, userid) {
        return this.db.list('/users/' + userid + '/references').remove(reference.key);
	}
    
    getGoalList(userid) {
        return this.db.list('/users/' + userid + '/goals');
    }

    addGoal(goal: Goal, userid) {
        return this.db.list('/users/' + userid + '/goals').push(goal);
    }

    getReferenceListFromGoal(goalid, userid) {
        return this.db.list('/users/' + userid + '/references', ref => ref.orderByChild('goalid').equalTo(goalid));
    }

    getNextActionListFromGoal(goalid, userid) {
        return this.db.list('/users/' + userid + '/nextActions', ref => ref.orderByChild('goalid').equalTo(goalid));
    }

    getDelegationListFromGoal(goalid, userid) {
        return this.db.list('/users/' + userid + '/delegations', ref => ref.orderByChild('goalid').equalTo(goalid));
    }

    getNextActionListFromUser(userid) {
        return this.db.list('/users/' + userid + '/nextActions');
    }

    addNextActionToGoal(action: Action, goal: Goal, capture: Capture, userid) {
        return this.db.list('users/' + userid + '/nextActions').push(action).then( () => this.removeUnprocessedCapture(capture, userid));
    }

    addDelegationToGoal(delegation: Delegation, goal: Goal, capture: Capture, userid) {
        return this.db.list('users/' + userid + '/delegations').push(delegation).then( () => this.removeUnprocessedCapture(capture, userid));
    }

    addReferenceToGoal(reference: Reference, goal: Goal, capture: Capture, userid){
        return this.db.list('/users/' + userid + '/references').push(reference).then( () => this.removeUnprocessedCapture(capture, userid));
    }

    editNextAction(newAction: Action, action: Action, goal: Goal, userid) {
        return this.removeAction(action, userid).then( () => this.db.list('users/' + userid + '/nextActions').push(newAction));
    }

    editDelegation(newDelegation: Delegation, delegation: Delegation, goal: Goal, userid) {
        return this.removeDelegation(delegation, userid).then( () => this.db.list('users/' + userid + '/delegations').push(newDelegation));
    }

    editReference(newReference: Reference, reference: Reference, goal: Goal, userid) {
        return this.removeReference(reference, userid).then( () => this.db.list('users/' + userid + '/references').push(newReference));
    }

    getGoalFromGoalid(goalid, userid) {
        return this.db.object<Goal>('/users/' + userid + '/goals/' + goalid);
    }


}
