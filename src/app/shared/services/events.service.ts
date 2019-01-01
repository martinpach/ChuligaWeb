import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { EventItem } from '../models';
import { Observable } from 'rxjs';
import { pluck, map } from 'rxjs/operators';
import { mapToRenderObject } from '../utils/items-util';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  basePath = '/events';
  constructor(private db: AngularFirestore) {}

  getEvents(queryFn: QueryFn): Observable<EventItem[]> {
    return this.db
      .collection<EventItem>(this.basePath, queryFn)
      .snapshotChanges()
      .pipe(map(data => mapToRenderObject(data)));
  }

  getEventItem(id: string): Observable<EventItem> {
    return this.db
      .doc<EventItem>(`${this.basePath}/${id}`)
      .valueChanges()
      .pipe(
        map(item => {
          if (!item) return item;
          const date = item.date ? item.date.toDate() : item.date;
          return { ...item, date };
        })
      );
  }

  getEventsCount(): Observable<number> {
    return this.db
      .doc(`/counts${this.basePath}`)
      .valueChanges()
      .pipe(pluck('count'));
  }

  addEventItem(eventItem: EventItem) {
    return this.db.collection(this.basePath).add(eventItem);
  }

  updateEventItem(id: string, eventItem: EventItem) {
    return this.db.doc(`${this.basePath}/${id}`).update(eventItem);
  }

  deleteEventItem(id: string) {
    return this.db.doc(`${this.basePath}/${id}`).delete();
  }

  deleteEvents(ids: string[]) {
    const batch = this.db.firestore.batch();
    ids.forEach(id => batch.delete(this.db.firestore.doc(`${this.basePath}/${id}`)));
    return batch.commit();
  }
}
