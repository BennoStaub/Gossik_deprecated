import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoalDetailsModalPage } from './goal-details-modal';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    GoalDetailsModalPage,
  ],
  imports: [
    IonicPageModule.forChild(GoalDetailsModalPage),
    TranslateModule.forChild()
  ],
})
export class GoalDetailsModalPageModule {}
