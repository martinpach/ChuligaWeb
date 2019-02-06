import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { ClientUser } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  basePath = '/users';
  constructor(private db: AngularFirestore) {}

  getUser(id: string): Observable<ClientUser> {
    return this.db.doc<ClientUser>(`${this.basePath}/${id}`).valueChanges();
  }

  updateUser(id: string, user: ClientUser) {
    return this.db.doc(`${this.basePath}/${id}`).update(user);
  }
}
