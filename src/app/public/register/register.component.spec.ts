import { InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { RegisterComponent } from './register.component';
import { BrowserModule } from '@angular/platform-browser';
import { authServiceMock } from 'src/app/mocks/auth-mock.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [BrowserModule, ReactiveFormsModule],
      providers: [FormBuilder, { provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
