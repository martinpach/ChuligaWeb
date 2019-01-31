import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatConfirmDialogComponent } from '../components/mat-confirm-dialog/mat-confirm-dialog.component';
import { MatNewAlbumDialogComponent } from '../components/mat-new-album-dialog/mat-new-album-dialog.component';
import { MatNewsitemDetailsDialogComponent } from '../components/mat-newsitem-details-dialog/mat-newsitem-details-dialog.component';
import { NewsItem } from '../../shared/models';
import { MatPasswordResetDialogComponent } from '../components/mat-password-reset-dialog/mat-password-reset-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmDialog(message: string) {
    return this.dialog.open(MatConfirmDialogComponent, {
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      data: {
        message
      }
    });
  }

  openNewAlbumDialog() {
    return this.dialog.open(MatNewAlbumDialogComponent);
  }

  openNewsItemDetailsDialog(newsItem: NewsItem) {
    return this.dialog.open(MatNewsitemDetailsDialogComponent, {
      width: '980px',
      maxWidth: '980px',
      data: {
        newsItem
      }
    });
  }

  openPasswordResetDialog() {
    return this.dialog.open(MatPasswordResetDialogComponent);
  }
}
