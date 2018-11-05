import { LoginComponent } from './containers/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomePageComponent } from './containers/admin-home-page/admin-home-page.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminLoginGuard } from './guards/admin-login.guard';
import { AdminNewsNewComponent } from './components/admin-news-new/admin-news-new.component';
import { AdminNewsListComponent } from './containers/admin-news-list/admin-news-list.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminHomePageComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'news/new',
        component: AdminNewsNewComponent
      },
      {
        path: 'news/list',
        component: AdminNewsListComponent
      },
      { path: '2', component: AdminNewsListComponent },
      { path: '3', component: AdminNewsListComponent },
      { path: '4', component: AdminNewsListComponent },
      { path: '5', component: AdminNewsListComponent },
      { path: '6', component: AdminNewsListComponent }
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
