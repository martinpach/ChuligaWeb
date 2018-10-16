import { NgModule } from '@angular/core';
import { LoginComponent } from './auth/login/login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MatInputModule, MatButtonModule } from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { AdminHomePageComponent } from './admin-home-page/admin-home-page.component';

@NgModule({
  declarations: [LoginComponent, AdminHomePageComponent],
  imports: [AdminRoutingModule, SharedModule, MatInputModule, MatButtonModule]
})
export class AdminModule {}
