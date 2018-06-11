import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProcessCapturePage } from './process-capture';

@NgModule({
  declarations: [
    ProcessCapturePage,
  ],
  imports: [
    IonicPageModule.forChild(ProcessCapturePage),
  ],
})
export class ProcessCapturePageModule {}
