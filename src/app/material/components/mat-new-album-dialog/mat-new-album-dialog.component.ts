import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-mat-new-album-dialog',
  templateUrl: './mat-new-album-dialog.component.html',
  styleUrls: ['./mat-new-album-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatNewAlbumDialogComponent {
  album: string;
  constructor(public dialogRef: MatDialogRef<MatNewAlbumDialogComponent>) {}

  onNoClick() {
    this.dialogRef.close();
  }
}
