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
import { AdminContactsListComponent } from './containers/admin-contacts-list/admin-contacts-list.component';
import { AdminContactsEditComponent } from './containers/admin-contacts-edit/admin-contacts-edit.component';
import { AdminOthersNavComponent } from './components/admin-others-nav/admin-others-nav.component';
import { AdminOthersItemComponent } from './containers/admin-others-item/admin-others-item.component';
import { AdminGalleryComponent } from './containers/admin-gallery/admin-gallery.component';
import { AdminCoursesEditComponent } from './containers/admin-courses-edit/admin-courses-edit.component';
import { AdminCoursesListComponent } from './containers/admin-courses-list/admin-courses-list.component';

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
        path: 'courses',
        redirectTo: 'courses/list'
      },
      {
        path: 'courses/new',
        component: AdminCoursesEditComponent
      },
      {
        path: 'courses/list',
        component: AdminCoursesListComponent
      },
      {
        path: 'courses/:id/edit',
        component: AdminCoursesEditComponent
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
      },
      {
        path: 'contacts',
        redirectTo: 'contacts/list'
      },
      {
        path: 'contacts/list',
        component: AdminContactsListComponent
      },
      {
        path: 'contacts/new',
        component: AdminContactsEditComponent
      },
      {
        path: 'contacts/:id/edit',
        component: AdminContactsEditComponent
      },
      {
        path: 'others',
        component: AdminOthersNavComponent
      },
      {
        path: 'others/:id',
        component: AdminOthersItemComponent
      },
      {
        path: 'gallery',
        component: AdminGalleryComponent
      },
      {
        path: 'gallery/:id',
        component: AdminGalleryComponent
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
