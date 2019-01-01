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
  basePath = '/news';
  constructor(private db: AngularFirestore) {}

  getNews(queryFn: QueryFn): Observable<NewsItem[]> {
    return this.db
      .collection<NewsItem>(this.basePath, queryFn)
      .snapshotChanges()
      .pipe(map(data => mapToRenderObject(data)));
  }

  getNewsItem(id: string): Observable<NewsItem> {
    return this.db.doc<NewsItem>(`${this.basePath}/${id}`).valueChanges();
  }

  getNewsCount(): Observable<number> {
    return this.db
      .doc(`/counts${this.basePath}`)
      .valueChanges()
      .pipe(pluck('count'));
  }

  addNewsItem(newsItem: NewsItem) {
    return this.db.collection(this.basePath).add(newsItem);
  }

  updateNewsItem(id: string, newsItem: NewsItem) {
    return this.db.doc(`${this.basePath}/${id}`).update(newsItem);
  }

  deleteNewsItem(id: string) {
    return this.db.doc(`${this.basePath}/${id}`).delete();
  }

  deleteNews(ids: string[]) {
    const batch = this.db.firestore.batch();
    ids.forEach(id => batch.delete(this.db.firestore.doc(`${this.basePath}/${id}`)));
    return batch.commit();
  }
}
