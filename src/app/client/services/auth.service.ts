import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ClientUser } from '../../shared/models';
import { SignupResponse, LoginResponse } from '../models';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { UsersService } from '../../shared/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedInUser: Observable<ClientUser>;
  usersPath = '/users';

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, usersService: UsersService) {
    this.loggedInUser = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user && user.emailVerified) {
          return usersService.getUser(user.uid);
        }
        return of(null);
      })
    );
  }

  async emailSignUp(user: ClientUser, password: string): Promise<SignupResponse> {
    try {
      const userCredential: firebase.auth.UserCredential = await this.afAuth.auth.createUserWithEmailAndPassword(user.email, password);
      await userCredential.user.sendEmailVerification();
      user.id = userCredential.user.uid;
      await this.db.doc(this.usersPath + '/' + userCredential.user.uid).set(user);
      return Promise.resolve(SignupResponse.OK);
    } catch (e) {
      if (e.code === 'auth/email-already-in-use') return Promise.reject(SignupResponse.EMAIL_ALREADY_IN_USE);
      return Promise.reject(SignupResponse.UNKNOWN_ERROR);
    }
  }

  async emailLogin(email: string, password: string): Promise<LoginResponse> {
    try {
      const userCredential = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      if (userCredential.user.emailVerified) {
        return Promise.resolve(LoginResponse.OK);
      }
      userCredential.user.sendEmailVerification();
      return Promise.reject(LoginResponse.EMAIL_NOT_VERIFIED);
    } catch (e) {
      return Promise.reject(LoginResponse.INVALID_CREDENTIAL);
    }
  }

  async providerLogin(provider: firebase.auth.AuthProvider) {
    const userCredential = await this.afAuth.auth.signInWithPopup(provider);
    const user: ClientUser = {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      picture: userCredential.user.photoURL
    };
    this.db
      .doc(this.usersPath + '/' + userCredential.user.uid)
      .get()
      .pipe(take(1))
      .subscribe(u => {
        if (u.exists) return this.db.doc(this.usersPath + '/' + userCredential.user.uid).update(user);
        user.events = [];
        user.courses = [];
        this.db.doc(this.usersPath + '/' + userCredential.user.uid).set(user);
      });
  }

  logout(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
