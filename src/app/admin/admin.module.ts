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
    AdminServiceitemFormComponent
  ],
  imports: [AdminRoutingModule, SharedModule, LayoutModule, MatButtonModule, MatIconModule, AgGridModule.withComponents([])]
})
export class AdminModule {}
