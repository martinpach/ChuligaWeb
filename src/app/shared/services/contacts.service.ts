import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Contact } from '../models';
import { map } from 'rxjs/operators';
import { mapToRenderObject } from '../utils/items-util';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  basePath = '/contacts';
  constructor(private db: AngularFirestore) {}

  getContacts(queryFn: QueryFn = null): Observable<Contact[]> {
    if (!queryFn) {
      return this.db
        .collection<Contact>(this.basePath)
        .snapshotChanges()
        .pipe(map(data => mapToRenderObject(data)));
    }
    return this.db
      .collection<Contact>(this.basePath, queryFn)
      .snapshotChanges()
      .pipe(map(data => mapToRenderObject(data)));
  }

  getContact(id: string): Observable<Contact> {
    return this.db.doc<Contact>(`${this.basePath}/${id}`).valueChanges();
  }

  addContact(contact: Contact) {
    return this.db.collection(this.basePath).add(contact);
  }

  updateContact(id: string, contact: Contact) {
    return this.db.doc(`${this.basePath}/${id}`).update(contact);
  }

  deleteContact(id: string) {
    return this.db.doc(`${this.basePath}/${id}`).delete();
  }

  deleteContacts(ids: string[]) {
    const batch = this.db.firestore.batch();
    ids.forEach(id => batch.delete(this.db.firestore.doc(`${this.basePath}/${id}`)));
    return batch.commit();
  }
}
