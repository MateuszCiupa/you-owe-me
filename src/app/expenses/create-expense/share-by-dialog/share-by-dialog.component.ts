import { Component, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ExtendedExpenseContributor, ShareByType } from 'src/app/core/models/expense.model';
import { ShareByDialogData } from './share-by-dialog.model';

@Component({
  selector: 'app-share-by-dialog',
  templateUrl: './share-by-dialog.component.html',
  styleUrls: ['./share-by-dialog.component.scss'],
})
export class ShareByDialogComponent implements OnInit {
  type: ShareByType;
  contributorsControl: FormArray;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ShareByDialogData,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ShareByDialogComponent>
  ) {
    this.type = data.type;
    this.contributorsControl = this.fb.array(
      this.data.contributors.map((contr) =>
        this.fb.control(this.type === this.data.lastType ? contr.spent : this.getDefaultValue(this.type), [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/),
        ])
      )
    );
  }

  ngOnInit(): void {}

  get title(): string {
    switch (this.type) {
      case ShareByType.UNEQUAL:
        return 'Split unequally';
      case ShareByType.SHARES:
        return 'Split by shares';
      default:
        return `Share by ${this.type}`;
    }
  }

  get isSubmitDisabled(): boolean {
    let result = true;
    switch (this.type) {
      case ShareByType.ADJUSTMENT:
        result = this.totalContributorsValue > this.data.expenseValue;
        break;
      case ShareByType.UNEQUAL:
        result = this.totalContributorsValue !== this.data.expenseValue;
        break;
      case ShareByType.PERCENTAGE:
        result = this.totalContributorsValue !== 100;
        break;
      case ShareByType.SHARES:
        // contributorsControl.invalid is just enough
        result = false;
        break;
      default:
        result = true;
    }

    return this.contributorsControl.invalid || result;
  }

  get totalContributorsValue(): number {
    return Number(this.contributorsControl.value.reduce((a: number, b: number) => a + b, 0).toFixed(2));
  }

  getDefaultValue(type: ShareByType): number {
    switch (type) {
      case ShareByType.SHARES:
        return 1;
      default:
        return 0;
    }
  }

  getContributorControl(index: number): FormControl {
    return this.contributorsControl.at(index) as FormControl;
  }

  onSubmit(): void {
    const data: ExtendedExpenseContributor[] = this.data.contributors.map((contr: ExtendedExpenseContributor, idx) => ({
      ...contr,
      spent: this.getContributorControl(idx).value,
    }));
    this.dialogRef.close(data);
  }
}
