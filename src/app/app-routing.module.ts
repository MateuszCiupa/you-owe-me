import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'expenses', loadChildren: () => import('./expenses/expenses.module').then((m) => m.ExpensesModule) },
  { path: 'friends', loadChildren: () => import('./friends/friends.module').then((m) => m.FriendsModule) },
  { path: 'groups', loadChildren: () => import('./groups/groups.module').then((m) => m.GroupsModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then((m) => m.UserModule) },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
