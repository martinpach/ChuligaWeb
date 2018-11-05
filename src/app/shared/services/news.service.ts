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
    return this.db.collection<NewsItem>('/news', queryFn).valueChanges();
  }

  getNewsCount(): Observable<number> {
    return this.db
      .doc('/counts/news')
      .valueChanges()
      .pipe(pluck('count'));
  }
}
