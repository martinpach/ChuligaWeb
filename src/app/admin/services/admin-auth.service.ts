import { Injectable } from '@angular/core';
import { Subject, Observable, of, from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  switchMap,
  pluck,
  take,
  catchError,
  shareReplay
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private isAdminSubject = new Subject<boolean>();
  isAdmin = this.isAdminSubject.pipe(shareReplay(1));

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {
    this.isUserAdmin().subscribe(isAdmin => this.isAdminSubject.next(isAdmin));
  }

  login(email: string, password: string): Observable<any> {
    return from(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
    ).pipe(
      switchMap(({ user }) =>
        this.db.doc(`/admins/${user.uid}`).valueChanges()
      ),
      take(1),
      catchError(err => of({ verified: false }))
    );
  }

  isUserAdmin(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap(
        user =>
          user
            ? this.db
                .doc(`/admins/${user.uid}`)
                .valueChanges()
                .pipe(pluck('verified'))
            : of(false)
      )
    );
  }
}
