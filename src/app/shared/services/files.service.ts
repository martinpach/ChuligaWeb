import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private basePath: string = '/uploads';

  upload(file: File, folder = '') {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.basePath}/${folder}${new Date().getTime()}_${file.name}`).put(file);
  }

  delete(name: string, folder = '') {
    const storageRef = firebase.storage().ref();
    return storageRef.child(`${this.basePath}/${folder}${name}`).delete();
  }

  deleteByUrl(url: string) {
    return firebase
      .storage()
      .refFromURL(url)
      .delete();
  }
}
