import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelegationDetailsModalPage } from './delegation-details-modal';

import { DatePickerModule } from 'ionic-calendar-date-picker';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DelegationDetailsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DelegationDetailsModalPage),
    TranslateModule.forChild(),
    DatePickerModule
  ],
})
export class DelegationDetailsModalPageModule {}
