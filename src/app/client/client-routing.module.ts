import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './containers/home-page/home-page.component';
import { NgModule } from '@angular/core';
import { RoomComponent } from './containers/room/room.component';
import { ClientComponent } from './client.component';
import { NewsComponent } from './containers/news/news.component';

const clientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        component: HomePageComponent,
        pathMatch: 'full'
      },
      {
        path: 'rooms/:id',
        component: RoomComponent
      },
      {
        path: 'news',
        component: NewsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(clientRoutes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {}
