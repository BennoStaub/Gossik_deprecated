import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaterialDetailsModalPage } from './material-details-modal';

@NgModule({
  declarations: [
    MaterialDetailsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MaterialDetailsModalPage),
  ],
})
export class MaterialDetailsModalPageModule {}
