import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NewsService } from '../../../shared/services/news.service';
import { NewsItem } from '../../../shared/models';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { NavigationService } from '../../services/navigation.service';
import { DialogService } from '../../../material/services/dialog.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewsComponent {
  news$: Observable<NewsItem[]>;
  newsCount$: Observable<number>;
  loadMore = new BehaviorSubject(null);
  isLoading = false;
  newsLength = 0;
  limit = 5;

  constructor(newsService: NewsService, navigationService: NavigationService, public dialogService: DialogService) {
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
    navigationService.scrollBreakpoint.next(0);
  }

  trackByFn(index: number) {
    return index;
  }
}
