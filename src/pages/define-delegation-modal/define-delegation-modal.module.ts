import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DefineDelegationModalPage } from './define-delegation-modal';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DefineDelegationModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DefineDelegationModalPage),
    TranslateModule.forChild()
  ],
})
export class DefineDelegationModalPageModule {}
