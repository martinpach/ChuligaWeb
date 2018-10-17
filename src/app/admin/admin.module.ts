import { NgModule } from '@angular/core';
import { LoginComponent } from './containers/login/login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AdminHomePageComponent } from './containers/admin-home-page/admin-home-page.component';

@NgModule({
  declarations: [LoginComponent, AdminHomePageComponent],
  imports: [AdminRoutingModule, SharedModule]
})
export class AdminModule {}
