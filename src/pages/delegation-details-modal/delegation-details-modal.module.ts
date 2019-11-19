import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DelegationDetailsModalPage } from './delegation-details-modal';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DelegationDetailsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DelegationDetailsModalPage),
    TranslateModule.forChild()
  ],
})
export class DelegationDetailsModalPageModule {}
