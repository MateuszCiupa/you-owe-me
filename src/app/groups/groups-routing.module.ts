import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupDetailsComponent } from './group-details/group-details.component';

import { GroupsComponent } from './groups.component';

const routes: Routes = [
  { path: '', component: GroupsComponent },
  {
    path: ':groupId',
    component: GroupDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupsRoutingModule {}
