import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DefineActionModalPage } from './define-action-modal';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DefineActionModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DefineActionModalPage),
    TranslateModule.forChild()
  ],
})
export class DefineActionModalPageModule {}
