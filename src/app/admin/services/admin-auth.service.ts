import { Injectable } from '@angular/core';
import { Subject, Observable, of, from } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, take, catchError, shareReplay, tap, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private isAdminSubject = new Subject<boolean>();
  isAdmin = this.isAdminSubject.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {
    this.isUserAdmin().subscribe();
  }

  login(email: string, password: string): Observable<any> {
    return from(this.afAuth.auth.signInWithEmailAndPassword(email, password)).pipe(
      switchMap(user => this.getUserVerified(user.user.uid)),
      tap(verified => this.isAdminSubject.next(verified)),
      take(1),
      catchError(err => {
        return of(false);
      })
    );
  }

  logout(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  isUserAdmin(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap(user => (user ? this.getUserVerified(user.uid) : of(false))),
      tap(verified => this.isAdminSubject.next(verified))
    );
  }

  private getUserVerified(uid: string): Observable<boolean> {
    return this.db
      .doc(`/admins/${uid}`)
      .valueChanges()
      .pipe(map((admin: { verified: boolean }) => admin && admin.verified));
  }
}
