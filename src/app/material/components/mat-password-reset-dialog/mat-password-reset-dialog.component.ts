import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-mat-password-reset-dialog',
  templateUrl: './mat-password-reset-dialog.component.html',
  styleUrls: ['./mat-password-reset-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatPasswordResetDialogComponent {
  email: string;

  constructor(public dialogRef: MatDialogRef<MatPasswordResetDialogComponent>) {}

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
