import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatDatepickerModule,
  MAT_DATE_FORMATS,
  DateAdapter,
  MatSelectModule,
  MatSnackBarModule,
  MatMenuModule,
  MatCheckboxModule,
  MatProgressBarModule
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { NavigationComponent } from './navigation/navigation.component';
import { NavigationBarComponent } from './navigation/navigation-bar.component';
import { NavigationItemDirective } from './navigation/navigation-item.directive';
import { NgxEditorModule } from 'ngx-editor';
import { NewsItemComponent } from './components/news-item/news-item.component';
import { UploadComponent } from './components/upload/upload.component';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';
import { EventComponent } from './components/event/event.component';
import { MyDateAdapter } from './utils/my-date-adapter';
import { MatNewAlbumDialogComponent } from './components/mat-new-album-dialog/mat-new-album-dialog.component';
import { SplitPipe } from './pipes/split.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatInputModule,
    MatDialogModule
  ],
  declarations: [
    NavigationComponent,
    NavigationBarComponent,
    NavigationItemDirective,
    NewsItemComponent,
    UploadComponent,
    MatConfirmDialogComponent,
    EventComponent,
    MatNewAlbumDialogComponent,
    SplitPipe
  ],
  entryComponents: [MatConfirmDialogComponent, MatNewAlbumDialogComponent],
  exports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatCheckboxModule,
    NavigationComponent,
    NavigationBarComponent,
    NavigationItemDirective,
    NewsItemComponent,
    UploadComponent,
    NgxEditorModule,
    MatConfirmDialogComponent,
    MatSnackBarModule,
    MatProgressBarModule,
    EventComponent,
    SplitPipe
  ],
  providers: [
    { provide: DateAdapter, useClass: MyDateAdapter },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
        },
        display: {
          dateInput: 'input',
          monthYearLabel: { year: 'numeric', month: 'short' },
          dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
          monthYearA11yLabel: { year: 'numeric', month: 'long' }
        }
      }
    }
  ]
})
export class SharedModule {}
