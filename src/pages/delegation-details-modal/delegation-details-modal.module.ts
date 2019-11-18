import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelegationDetailsModalPage } from './delegation-details-modal';

@NgModule({
  declarations: [
    DelegationDetailsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DelegationDetailsModalPage),
  ],
})
export class DelegationDetailsModalPageModule {}
