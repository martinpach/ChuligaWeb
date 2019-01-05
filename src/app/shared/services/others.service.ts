import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { OthersItem } from '../models';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { mapToRenderObject } from '../utils/items-util';
import { arrayToObject } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class OthersService {
  basePath = '/others';
  constructor(private db: AngularFirestore) {}

  save(id: string, othersItem: OthersItem) {
    return this.db.doc(`${this.basePath}/${id}`).update(othersItem);
  }

  getOthersItem(id: string): Observable<OthersItem> {
    return this.db.doc<OthersItem>(`${this.basePath}/${id}`).valueChanges();
  }

  getOthersItems(): Observable<{ [key: string]: OthersItem }[]> {
    return this.db
      .collection<OthersItem>(`${this.basePath}`)
      .snapshotChanges()
      .pipe(map(data => arrayToObject(mapToRenderObject(data), 'id')));
  }
}
