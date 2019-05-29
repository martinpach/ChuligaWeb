import { NgModule } from '@angular/core';
import { HomePageComponent } from './containers/home-page/home-page.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientNavigationComponent } from './components/client-navigation/client-navigation.component';
import { SharedModule } from '../shared/shared.module';
import { PageDescriptionComponent } from './components/page-description/page-description.component';
import { PictureCardComponent } from './components/picture-card/picture-card.component';
import { PageFooterComponent } from './components/page-footer/page-footer.component';
import { RoomComponent } from './containers/room/room.component';
import { ClientComponent } from './client.component';
import { NewsItemComponent } from './components/news-item/news-item.component';
import { NewsComponent } from './containers/news/news.component';
import { AuthComponent } from './containers/auth/auth.component';
import { EventsComponent } from './containers/events/events.component';
import { EventComponent } from './components/event/event.component';
import { EventDetailsComponent } from './containers/event-details/event-details.component';
import { CoursesComponent } from './containers/courses/courses.component';
import { CourseDetailsComponent } from './containers/course-details/course-details.component';
import { CourseComponent } from './components/course/course.component';
import { ClientGalleryComponent } from './containers/client-gallery/client-gallery.component';
import { ServicesNavigationComponent } from './components/services-navigation/services-navigation.component';
import { ServicesComponent } from './containers/services/services.component';
import { ServiceItemComponent } from './components/service-item/service-item.component';
import { ContactsComponent } from './containers/contacts/contacts.component';
import { ContactComponent } from './components/contact/contact.component';
import { StagingComponent } from './containers/staging/staging.component';

@NgModule({
  declarations: [
    HomePageComponent,
    ClientNavigationComponent,
    PageDescriptionComponent,
    PictureCardComponent,
    PageFooterComponent,
    RoomComponent,
    ClientComponent,
    NewsItemComponent,
    NewsComponent,
    AuthComponent,
    EventsComponent,
    EventComponent,
    EventDetailsComponent,
    CoursesComponent,
    CourseDetailsComponent,
    CourseComponent,
    ClientGalleryComponent,
    ServicesNavigationComponent,
    ServicesComponent,
    ServiceItemComponent,
    ContactsComponent,
    ContactComponent,
    StagingComponent
  ],
  imports: [ClientRoutingModule, SharedModule]
})
export class ClientModule {}
