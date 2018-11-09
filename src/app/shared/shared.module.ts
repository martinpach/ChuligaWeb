import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatButtonModule, MatSidenavModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from './navigation/navigation.component';
import { NavigationBarComponent } from './navigation/navigation-bar.component';
import { NavigationItemDirective } from './navigation/navigation-item.directive';
import { NewsItemComponent } from './news-item/news-item.component';
import { NgxEditorModule } from 'ngx-editor';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  declarations: [NavigationComponent, NavigationBarComponent, NavigationItemDirective, NewsItemComponent, UploadComponent],
  exports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    NavigationComponent,
    NavigationBarComponent,
    NavigationItemDirective,
    NewsItemComponent,
    UploadComponent,
    NgxEditorModule
  ]
})
export class SharedModule {}
