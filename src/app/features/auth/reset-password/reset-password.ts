import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatInputModule,
    MatButtonModule,
    NgIf
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword implements OnInit {
  resetForm!: FormGroup;
  token!: string;
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
      this.token = this.route.snapshot.queryParamMap.get('token') || '';
      this.resetForm = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(7)]]
      })
  }

  onSubmit() {
    if(this.resetForm.invalid) return;

    this.auth.resetPassword(this.token, this.resetForm.value.newPassword).subscribe({
      next: () => {
        this.message = 'Password successfully reset. Redirecting...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err) => {
        this.message = err.error.message || 'Error resetting password';
      }
    })
  }
}
