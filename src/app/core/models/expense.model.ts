import { User } from './user.model';

export interface Expense {
  title: string;
  description?: string;
  value: number;
  date: Date;
  contributorIds: string[];
}

export interface ExpenseComment {
  content: string;
  details: {
    displayName: string | null;
    date: Date;
  };
}

export interface ExpenseContributor {
  uid: string;
  paid: number;
  spent: number;
}

export interface ExtendedExpenseContributor {
  user: User;
  paid: number;
  spent: number;
}

export enum ShareByType {
  EQUAL = 'EQUAL',
  UNEQUAL = 'UNEQUAL',
  SHARES = 'SHARES',
  PERCENTAGE = 'PERCENTAGE',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum PaidByType {
  YOU = 'YOU',
  MANY = 'MANY',
}
