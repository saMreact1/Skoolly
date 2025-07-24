import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    FormsModule,
    MatInputModule,
    RouterModule,
    MatCardModule,
    MatLabel,
    MatButtonModule,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword implements OnInit {
  forgotForm!: FormGroup;
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
      this.forgotForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      })
  }

  onSubmit() {
  if (this.forgotForm.invalid) return;

  this.auth.forgotPassword(this.forgotForm.value.email).subscribe({
    next: () => {
      this.message = 'Password reset link sent to your email';
    },
    error: (err) => {
      this.message = err.error?.message || 'Something went wrong';
    },
  });
}
}
