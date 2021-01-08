import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentChangeAction, DocumentSnapshot } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Group } from '../models/group.model';
import { User } from '../models/user.model';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private authService: AuthService, private afs: AngularFirestore, private snackbar: SnackbarService) {}

  getUserGroups(): Observable<DocumentChangeAction<Group>[]> {
    return this.authService.user$.pipe(
      switchMap((user: User | null | undefined) => {
        if (!!user) {
          return this.afs
            .collection<Group>('groups', (ref) => ref.where('userIds', 'array-contains', user.uid))
            .snapshotChanges();
        } else {
          return of([]);
        }
      })
    );
  }

  getGroupDetails(id: string): Observable<Group | null> {
    return this.afs
      .doc<Group>(`groups/${id}`)
      .snapshotChanges()
      .pipe(
        map((changes) => {
          const data = changes.payload.data();

          if (!data) {
            return null;
          }

          return { id: changes.payload.id, ...data };
        })
      );
  }

  async createGroup(group: Group): Promise<void> {
    if (!!group) {
      try {
        const docRef = this.afs.collection('groups').add(group);
        this.snackbar.open('Group has been created');
      } catch (err) {
        if (!!err.message) {
          this.snackbar.open(err.message);
        }
        console.error(err);
      }
    }
  }
}
