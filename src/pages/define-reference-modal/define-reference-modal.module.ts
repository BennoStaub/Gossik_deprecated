import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DefineReferenceModalPage } from './define-reference-modal';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DefineReferenceModalPage,
  ],
  imports: [
    IonicPageModule.forChild(DefineReferenceModalPage),
    TranslateModule.forChild()
  ],
})
export class DefineReferenceModalPageModule {}
