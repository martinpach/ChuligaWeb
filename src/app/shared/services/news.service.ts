import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { NewsItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private db: AngularFirestore) {}

  getNews(queryFn: QueryFn): Observable<NewsItem[]> {
    return this.db
      .collection('/news', queryFn)
      .valueChanges()
      .pipe(
        map(news =>
          news.map((newsItem: any) => ({
            ...newsItem,
            date: newsItem.date.toDate() // TODO: map here or call toDate in template
          }))
        )
      );
  }

  getNewsCount(): Observable<number> {
    return this.db
      .doc('/counts/news')
      .valueChanges()
      .pipe(pluck('count'));
  }
}
