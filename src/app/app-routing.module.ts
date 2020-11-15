import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

import { LoginComponent } from './public/login/login.component';
import { RegisterComponent } from './public/register/register.component';
import { PasswordResetComponent } from './public/password-reset/password-reset.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToDashboard = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToDashboard) },
  { path: 'register', component: RegisterComponent, ...canActivate(redirectLoggedInToDashboard) },
  { path: 'password/reset', component: PasswordResetComponent, ...canActivate(redirectLoggedInToDashboard) },
  {
    path: 'expenses',
    loadChildren: () => import('./expenses/expenses.module').then((m) => m.ExpensesModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'friends',
    loadChildren: () => import('./friends/friends.module').then((m) => m.FriendsModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module').then((m) => m.GroupsModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
