import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { NewsItem } from '../../../shared/models';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-mat-newsitem-details-dialog',
  templateUrl: './mat-newsitem-details-dialog.component.html',
  styleUrls: ['./mat-newsitem-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatNewsitemDetailsDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { newsItem: NewsItem }) {}

  ngOnInit() {}
}
