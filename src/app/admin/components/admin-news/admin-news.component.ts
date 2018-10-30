import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NewsItem } from '../../../shared/models';
import { NewsService } from '../../../shared/services/news.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminNewsComponent implements OnDestroy {
  newsCount$: Observable<number>;
  newsSubscription: Subscription;

  news: NewsItem[];
  isLoading = false;
  limit = 2;

  constructor(private newsService: NewsService, private cd: ChangeDetectorRef) {
    this.newsSubscription = newsService.getNews(ref => ref.orderBy('date', 'desc').limit(this.limit)).subscribe(news => {
      this.news = news;
      cd.markForCheck();
    });
    this.newsCount$ = newsService.getNewsCount();
  }

  test() {
    this.isLoading = true;
    this.newsSubscription = this.newsService
      .getNews(ref =>
        ref
          .orderBy('date', 'desc')
          .startAfter(this.news[this.news.length - 1].date)
          .limit(this.limit)
      )
      .subscribe(news => {
        this.isLoading = false;
        this.news.push(...news);
        this.cd.markForCheck();
      });
  }

  ngOnDestroy() {
    this.newsSubscription.unsubscribe();
  }
}
