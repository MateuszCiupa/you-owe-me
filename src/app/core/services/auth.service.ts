import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import firebase from 'firebase/app';

import { RegisterForm } from 'src/app/public/register/register.model';
import { SnackbarService } from './snackbar.service';
import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<User | null | undefined>;

  constructor(
    private auth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private snackbar: SnackbarService
  ) {
    this.user$ = this.auth.authState.pipe(
      switchMap((user) => {
        if (!!user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['dashboard']);
    } catch (err) {
      if (!!err.message) {
        this.snackbar.open(err.message);
      }
      console.log(err);
    }
  }

  async signUp({ username, email, password }: RegisterForm): Promise<void> {
    try {
      const cred = await this.auth.createUserWithEmailAndPassword(email, password);

      if (!!cred.user) {
        await this.afs.collection('users').doc(cred.user.uid).set({
          displayName: username,
          email,
        });
      }

      this.router.navigate(['login']);
    } catch (err) {
      if (!!err.message) {
        this.snackbar.open(err.message);
      }
      console.log(err);
    }
  }

  async googleSignIn(): Promise<Promise<void> | void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const cred = await this.auth.signInWithPopup(provider);

    if (!!cred.user) {
      this.router.navigate(['dashboard']);
      return this.updateUserData(cred.user);
    }
  }

  async signOut(): Promise<Promise<boolean>> {
    await this.auth.signOut();
    return this.router.navigate(['login']);
  }

  private updateUserData({ uid, email, displayName, photoURL }: User): Promise<void> {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);

    const data = { uid, email, displayName, photoURL };

    return userRef.set(data, { merge: true });
  }
}
