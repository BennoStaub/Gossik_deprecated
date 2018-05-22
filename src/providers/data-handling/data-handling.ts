import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Capture } from '../../model/capture/capture.model';

/*
  Generated class for the DataHandlingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataHandlingProvider {

  private captureListRef = this.db.list<Capture>('capture');
 
    constructor(private db: AngularFireDatabase) { }
 
    getCaptureList() {
        return this.captureListRef;
    }
 
    addCapture(capture: Capture) {
        return this.captureListRef.push(capture);
    }
 
    /*updateNote(note: Note) {
        return this.noteListRef.update(note.key, note);
    }
 
    removeNote(note: Note) {
        return this.noteListRef.remove(note.key);
    }*/
}
