import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DefineDelegationModalPage } from './define-delegation-modal';

import { DatePickerModule } from 'ionic-calendar-date-picker';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DefineDelegationModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DefineDelegationModalPage),
    TranslateModule.forChild(),
    DatePickerModule
  ],
})
export class DefineDelegationModalPageModule {}
