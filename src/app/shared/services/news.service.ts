import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { NewsItem } from '../models';
import { mapToRenderObject } from '../utils/items-util';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(private db: AngularFirestore) {}

  getNews(queryFn: QueryFn): Observable<NewsItem[]> {
    return this.db
      .collection<NewsItem>('/news', queryFn)
      .snapshotChanges()
      .pipe(map(data => mapToRenderObject(data)));
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

  deleteNews(ids: string[]) {
    const batch = this.db.firestore.batch();
    ids.forEach(id => batch.delete(this.db.firestore.doc(`/news/${id}`)));
    return batch.commit();
  }
}
