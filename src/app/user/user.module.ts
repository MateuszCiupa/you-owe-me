import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { UserStatsComponent } from './user-stats/user-stats.component';

@NgModule({
  declarations: [UserSettingsComponent, UserStatsComponent],
  imports: [CommonModule, UserRoutingModule],
})
export class UserModule {}
