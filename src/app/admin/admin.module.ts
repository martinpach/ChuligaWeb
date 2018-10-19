import { NgModule } from '@angular/core';
import { LoginComponent } from './containers/login/login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminHomePageComponent } from './containers/admin-home-page/admin-home-page.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { AdminNavComponent } from './components/admin-nav/admin-nav.component';
import { AdminWelcomePageComponent } from './components/admin-welcome-page/admin-welcome-page.component';

@NgModule({
  declarations: [
    LoginComponent,
    AdminHomePageComponent,
    AdminNavComponent,
    AdminWelcomePageComponent
  ],
  imports: [
    AdminRoutingModule,
    SharedModule,
    LayoutModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class AdminModule {}
