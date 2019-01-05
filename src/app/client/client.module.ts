import { NgModule } from '@angular/core';
import { HomePageComponent } from './containers/home-page/home-page.component';
import { ClientRoutingModule } from './client-routing.module';
import { ClientNavigationComponent } from './components/client-navigation/client-navigation.component';
import { SharedModule } from '../shared/shared.module';
import { PageDescriptionComponent } from './components/page-description/page-description.component';
import { PictureCardComponent } from './components/picture-card/picture-card.component';

@NgModule({ declarations: [HomePageComponent, ClientNavigationComponent, PageDescriptionComponent, PictureCardComponent], imports: [ClientRoutingModule, SharedModule] })
export class ClientModule {}
