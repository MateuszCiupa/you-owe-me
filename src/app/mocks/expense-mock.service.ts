import { Observable, of } from 'rxjs';

export const expenseServiceMock = {
  createExpense(): void {},
  getUserExpenses(): Observable<[]> {
    return of([]);
  },
  getExpenseContributors(): void {},
  addComment(): void {},
};
