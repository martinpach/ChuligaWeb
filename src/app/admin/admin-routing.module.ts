import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomePageComponent } from './admin-home-page/admin-home-page.component';
import { AdminGuard } from './auth/admin.guard';
import { LoginGuard } from '../admin/auth/login/login.guard';

const adminRoutes: Routes = [
  {
    path: 'home',
    component: AdminHomePageComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '',
    pathMatch: 'full',
    component: LoginComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
