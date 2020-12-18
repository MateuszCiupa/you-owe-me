import { ExtendedExpenseContributor, ShareByType } from 'src/app/core/models/expense.model';

export interface ShareByDialogData {
  contributors: ExtendedExpenseContributor[];
  type: ShareByType;
  lastType: ShareByType;
  expenseValue: number;
}
