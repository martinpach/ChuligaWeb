import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { NewsItem } from '../../../shared/models';
import { MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-mat-newsitem-details-dialog',
  templateUrl: './mat-newsitem-details-dialog.component.html',
  styleUrls: ['./mat-newsitem-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatNewsitemDetailsDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { newsItem: NewsItem }, private domSanitizer: DomSanitizer) {}
}
