import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DefineActionModalPage } from './define-action-modal';

import { DatePickerModule } from 'ionic-calendar-date-picker';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DefineActionModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DefineActionModalPage),
    TranslateModule.forChild(),
    DatePickerModule
  ],
})
export class DefineActionModalPageModule {}
