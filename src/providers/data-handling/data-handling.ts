import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Capture } from '../../model/capture/capture.model';
import { Project } from '../../model/project/project.model';


@Injectable()
export class DataHandlingProvider {

  private captureListRef = this.db.list<Capture>('capture');
  private projectListRef = this.db.list<Project>('project');
 
    constructor(private db: AngularFireDatabase) { }
 
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
