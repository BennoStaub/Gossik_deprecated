import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TakeActionPage } from './take-action';

@NgModule({
  declarations: [
    TakeActionPage,
  ],
  imports: [
    IonicPageModule.forChild(TakeActionPage),
  ],
})
export class TakeActionPageModule {}
