import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { mapToRenderObject } from '../utils/items-util';
import { ServiceItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StagingsService {
  basePath = '/stagings';

  constructor(private db: AngularFirestore) {}

  getStagings(): Observable<ServiceItem[]> {
    return this.db
      .collection<ServiceItem>(this.basePath)
      .snapshotChanges()
      .pipe(map(data => mapToRenderObject(data)));
  }

  getStaging(id: string): Observable<ServiceItem> {
    return this.db.doc<ServiceItem>(`${this.basePath}/${id}`).valueChanges();
  }

  addStaging(serviceItem: ServiceItem) {
    return this.db.collection(this.basePath).add(serviceItem);
  }

  updateStaging(id: string, serviceItem: ServiceItem) {
    return this.db.doc(`${this.basePath}/${id}`).update(serviceItem);
  }

  deleteStaging(id: string) {
    return this.db.doc(`${this.basePath}/${id}`).delete();
  }

  deleteStagings(ids: string[]) {
    const batch = this.db.firestore.batch();
    ids.forEach(id => batch.delete(this.db.firestore.doc(`${this.basePath}/${id}`)));
    return batch.commit();
  }
}
