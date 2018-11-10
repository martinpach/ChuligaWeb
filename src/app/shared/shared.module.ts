import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatDialogModule
} from '@angular/material';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from './navigation/navigation.component';
import { NavigationBarComponent } from './navigation/navigation-bar.component';
import { NavigationItemDirective } from './navigation/navigation-item.directive';
import { NgxEditorModule } from 'ngx-editor';
import { NewsItemComponent } from './components/news-item/news-item.component';
import { UploadComponent } from './containers/upload/upload.component';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
  declarations: [
    NavigationComponent,
    NavigationBarComponent,
    NavigationItemDirective,
    NewsItemComponent,
    UploadComponent,
    MatConfirmDialogComponent
  ],
  entryComponents: [MatConfirmDialogComponent],
  exports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDialogModule,
    NavigationComponent,
    NavigationBarComponent,
    NavigationItemDirective,
    NewsItemComponent,
    UploadComponent,
    NgxEditorModule,
    MatConfirmDialogComponent
  ]
})
export class SharedModule {}
