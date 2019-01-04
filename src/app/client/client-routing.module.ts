import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './containers/home-page/home-page.component';
import { NgModule } from '@angular/core';

const clientRoutes: Routes = [
  {
    path: '',
    component: HomePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(clientRoutes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {}
