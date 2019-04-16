import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminHomePageComponent } from './containers/admin-home-page/admin-home-page.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { AdminNewsListComponent } from './containers/admin-news-list/admin-news-list.component';
import { AdminNewsEditComponent } from './containers/admin-news-edit/admin-news-edit.component';
import { AdminNewsitemFormComponent } from './components/admin-newsitem-form/admin-newsitem-form.component';
import { AdminLoginComponent } from './containers/admin-login/admin-login.component';
import { AdminEventsListComponent } from './containers/admin-events-list/admin-events-list.component';
import { AdminEventsEditComponent } from './containers/admin-events-edit/admin-events-edit.component';
import { AdminEventitemFormComponent } from './components/admin-eventitem-form/admin-eventitem-form.component';
import { AgGridModule } from 'ag-grid-angular';
import { AdminServicesListComponent } from './containers/admin-services/admin-services.component';
import { AdminServicesEditComponent } from './containers/admin-services-edit/admin-services-edit.component';
import { AdminServiceitemFormComponent } from './components/admin-serviceitem-form/admin-serviceitem-form.component';
import { AdminContactsListComponent } from './containers/admin-contacts-list/admin-contacts-list.component';
import { AdminContactsEditComponent } from './containers/admin-contacts-edit/admin-contacts-edit.component';
import { AdminContactFormComponent } from './components/admin-contact-form/admin-contact-form.component';
import { AdminOthersNavComponent } from './components/admin-others-nav/admin-others-nav.component';
import { AdminOthersItemComponent } from './containers/admin-others-item/admin-others-item.component';
import { AdminOthersFormComponent } from './components/admin-others-form/admin-others-form.component';
import { AdminGalleryComponent } from './containers/admin-gallery/admin-gallery.component';
import { AdminCoursesListComponent } from './containers/admin-courses-list/admin-courses-list.component';
import { AdminCoursesEditComponent } from './containers/admin-courses-edit/admin-courses-edit.component';
import { AdminCourseFormComponent } from './components/admin-course-form/admin-course-form.component';
import { AdminAttendeesComponent } from './components/admin-attendees/admin-attendees.component';

@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminHomePageComponent,
    AdminNavComponent,
    AdminNewsListComponent,
    AdminNewsEditComponent,
    AdminNewsitemFormComponent,
    AdminEventsListComponent,
    AdminEventsEditComponent,
    AdminEventitemFormComponent,
    AdminServicesListComponent,
    AdminServicesEditComponent,
    AdminServiceitemFormComponent,
    AdminContactsListComponent,
    AdminContactsEditComponent,
    AdminContactFormComponent,
    AdminOthersNavComponent,
    AdminOthersItemComponent,
    AdminOthersFormComponent,
    AdminGalleryComponent,
    AdminCoursesListComponent,
    AdminCoursesEditComponent,
    AdminCourseFormComponent,
    AdminAttendeesComponent
  ],
  imports: [AdminRoutingModule, SharedModule, LayoutModule, AgGridModule.withComponents([])]
})
export class AdminModule {}
