import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GalleryAlbum, ServerImageInfo } from '../models';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  constructor(private db: AngularFirestore) {}

  getAlbum(id: string): Observable<GalleryAlbum> {
    //TODO: change it to gallery later
    return this.db.doc<GalleryAlbum>(`/galery/${id}`).valueChanges();
  }

  createAlbum(album: GalleryAlbum): Promise<any> {
    return this.db.collection('/galery').add(album);
  }

  updateImages(id: string, pictures: ServerImageInfo[]): Promise<any> {
    return this.db.doc(`/galery/${id}`).update({ pictures });
  }
}
