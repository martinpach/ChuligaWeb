import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

const appRoutes: Routes = [
  { path: 'admin', loadChildren: './admin/admin.module#AdminModule' },
  { path: '', component: AppComponent, pathMatch: 'full' },
  { path: '**', component: AppComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
