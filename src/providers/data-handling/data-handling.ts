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
        capture.active = false;
        return this.editCapture(capture, userid);
    }

    getCalendarEventListFromUser(userid) {
        return this.db.list('/users/' + userid + '/calendarEvents');
    }

    addCalendarEvent(calendarEvent: CalendarEvent, userid) {
        console.log(calendarEvent);
        return this.db.list('/users/' + userid + '/calendarEvents').push(calendarEvent);
    }
    
    deleteAction(action: Action, userid) {
        action.active = false;
        return this.editAction(action, userid).then( () =>
            {
                if(action.deadline) {
                    this.deleteCalendarEvent(action.deadlineid, userid);
                }
            });
    }

    deleteCalendarEvent(eventid, userid) {
        return this.db.object<CalendarEvent>('/users/' + userid + '/calendarEvents/' + eventid).valueChanges().take(1).subscribe( event => {
                event.key = eventid;
                event.active = false;
                this.editCalendarEvent(event, userid); 
            });
    }

    deleteDelegation(delegation: Delegation, userid) {
        delegation.active = false;
        return this.editDelegation(delegation, userid).then( () =>
            {
                if(delegation.deadline) {
                    this.deleteCalendarEvent(delegation.deadlineid, userid);
                }
            });
    }
    
    deleteReference(reference: Reference, userid) {
        reference.active = false;
        return this.editReference(reference, userid);
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
        return this.db.list('users/' + userid + '/nextActions').push(action)
        .then( () => {
            if(capture.key) {
                this.deleteCapture(capture, userid);
            }
        });
    }

    addDelegation(delegation: Delegation, capture: Capture, userid) {
        return this.db.list('users/' + userid + '/delegations').push(delegation)
        .then( () => {
            if(capture.key) {
                this.deleteCapture(capture, userid);
            }
        });
    }

    addReference(reference: Reference, capture: Capture, userid){
        return this.db.list('/users/' + userid + '/references').push(reference)
        .then( () => {
            if(capture.key) {
                this.deleteCapture(capture, userid);
            }
        });
    }

    editCapture(capture: Capture, userid) {
        let capturekey = capture.key;
        delete capture.key;
        return this.db.database.ref('/users/' + userid + '/captures/' + capturekey).set(capture);
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

    editCalendarEvent(calendarEvent: CalendarEvent, userid) {
        let calendarEventkey = calendarEvent.key;
        delete calendarEvent.key;
        return this.db.database.ref('/users/' + userid + '/calendarEvents/' + calendarEventkey).set(calendarEvent);
    }

    editGoal(goal: Goal, userid) {
        let goalkey = goal.key;
        delete goal.key;
        return this.db.database.ref('/users/' + userid + '/goals/' + goalkey).set(goal);
    }



    deleteGoal(goal, userid) {
        let goalkey = goal.key;
        goal.active = false;
        return this.editGoal(goal, userid).then( () => {
            this.db.list('/users/' + userid + '/nextActions', ref => ref.orderByChild('goalid').equalTo(goalkey))
            .snapshotChanges()
            .map(
            changes => {
            return changes.map(c => ({
                key: c.payload.key, ...c.payload.val()
            }))
            }).take(1).subscribe(actions => {
                for(let action of actions) {
                    this.deleteAction(action, userid);  
                }
            });
            this.db.list('/users/' + userid + '/delegations', ref => ref.orderByChild('goalid').equalTo(goalkey))
            .snapshotChanges()
            .map(
            changes => {
            return changes.map(c => ({
                key: c.payload.key, ...c.payload.val()
            }))
            }).take(1).subscribe(delegations => {
                for(let delegation of delegations) {
                    this.deleteDelegation(delegation, userid);  
                }
            });
            this.db.list('/users/' + userid + '/references', ref => ref.orderByChild('goalid').equalTo(goalkey))
            .snapshotChanges()
            .map(
            changes => {
            return changes.map(c => ({
                key: c.payload.key, ...c.payload.val()
            }))
            }).take(1).subscribe(references => {
                for(let reference of references) {
                    this.deleteReference(reference, userid);  
                }
            });
        });
    }


}
