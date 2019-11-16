import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActionDetailsModalPage } from './action-details-modal';

@NgModule({
  declarations: [
    ActionDetailsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ActionDetailsModalPage),
  ],
})
export class ActionDetailsModalPageModule {}
