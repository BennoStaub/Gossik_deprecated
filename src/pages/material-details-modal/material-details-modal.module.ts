import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MaterialDetailsModalPage } from './material-details-modal';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MaterialDetailsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MaterialDetailsModalPage),
    TranslateModule.forChild()
  ],
})
export class MaterialDetailsModalPageModule {}
