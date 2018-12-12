import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GalleryAlbum } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  constructor(private db: AngularFirestore) {}

  getAlbum(id: string): Observable<GalleryAlbum> {
    //TODO: change it to gallery later
    return this.db.doc<GalleryAlbum>(`/galery/${id}`).valueChanges();
  }
}
