import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddReferencePage } from './add-reference';

@NgModule({
  declarations: [
    AddReferencePage,
  ],
  imports: [
    IonicPageModule.forChild(AddReferencePage),
  ],
})
export class AddReferencePageModule {}
