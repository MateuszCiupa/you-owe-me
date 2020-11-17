import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';

import { ShareByDialogComponent } from './share-by-dialog.component';

describe('ShareByDialogComponent', () => {
  let component: ShareByDialogComponent;
  let fixture: ComponentFixture<ShareByDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatListModule, MatFormFieldModule, MatButtonModule, ReactiveFormsModule],
      declarations: [ShareByDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { contributors: [] } },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareByDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
