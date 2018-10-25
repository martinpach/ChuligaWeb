import { LoginComponent } from './containers/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomePageComponent } from './containers/admin-home-page/admin-home-page.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminLoginGuard } from './guards/admin-login.guard';
import { AdminNewsComponent } from './components/admin-news/admin-news.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminHomePageComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'news', component: AdminNewsComponent },
      { path: '2', component: AdminNewsComponent },
      { path: '3', component: AdminNewsComponent },
      { path: '4', component: AdminNewsComponent },
      { path: '5', component: AdminNewsComponent },
      { path: '6', component: AdminNewsComponent }
    ]
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
