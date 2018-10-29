import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NewsItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private db: AngularFirestore) {}

  getNews(): Observable<NewsItem[]> {
    return this.db
      .collection('/news')
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
}
