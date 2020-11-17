import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, timeout } from 'rxjs/operators';

import { User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  constructor(private afs: AngularFirestore, private auth: AuthService) {}

  getFriends(): Observable<DocumentChangeAction<User>[]> {
    return this.auth.user$.pipe(
      switchMap((user: User | null | undefined) => {
        if (!!user) {
          return this.afs
            .collection<User>('users', (ref) => ref.where('uid', '!=', user.uid))
            .snapshotChanges();
        } else {
          return of([]);
        }
      })
    );
  }
}
