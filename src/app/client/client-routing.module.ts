import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './containers/home-page/home-page.component';
import { NgModule } from '@angular/core';
import { RoomComponent } from './containers/room/room.component';
import { ClientComponent } from './client.component';
import { NewsComponent } from './containers/news/news.component';
import { AuthComponent } from './containers/auth/auth.component';
import { ClientLoginGuard } from './guards/client-login.guard';
import { EventsComponent } from './containers/events/events.component';
import { EventDetailsComponent } from './containers/event-details/event-details.component';
import { CoursesComponent } from './containers/courses/courses.component';
import { CourseDetailsComponent } from './containers/course-details/course-details.component';

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
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'events/:id',
        component: EventDetailsComponent
      },
      {
        path: 'courses',
        component: CoursesComponent
      },
      {
        path: 'courses/:id',
        component: CourseDetailsComponent
      }
    ]
  },
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [ClientLoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(clientRoutes)],
  exports: [RouterModule]
})
export class ClientRoutingModule {}
