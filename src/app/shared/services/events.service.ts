import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { EventItem } from '../models';
import { Observable } from 'rxjs';
import { pluck, map } from 'rxjs/operators';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
//TODO: same as NewsService
export class EventsService {
  constructor(private db: AngularFirestore) {}

  getEvents(queryFn: QueryFn): Observable<EventItem[]> {
    return this.db
      .collection<EventItem>('/events', queryFn)
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as EventItem;
            if (!data) return data;
            const id = a.payload.doc.id;
            const date = data.date ? formatDate(data.date.toDate(), 'dd.MM.yyyy HH:mm', 'en') : data.date;
            return { ...data, id, date };
          })
        )
      );
  }

  getEventItem(id: string): Observable<EventItem> {
    return this.db
      .doc<EventItem>(`/events/${id}`)
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
      .doc('/counts/events')
      .valueChanges()
      .pipe(pluck('count'));
  }

  addEventItem(eventItem: EventItem) {
    return this.db.collection('/events').add(eventItem);
  }

  updateEventItem(id: string, eventItem: EventItem) {
    return this.db.doc(`/events/${id}`).update(eventItem);
  }

  deleteEventItem(id: string) {
    return this.db.doc(`/events/${id}`).delete();
  }

  deleteEvents(ids: string[]) {
    const batch = this.db.firestore.batch();
    ids.forEach(id => batch.delete(this.db.firestore.doc(`/events/${id}`)));
    return batch.commit();
  }
}
