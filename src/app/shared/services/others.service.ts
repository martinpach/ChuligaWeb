import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { OthersItem } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OthersService {
  constructor(private db: AngularFirestore) {}

  save(id: string, othersItem: OthersItem) {
    return this.db.doc(`/others/${id}`).update(othersItem);
  }

  getOthersItem(id: string): Observable<OthersItem> {
    return this.db.doc<OthersItem>(`/others/${id}`).valueChanges();
  }
}
