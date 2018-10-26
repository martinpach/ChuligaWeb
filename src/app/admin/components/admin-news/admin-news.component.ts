import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NewsItem } from '../../../shared/models';
import { NewsService } from '../../../shared/services/news.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsComponent implements OnInit {
  news$: Observable<NewsItem[]>;

  constructor(private newsService: NewsService) {
    this.news$ = newsService.getNews();
  }

  ngOnInit() {}
}
