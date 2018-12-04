import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { MainDescription } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MainDescriptionService {
  constructor(private db: AngularFirestore) {}

  saveDescription(description: MainDescription) {
    return this.db.doc('/others/main-description').update(description);
  }

  getDescription(): Observable<MainDescription> {
    return this.db.doc<MainDescription>('/others/main-description').valueChanges();
  }
}
