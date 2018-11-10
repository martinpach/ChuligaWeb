import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-mat-confirm-dialog',
  templateUrl: './mat-confirm-dialog.component.html',
  styleUrls: ['./mat-confirm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }, public dialogRef: MatDialogRef<MatConfirmDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close(false);
  }
}
