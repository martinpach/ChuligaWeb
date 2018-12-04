import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Contact } from '../models';
import { map } from 'rxjs/operators';
import { mapToRenderObject } from '../utils/items-util';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  constructor(private db: AngularFirestore) {}

  getContacts(): Observable<Contact[]> {
    return this.db
      .collection<Contact>('/contacts')
      .snapshotChanges()
      .pipe(map(data => mapToRenderObject(data)));
  }

  getContact(id: string): Observable<Contact> {
    return this.db.doc<Contact>(`/contacts/${id}`).valueChanges();
  }

  addContact(contact: Contact) {
    return this.db.collection('/contacts').add(contact);
  }

  updateContact(id: string, contact: Contact) {
    return this.db.doc(`/contacts/${id}`).update(contact);
  }

  deleteContact(id: string) {
    return this.db.doc(`/contacts/${id}`).delete();
  }

  deleteContacts(ids: string[]) {
    const batch = this.db.firestore.batch();
    ids.forEach(id => batch.delete(this.db.firestore.doc(`/contacts/${id}`)));
    return batch.commit();
  }
}
