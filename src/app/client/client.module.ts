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
    EventComponent
  ],
  imports: [ClientRoutingModule, SharedModule]
})
export class ClientModule {}
