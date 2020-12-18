import { ExtendedExpenseContributor } from 'src/app/core/models/expense.model';

export interface PaidByDialogData {
  contributors: ExtendedExpenseContributor[];
  expenseValue: number;
}
