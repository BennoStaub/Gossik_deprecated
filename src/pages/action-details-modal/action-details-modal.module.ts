import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActionDetailsModalPage } from './action-details-modal';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ActionDetailsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ActionDetailsModalPage),
    TranslateModule.forChild()
  ],
})
export class ActionDetailsModalPageModule {}
