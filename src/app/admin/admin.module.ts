import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminHomePageComponent } from './containers/admin-home-page/admin-home-page.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { AdminNewsNewComponent } from './containers/admin-news-new/admin-news-new.component';
import { AdminNewsListComponent } from './containers/admin-news-list/admin-news-list.component';
import { AdminNewsEditComponent } from './containers/admin-news-edit/admin-news-edit.component';
import { AdminNewsitemFormComponent } from './components/admin-newsitem-form/admin-newsitem-form.component';
import { AdminLoginComponent } from './containers/admin-login/admin-login.component';

@NgModule({
  declarations: [
    AdminLoginComponent,
    AdminHomePageComponent,
    AdminNavComponent,
    AdminNewsNewComponent,
    AdminNewsListComponent,
    AdminNewsEditComponent,
    AdminNewsitemFormComponent
  ],
  imports: [AdminRoutingModule, SharedModule, LayoutModule, MatButtonModule, MatIconModule]
})
export class AdminModule {}
