import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentChangeAction } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Expense, ExpenseComment, ExpenseContributor } from '../models/expense.model';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private snackbar: SnackbarService, private auth: AuthService, private afs: AngularFirestore) {}

  async createExpense(expense: Expense, contributors: ExpenseContributor[]): Promise<void> {
    const user = this.auth.user;
    if (!!user && !!expense && !!contributors) {
      try {
        const docRef = await this.afs.collection('expenses').add(expense);
        const batch = this.afs.firestore.batch();
        for (const contributor of contributors) {
          batch.set(docRef.collection('contributors').doc(), contributor);
        }
        await batch.commit();
        this.snackbar.open('Expense has been created');
      } catch (err) {
        if (!!err.message) {
          this.snackbar.open(err.message);
        }
        console.error(err);
      }
    }
  }

  getUserExpenses(): Observable<DocumentChangeAction<Expense>[]> {
    return this.auth.user$.pipe(
      switchMap((user: User | null | undefined) => {
        if (!!user) {
          return this.afs
            .collection<Expense>('expenses', (ref) => ref.where('contributorIds', 'array-contains', user.uid))
            .snapshotChanges();
        } else {
          return of([]);
        }
      })
    );
  }

  getExpenseContributors(id: string): Observable<DocumentChangeAction<ExpenseContributor>[]> {
    return this.afs.doc(`expenses/${id}`).collection<ExpenseContributor>('contributors').snapshotChanges();
  }

  async addComment(expenseId: string, content: string): Promise<void> {
    const user = this.auth.user;
    if (!!user) {
      const expenseRef: AngularFirestoreDocument<Expense> = this.afs.doc(`expenses/${expenseId}`);
      const comment: ExpenseComment = {
        content,
        details: {
          displayName: user.displayName,
          date: new Date(),
        },
      };
      try {
        await expenseRef.collection('comments').add(comment);
      } catch (err) {
        if (!!err.message) {
          this.snackbar.open(err.message);
        }
        console.error(err);
      }
    }
  }
}
