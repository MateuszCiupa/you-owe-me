import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExtendedExpenseContributor } from 'src/app/core/models/expense.model';

import { PaidByDialogData } from './paid-by-dialog.model';

@Component({
  selector: 'app-paid-by-dialog',
  templateUrl: './paid-by-dialog.component.html',
  styleUrls: ['./paid-by-dialog.component.scss'],
})
export class PaidByDialogComponent implements OnInit {
  contributorsControl: FormArray;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PaidByDialogData,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PaidByDialogComponent>
  ) {
    this.contributorsControl = this.fb.array(
      this.data.contributors.map((contr) =>
        this.fb.control(contr.paid, [Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)])
      )
    );
  }

  ngOnInit(): void {}

  getContributorControl(index: number): FormControl {
    return this.contributorsControl.at(index) as FormControl;
  }

  get isSubmitDisabled(): boolean {
    return !this.data.expenseValue || this.data.expenseValue !== this.totalContributorsValue;
  }

  get totalContributorsValue(): number {
    return Number(this.contributorsControl.value.reduce((a: number, b: number) => a + b, 0).toFixed(2));
  }

  get paidBySubtitle(): string {
    const value = this.totalContributorsValue;
    const expenseValue = this.data.expenseValue;

    if (expenseValue <= value || this.contributorsControl.invalid || value < 0) {
      return '';
    }

    return !this.data.expenseValue
      ? 'Provide expense value'
      : `Paid ${value.toFixed(2)} of ${expenseValue.toFixed(2)}, ${(expenseValue - value).toFixed(2)} left`;
  }

  onSubmit(): void {
    const data: ExtendedExpenseContributor[] = this.data.contributors.map((contr: ExtendedExpenseContributor, idx) => ({
      ...contr,
      paid: this.getContributorControl(idx).value,
    }));
    this.dialogRef.close(data);
  }
}
