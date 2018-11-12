import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private basePath: string = '/uploads';

  upload(file: File) {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.basePath}/${file.name}`).put(file);
  }

  delete(name: string) {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.basePath}/${name}`).delete();
  }
}
