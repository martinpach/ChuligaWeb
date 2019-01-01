import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { mapToRenderObject } from '../utils/items-util';
import { ServiceItem } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  basePath = '/services';
  constructor(private db: AngularFirestore) {}

  getServices(): Observable<ServiceItem[]> {
    return this.db
      .collection<ServiceItem>(this.basePath)
      .snapshotChanges()
      .pipe(map(data => mapToRenderObject(data)));
  }

  getServiceItem(id: string): Observable<ServiceItem> {
    return this.db.doc<ServiceItem>(`${this.basePath}/${id}`).valueChanges();
  }

  addServiceItem(serviceItem: ServiceItem) {
    return this.db.collection(this.basePath).add(serviceItem);
  }

  updateServiceItem(id: string, serviceItem: ServiceItem) {
    return this.db.doc(`${this.basePath}/${id}`).update(serviceItem);
  }

  deleteServiceItem(id: string) {
    return this.db.doc(`${this.basePath}/${id}`).delete();
  }

  deleteServices(ids: string[]) {
    const batch = this.db.firestore.batch();
    ids.forEach(id => batch.delete(this.db.firestore.doc(`${this.basePath}/${id}`)));
    return batch.commit();
  }
}
