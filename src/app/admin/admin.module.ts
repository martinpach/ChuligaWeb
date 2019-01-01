import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminHomePageComponent } from './containers/admin-home-page/admin-home-page.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule, MatIconModule } from '@angular/material';
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
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GallerizeModule } from '@ngx-gallery/gallerize';

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
    AdminGalleryComponent
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    LayoutModule,
    MatButtonModule,
    MatIconModule,
    AgGridModule.withComponents([]),
    GalleryModule.withConfig({
      gestures: false
    }),
    LightboxModule,
    GallerizeModule
  ]
})
export class AdminModule {}
