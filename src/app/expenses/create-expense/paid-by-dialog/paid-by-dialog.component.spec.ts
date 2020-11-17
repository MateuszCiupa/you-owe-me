import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PaidByDialogComponent } from './paid-by-dialog.component';

describe('PaidByDialogComponent', () => {
  let component: PaidByDialogComponent;
  let fixture: ComponentFixture<PaidByDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatListModule,
        MatFormFieldModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatTooltipModule,
      ],
      declarations: [PaidByDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { contributors: [] } },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidByDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
