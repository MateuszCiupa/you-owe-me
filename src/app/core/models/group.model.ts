export interface Group {
  displayName: string;
  description: string;
  userIds: string[];
  isSmartExpenses: boolean;
  date: Date;
  photoURL?: string;
}
