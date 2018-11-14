import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { EventItem } from '../models';
import { Observable } from 'rxjs';
import { pluck, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
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
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  getEventsCount(): Observable<number> {
    return this.db
      .doc('/counts/events')
      .valueChanges()
      .pipe(pluck('count'));
  }
}
