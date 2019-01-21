import {
  MatProgressBarModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatMenuModule,
  MatDialogModule,
  MatSelectModule,
  MatDatepickerModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatButtonModule,
  MatInputModule,
  DateAdapter,
  MAT_DATE_FORMATS,
  MatProgressSpinnerModule,
  MatTabsModule
} from '@angular/material';
import { MatConfirmDialogComponent } from './components/mat-confirm-dialog/mat-confirm-dialog.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MyDateAdapter } from './utils/my-date-adapter';
import { MatNewAlbumDialogComponent } from './components/mat-new-album-dialog/mat-new-album-dialog.component';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNewsitemDetailsDialogComponent } from './components/mat-newsitem-details-dialog/mat-newsitem-details-dialog.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatInputModule,
    MatDialogModule
  ],
  declarations: [MatConfirmDialogComponent, MatNewAlbumDialogComponent, MatNewsitemDetailsDialogComponent],
  entryComponents: [MatConfirmDialogComponent, MatNewAlbumDialogComponent, MatNewsitemDetailsDialogComponent],
  exports: [
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
    MatConfirmDialogComponent,
    MatSnackBarModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule
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
export class MaterialModule {}
