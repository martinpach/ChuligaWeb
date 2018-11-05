import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NewsItem } from '../../../shared/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { NewsService } from '../../../shared/services/news.service';
import { tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-admin-news-list',
  templateUrl: './admin-news-list.component.html',
  styleUrls: ['./admin-news-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsListComponent {
  newsCount$: Observable<number>;
  loadMore = new BehaviorSubject(null);

  news$: Observable<NewsItem[]>;
  newsLength = 0;
  isLoading = false;
  limit = 5;

  constructor(private newsService: NewsService, private cd: ChangeDetectorRef) {
    this.news$ = this.loadMore.pipe(
      tap(() => (this.isLoading = true)),
      switchMap((_, index) =>
        newsService
          .getNews(ref => ref.orderBy('date', 'desc').limit(this.limit * (index + 1)))
          .pipe(tap(news => (this.newsLength = news.length)))
      ),
      tap(() => (this.isLoading = false))
    );
    this.newsCount$ = newsService.getNewsCount();
  }

  trackByFn(index: number) {
    return index;
  }
}
