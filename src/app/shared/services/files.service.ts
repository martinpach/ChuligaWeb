import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Upload } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private basePath: string = '/uploads';

  upload(upload: Upload) {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);
  }

  delete(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete();
  }
}
