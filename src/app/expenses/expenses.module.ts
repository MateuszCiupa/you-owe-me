import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { ExpensesComponent } from './expenses.component';
import { SharedModule } from '../shared/shared.module';
import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
import { CreateExpenseComponent } from './create-expense/create-expense.component';
import { PaidByDialogComponent } from './create-expense/paid-by-dialog/paid-by-dialog.component';
import { ShareByDialogComponent } from './create-expense/share-by-dialog/share-by-dialog.component';

@NgModule({
  declarations: [
    ExpensesComponent,
    ExpenseDetailsComponent,
    CreateExpenseComponent,
    PaidByDialogComponent,
    ShareByDialogComponent,
  ],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    MatCardModule,
    SharedModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDividerModule,
    MatListModule,
    MatTooltipModule,
  ],
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class ExpensesModule {}
