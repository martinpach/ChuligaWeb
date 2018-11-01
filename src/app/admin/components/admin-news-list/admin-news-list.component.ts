import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { NewsItem } from '../../../shared/models';

@Component({
  selector: 'app-admin-news-list',
  templateUrl: './admin-news-list.component.html',
  styleUrls: ['./admin-news-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsListComponent implements OnInit {
  @Input()
  newsCount: number;
  @Input()
  news: NewsItem[];
  @Input()
  isLoading: boolean;

  @Output()
  onLoadMore = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
