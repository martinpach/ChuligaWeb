import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {}

  loginAdmin(email: string, password: string): Observable<any> {
    return from(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
    ).pipe(
      switchMap(({ user }) =>
        this.db.doc(`/admins/${user.uid}`).valueChanges()
      ),
      catchError(
        err => new Observable(observer => observer.next({ verified: false }))
      )
    );
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      location.reload();
    });
  }

  isUserAdmin(): Observable<boolean> {
    return new Observable(observer => {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.db
            .doc(`/admins/${this.afAuth.auth.currentUser.uid}`)
            .valueChanges()
            .subscribe(({ verified }) => {
              observer.next(verified);
            });
        } else {
          observer.next(false);
        }
      });
    });
  }
}
