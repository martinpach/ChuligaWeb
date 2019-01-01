import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavigationComponent } from './navigation/navigation.component';
import { NavigationBarComponent } from './navigation/navigation-bar.component';
import { NavigationItemDirective } from './navigation/navigation-item.directive';
import { NgxEditorModule } from 'ngx-editor';
import { NewsItemComponent } from './components/news-item/news-item.component';
import { UploadComponent } from './components/upload/upload.component';
import { EventComponent } from './components/event/event.component';
import { SplitPipe } from './pipes/split.pipe';
import { GalleryComponent } from './components/gallery/gallery.component';
import { MaterialModule } from '../material/material.module';
import { GalleryModule } from '@ngx-gallery/core';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { GallerizeModule } from '@ngx-gallery/gallerize';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    GalleryModule.withConfig({
      gestures: false
    }),
    LightboxModule,
    GallerizeModule
  ],
  declarations: [
    NavigationComponent,
    NavigationBarComponent,
    NavigationItemDirective,
    NewsItemComponent,
    UploadComponent,
    EventComponent,
    SplitPipe,
    GalleryComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    NavigationComponent,
    NavigationBarComponent,
    NavigationItemDirective,
    NewsItemComponent,
    UploadComponent,
    NgxEditorModule,
    EventComponent,
    SplitPipe,
    GalleryComponent
  ]
})
export class SharedModule {}
