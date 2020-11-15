import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.registerForm = fb.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  onSignUp(): void {
    if (this.registerForm.valid) {
      this.auth.signUp(this.registerForm.value);
    }
  }

  get username(): FormControl {
    return this.registerForm.controls.username as FormControl;
  }

  get email(): FormControl {
    return this.registerForm.controls.email as FormControl;
  }

  get password(): FormControl {
    return this.registerForm.controls.password as FormControl;
  }
}
