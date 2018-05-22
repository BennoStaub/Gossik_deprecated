import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCapturePage } from './add-capture';

@NgModule({
  declarations: [
    AddCapturePage,
  ],
  imports: [
    IonicPageModule.forChild(AddCapturePage),
  ],
})
export class AddCapturePageModule {}
