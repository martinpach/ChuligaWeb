import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { GalleryAlbum } from '../models';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  path = '/gallery';
  constructor(private db: AngularFirestore) {}

  getAlbum(id: string): Observable<GalleryAlbum> {
    return this.db.doc<GalleryAlbum>(`${this.path}/${id}`).valueChanges();
  }

  createAlbum(album: GalleryAlbum): Promise<DocumentReference> {
    return this.db.collection(this.path).add(album);
  }

  deleteAlbum(id: string) {
    return this.db.doc(`${this.path}/${id}`).delete();
  }

  addImages(id: string, pictures: string[]): Promise<any> {
    return this.db.doc(`${this.path}/${id}`).update({
      pictures: firebase.firestore.FieldValue.arrayUnion(...pictures)
    });
  }

  deleteImages(id: string, pictures: string[]) {
    return this.db.doc(`${this.path}/${id}`).update({
      pictures: firebase.firestore.FieldValue.arrayRemove(...pictures)
    });
  }

  addChild(id: string, child: string) {
    return this.db.doc(`${this.path}/${id}`).update({
      childrens: firebase.firestore.FieldValue.arrayUnion(child)
    });
  }

  deleteChild(id: string, child: string) {
    return this.db.doc(`${this.path}/${id}`).update({
      childrens: firebase.firestore.FieldValue.arrayRemove(child)
    });
  }
}
