import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../core/services/auth.service';
import { ExpenseService } from '../core/services/expense.service';
import { FriendService } from '../core/services/friend.service';
import { authServiceMock } from '../mocks/auth-mock.service';
import { expenseServiceMock } from '../mocks/expense-mock.service';
import { friendServiceMock } from '../mocks/friend-mock.service';
import { ExpensesComponent } from './expenses.component';

describe('ExpensesComponent', () => {
  let component: ExpensesComponent;
  let fixture: ComponentFixture<ExpensesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatCardModule, MatExpansionModule, MatListModule, MatSnackBarModule, MatIconModule, MatPaginatorModule],
      declarations: [ExpensesComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ExpenseService, useValue: expenseServiceMock },
        { provide: FriendService, useValue: friendServiceMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
