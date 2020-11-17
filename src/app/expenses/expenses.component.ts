import { Component, OnInit } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Expense, ExpenseContributor } from '../core/models/expense.model';
import { User } from '../core/models/user.model';
import { AuthService } from '../core/services/auth.service';
import { ExpenseService } from '../core/services/expense.service';
import { FriendService } from '../core/services/friend.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit {
  expenses: Expense[] = [];
  contributors: ExpenseContributor[][] = [];
  friends: User[] = [];
  user: User | null = null;

  constructor(private service: ExpenseService, private friendService: FriendService, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user: User | null | undefined) => {
      if (!!user) {
        this.user = user;
      }
    });

    this.service.getUserExpenses().subscribe((data: DocumentChangeAction<Expense>[]) => {
      this.expenses = data.map((x) => x.payload.doc.data());
      data.forEach((expense, i) => {
        this.service.getExpenseContributors(expense.payload.doc.id).subscribe((res) => {
          this.contributors[i] = res.map((x) => x.payload.doc.data());
        });
      });
    });

    this.friendService.getFriends().subscribe((data: DocumentChangeAction<User>[]) => {
      this.friends = data.map((x) => x.payload.doc.data());
    });
  }

  getContributors(id: string): Observable<DocumentChangeAction<ExpenseContributor>[]> {
    return this.service.getExpenseContributors(id);
  }

  createComment(): void {
    this.service.addComment('dsadsasadd', 'yoyoyo');
  }

  getFriend(id: string): User | undefined {
    return this.friends.find((x) => x.uid === id);
  }
}
