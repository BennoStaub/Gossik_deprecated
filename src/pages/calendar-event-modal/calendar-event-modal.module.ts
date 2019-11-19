import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalendarEventModalPage } from './calendar-event-modal';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    CalendarEventModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CalendarEventModalPage),
    TranslateModule.forChild()
  ],
})
export class CalendarEventModalPageModule {}
