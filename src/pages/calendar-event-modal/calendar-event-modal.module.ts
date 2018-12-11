import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarEventModalPage } from './calendar-event-modal';

@NgModule({
  declarations: [
    CalendarEventModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarEventModalPage),
  ],
})
export class CalendarEventModalPageModule {}
