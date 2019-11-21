import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Capture } from '../../model/capture/capture.model';
import { Goal } from '../../model/goal/goal.model';
import { User } from '../../model/user/user.model';
import { Action } from '../../model/action/action.model';
import { Reference } from '../../model/reference/reference.model';
import { Delegation } from '../../model/delegation/delegation.model';
import { CalendarEvent } from '../../model/CalendarEvent/calendarEvent.model';


@Injectable()
export class DataHandlingProvider {
    userData = {} as User;
 
    constructor(private db: AngularFireDatabase) { }
    
    createUser(userid, email) {
        this.userData.email = email;
        return this.db.list('users').set(userid, this.userData); 
    }

    getCaptureListFromUser(userid) {
        return this.db.list('/users/' + userid + '/captures');
    }
 
    addCapture(capture: Capture, userid) {
        return this.db.list('/users/' + userid + '/captures').push(capture);
    }
	
	deleteCapture(capture: Capture, userid) {
        return this.db.list('/users/' + userid + '/captures').remove(capture.key);
    }

    getCalendarEventListFromUser(userid) {
        return this.db.list('/users/' + userid + '/calendarEvents');
    }

    addCalendarEvent(calendarEvent: CalendarEvent, userid) {
        console.log(calendarEvent);
        return this.db.list('/users/' + userid + '/calendarEvents').push(calendarEvent);
    }
    
    deleteAction(action: Action, userid) {
        return this.db.list('/users/' + userid + '/nextActions').remove(action.key);
    }

    deleteDelegation(delegation: Delegation, userid) {
        return this.db.list('/users/' + userid + '/delegations').remove(delegation.key);
    }
    
    deleteReference(reference: Reference, userid) {
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

    getTakenActionListFromUser(userid) {
        return this.db.list('/users/' + userid + '/nextActions', ref => ref.orderByChild('taken').equalTo(true));
    }

    getGoalFromGoalid(goalid, userid) {
        return this.db.object<Goal>('/users/' + userid + '/goals/' + goalid);
    }

    addAction(action: Action, capture: Capture, userid) {
        return this.db.list('users/' + userid + '/nextActions').push(action).then( () => this.deleteCapture(capture, userid));
    }

    addDelegationToGoal(delegation: Delegation, goal: Goal, capture: Capture, userid) {
        return this.db.list('users/' + userid + '/delegations').push(delegation).then( () => this.deleteCapture(capture, userid));
    }

    addReferenceToGoal(reference: Reference, goal: Goal, capture: Capture, userid){
        return this.db.list('/users/' + userid + '/references').push(reference).then( () => this.deleteCapture(capture, userid));
    }

    editAction(action: Action, userid) {
        let actionkey = action.key;
        delete action.key;
        return this.db.database.ref('/users/' + userid + '/nextActions/' + actionkey).set(action);
    }

    editDelegation(delegation: Delegation, userid) {
        let delegationkey = delegation.key;
        delete delegation.key;
        return this.db.database.ref('/users/' + userid + '/delegations/' + delegationkey).set(delegation);
    }

    editReference(reference: Reference, userid) {
        let referencekey = reference.key;
        delete reference.key;
        return this.db.database.ref('/users/' + userid + '/references/' + referencekey).set(reference);
    }

    deleteGoal(goalid, userid) {
        return this.db.list('/users/' + userid + '/goals').remove(goalid).then( () => {
            this.db.list('/users/' + userid + '/nextActions', ref => ref.orderByChild('goalid').equalTo(goalid))
            .snapshotChanges()
            .map(
            changes => {
            return changes.map(c => ({
                key: c.payload.key, ...c.payload.val()
            }))
            }).take(1).subscribe(actions => {
                for(let action of actions) {
                    this.db.list('/users/' + userid + '/nextActions').remove(action.key);  
                }
            });
            this.db.list('/users/' + userid + '/delegations', ref => ref.orderByChild('goalid').equalTo(goalid))
            .snapshotChanges()
            .map(
            changes => {
            return changes.map(c => ({
                key: c.payload.key, ...c.payload.val()
            }))
            }).take(1).subscribe(delegations => {
                for(let delegation of delegations) {
                    this.db.list('/users/' + userid + '/delegations').remove(delegation.key);  
                }
            });
            this.db.list('/users/' + userid + '/references', ref => ref.orderByChild('goalid').equalTo(goalid))
            .snapshotChanges()
            .map(
            changes => {
            return changes.map(c => ({
                key: c.payload.key, ...c.payload.val()
            }))
            }).take(1).subscribe(references => {
                for(let reference of references) {
                    this.db.list('/users/' + userid + '/references').remove(reference.key);  
                }
            });
        });
    }


}
