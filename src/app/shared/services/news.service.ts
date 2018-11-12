import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, pluck, tap } from 'rxjs/operators';
import { NewsItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private db: AngularFirestore) {}

  getNews(queryFn: QueryFn): Observable<NewsItem[]> {
    return this.db
      .collection<NewsItem>('/news', queryFn)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as NewsItem;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getNewsItem(id: string): Observable<NewsItem> {
    return this.db.doc<NewsItem>(`/news/${id}`).valueChanges();
  }

  getNewsCount(): Observable<number> {
    return this.db
      .doc('/counts/news')
      .valueChanges()
      .pipe(pluck('count'));
  }

  addNewsItem(newsItem: NewsItem) {
    return this.db.collection('/news').add(newsItem);
  }

  updateNewsItem(id: string, newsItem: NewsItem) {
    return this.db.doc(`/news/${id}`).update(newsItem);
  }

  deleteNewsItem(id: string) {
    return this.db.doc(`/news/${id}`).delete();
  }
}
