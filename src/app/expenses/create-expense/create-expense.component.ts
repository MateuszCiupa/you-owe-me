import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DocumentChangeAction } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { User } from 'src/app/core/models/user.model';
import { FriendService } from 'src/app/core/services/friend.service';
import {
  ShareByType,
  PaidByType,
  ExtendedExpenseContributor,
  Expense,
  ExpenseContributor,
} from 'src/app/core/models/expense.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { PaidByDialogComponent } from './paid-by-dialog/paid-by-dialog.component';
import { PaidByDialogData } from './paid-by-dialog/paid-by-dialog.model';
import { ShareByDialogComponent } from './share-by-dialog/share-by-dialog.component';
import { ShareByDialogData } from './share-by-dialog/share-by-dialog.model';
import { SnackbarService } from 'src/app/core/services/snackbar.service';
import { ExpenseService } from 'src/app/core/services/expense.service';

@Component({
  selector: 'app-create-expense-dialog',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.scss'],
})
export class CreateExpenseComponent implements OnInit {
  expenseControl: FormGroup;
  shareByTypes = Object.keys(ShareByType);
  shareByDialogLastType: ShareByType = ShareByType.EQUAL;
  paidByTypes = Object.keys(PaidByType);
  contributors: ExtendedExpenseContributor[] = [];
  user: User | null = null;
  friends$: Observable<DocumentChangeAction<User>[]>;
  friendControl: FormControl;

  @ViewChild('friendInput') friendInput?: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private friendService: FriendService,
    private auth: AuthService,
    private dialog: MatDialog,
    private snackbar: SnackbarService,
    private expenseService: ExpenseService,
    private router: Router
  ) {
    this.expenseControl = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(20)]],
      value: [null, [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      description: ['', [Validators.maxLength(100)]],
      paidBy: [{ value: PaidByType.YOU, disabled: true }],
      shareBy: [{ value: ShareByType.EQUAL, disabled: true }],
    });
    this.friends$ = this.friendService.getFriends();
    this.friendControl = new FormControl('');
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((user: User | null | undefined) => {
      if (!!user) {
        this.user = user;
        this.contributors.push({ user, paid: 0, spent: 0 });
      }
    });
  }

  get valueControl(): FormControl {
    return this.expenseControl.get('value') as FormControl;
  }

  get titleControl(): FormControl {
    return this.expenseControl.get('title') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.expenseControl.get('description') as FormControl;
  }

  get paidByControl(): FormControl {
    return this.expenseControl.get('paidBy') as FormControl;
  }

  get shareByControl(): FormControl {
    return this.expenseControl.get('shareBy') as FormControl;
  }

  friendSelected(event: MatAutocompleteSelectedEvent): void {
    const user: User = event.option.value;
    this.contributors.push({ user, paid: 0, spent: 0 });
    this.friendControl.reset('');
    if (this.friendInput) {
      this.friendInput.nativeElement.value = '';
    }
    if (this.contributors.length === 2) {
      this.paidByControl.enable();
      this.shareByControl.enable();
    }
  }

  isFriendFiltered(friend: User): boolean {
    const isFilteredByInput = !(friend.displayName.toLowerCase().indexOf(this.friendControl.value.toLowerCase()) >= 0);
    const isFilteredByArray = !!this.contributors.find((x: ExtendedExpenseContributor) => x.user.uid === friend.uid);
    return isFilteredByInput || isFilteredByArray;
  }

  removeContributor(uid: string): void {
    this.contributors = this.contributors.filter((x: ExtendedExpenseContributor) => x.user.uid !== uid);
    if (this.contributors.length === 1) {
      this.expenseControl.patchValue({
        paidBy: PaidByType.YOU,
        shareBy: ShareByType.EQUAL,
      });
      this.paidByControl.disable();
      this.shareByControl.disable();
    }
  }

  async onCreate(): Promise<void> {
    const { title, value, description } = this.expenseControl.value;

    if (this.expenseControl.invalid) {
      this.snackbar.open('Provided values are missing or incorrect');
    } else {
      const expense: Expense = {
        title,
        value,
        description,
        date: new Date(),
        contributorIds: this.contributors.map((contr: ExtendedExpenseContributor) => contr.user.uid),
      };
      const contributors: ExpenseContributor[] = this.updatedContributors.map(
        ({ user, paid, spent }: ExtendedExpenseContributor) => ({ uid: user.uid, paid, spent })
      );

      if (this.paidByControl.value === PaidByType.YOU) {
        const idx = contributors.findIndex((contr: ExpenseContributor) => contr.uid === this.user?.uid);
        contributors[idx].paid = value;
      }

      await this.expenseService.createExpense(expense, contributors);
      this.router.navigate(['/expenses']);
    }
  }

  onPaidByChange(event: MatSelectChange): void {
    if (event.value === PaidByType.MANY) {
      this.openPaidByDialog();
    } else if (event.value === PaidByType.YOU) {
      this.contributors = this.contributors.map((contr: ExtendedExpenseContributor) => ({ ...contr, paid: 0 }));
    }
  }

  get totalPaidByValue(): number {
    return Number(this.contributors.reduce((a: number, b: ExtendedExpenseContributor) => a + b.paid, 0).toFixed(2));
  }

  /**
   * Get contributors array based on current contributors and shareByDialogLastType
   */
  get updatedContributors(): ExtendedExpenseContributor[] {
    return this.contributors.map(({ user, paid, spent }, idx) => {
      let spentResult = 0;
      const value = this.valueControl.value;
      const n = this.contributors.length;

      switch (this.shareByDialogLastType) {
        case ShareByType.ADJUSTMENT:
          spentResult = (value - this.totalSpentValue) / n + spent;
          break;
        case ShareByType.EQUAL:
          const mod = Number((value / n).toFixed(2));
          const rest = Number((value - mod * n).toFixed(2)) / 0.01;
          spentResult = mod + (idx < rest ? 0.01 : 0);
          break;
        case ShareByType.PERCENTAGE:
          spentResult = (spent * this.valueControl.value) / 100;
          break;
        case ShareByType.SHARES:
          spentResult = (spent * value) / this.totalSpentValue;
          break;
        case ShareByType.UNEQUAL:
          spentResult = spent;
          break;
      }

      return {
        user,
        paid,
        spent: Number(spentResult.toFixed(2)),
      };
    });
  }

  get totalSpentValue(): number {
    return Number(this.contributors.reduce((a: number, b) => a + b.spent, 0).toFixed(2));
  }

  onShareByChange(event: MatSelectChange): void {
    if (event.value !== ShareByType.EQUAL) {
      this.openShareByDialog(event.value);
    } else {
      this.shareByDialogLastType = ShareByType.EQUAL;
    }
  }

  openPaidByDialog(): void {
    const dialogRef = this.dialog.open<PaidByDialogComponent, PaidByDialogData>(PaidByDialogComponent, {
      width: '600px',
      data: {
        contributors: this.contributors,
        expenseValue: this.valueControl.value,
      },
    });
    dialogRef.afterClosed().subscribe((data: ExtendedExpenseContributor[] | '' | undefined) => {
      this.expenseControl.patchValue({
        paidBy: null,
      });
      if (!!data) {
        this.contributors = data;
      }
    });
  }

  openShareByDialog(type: ShareByType): void {
    const dialogRef = this.dialog.open<ShareByDialogComponent, ShareByDialogData>(ShareByDialogComponent, {
      width: '600px',
      data: {
        type,
        contributors: this.contributors,
        lastType: this.shareByDialogLastType,
        expenseValue: this.valueControl.value,
      },
    });
    dialogRef.afterClosed().subscribe((data: ExtendedExpenseContributor[] | '' | undefined) => {
      if (!!data) {
        this.contributors = data;
        this.shareByDialogLastType = type;
      }
      this.expenseControl.patchValue({
        shareBy: null,
      });
    });
  }

  get paidByContrCount(): number {
    return this.contributors.filter((contr: ExtendedExpenseContributor) => !!contr.paid).length;
  }
}
