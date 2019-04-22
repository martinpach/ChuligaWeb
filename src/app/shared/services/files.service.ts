import { Injectable } from '@angular/core';
import { storage } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private basePath: string = '/uploads';

  upload(file: File, folder = '') {
    const storageRef = storage().ref();
    return storageRef.child(`${this.basePath}/${folder}${new Date().getTime()}_${file.name}`).put(file);
  }

  delete(name: string, folder = '') {
    const storageRef = storage().ref();
    return storageRef.child(`${this.basePath}/${folder}${name}`).delete();
  }

  deleteByUrl(url: string) {
    return storage()
      .refFromURL(url)
      .delete();
  }
}
