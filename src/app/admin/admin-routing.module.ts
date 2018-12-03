import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomePageComponent } from './containers/admin-home-page/admin-home-page.component';
import { AdminGuard } from './guards/admin.guard';
import { AdminLoginGuard } from './guards/admin-login.guard';
import { AdminNewsListComponent } from './containers/admin-news-list/admin-news-list.component';
import { AdminNewsEditComponent } from './containers/admin-news-edit/admin-news-edit.component';
import { AdminLoginComponent } from './containers/admin-login/admin-login.component';
import { AdminEventsListComponent } from './containers/admin-events-list/admin-events-list.component';
import { AdminEventsEditComponent } from './containers/admin-events-edit/admin-events-edit.component';
import { AdminServicesListComponent } from './containers/admin-services/admin-services.component';
import { AdminServicesEditComponent } from './containers/admin-services-edit/admin-services-edit.component';

const adminRoutes: Routes = [
  {
    path: '',
    component: AdminHomePageComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'news',
        redirectTo: 'news/list'
      },
      {
        path: 'news/new',
        component: AdminNewsEditComponent
      },
      {
        path: 'news/list',
        component: AdminNewsListComponent
      },
      { path: 'news/:id/edit', component: AdminNewsEditComponent },
      {
        path: 'events',
        redirectTo: 'events/list'
      },
      {
        path: 'events/new',
        component: AdminEventsEditComponent
      },
      {
        path: 'events/list',
        component: AdminEventsListComponent
      },
      {
        path: 'events/:id/edit',
        component: AdminEventsEditComponent
      },
      {
        path: 'services',
        redirectTo: 'services/list'
      },
      {
        path: 'services/list',
        component: AdminServicesListComponent
      },
      {
        path: 'services/new',
        component: AdminServicesEditComponent
      },
      {
        path: 'services/:id/edit',
        component: AdminServicesEditComponent
      }
    ]
  },
  {
    path: 'login',
    component: AdminLoginComponent,
    canActivate: [AdminLoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
