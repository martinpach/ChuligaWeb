import { LoginComponent } from './containers/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomePageComponent } from './containers/admin-home-page/admin-home-page.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminLoginGuard } from './guards/admin-login.guard';
import { AdminWelcomePageComponent } from './components/admin-welcome-page/admin-welcome-page.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminHomePageComponent,
    canActivate: [AdminGuard],
    children: [{ path: '', component: AdminWelcomePageComponent }]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AdminLoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
