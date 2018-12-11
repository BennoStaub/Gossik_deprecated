import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarPage } from './calendar';

import { NgCalendarModule } from 'ionic2-calendar'

@NgModule({
  declarations: [
    CalendarPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarPage),
    NgCalendarModule
  ],
})
export class CalendarPageModule {}
