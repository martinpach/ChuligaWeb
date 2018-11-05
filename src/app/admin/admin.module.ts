import { NgModule } from '@angular/core';
import { LoginComponent } from './containers/login/login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminHomePageComponent } from './containers/admin-home-page/admin-home-page.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { AdminNewsNewComponent } from './components/admin-news-new/admin-news-new.component';
import { AdminNewsListComponent } from './containers/admin-news-list/admin-news-list.component';

@NgModule({
  declarations: [LoginComponent, AdminHomePageComponent, AdminNavComponent, AdminNewsNewComponent, AdminNewsListComponent],
  imports: [AdminRoutingModule, SharedModule, LayoutModule, MatButtonModule, MatIconModule]
})
export class AdminModule {}
