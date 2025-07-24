import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-auth',
  imports: [
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatStepperModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCardModule,
    NgIf,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss'
})
export class Auth implements OnInit {
  isLogin: boolean = true;
  isLinear: boolean = true;
  step: number = 0;

  basicInfoForm!: FormGroup;
  schoolInfoForm!: FormGroup;
  personalInfoForm!: FormGroup;
  loginForm!: FormGroup;

  schoolExists: boolean = false;
  emailExists: boolean = false;

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

    this.basicInfoForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      schoolName: ['', Validators.required]
    });

    this.schoolInfoForm = this.fb.group({
      address: ['', Validators.required],
      schoolType: [[], Validators.required],
      state: ['', Validators.required]
    });

    this.personalInfoForm = this.fb.group({
      fullName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^\\d{11}$')]],
      gender: ['', Validators.required],
      bio: [''],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(7)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    return group.get('password')?.value === group.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  goToNextStep() {
    const { email, schoolName } = this.basicInfoForm.value;
    this.auth.checkSchoolAndEmail(email, schoolName).subscribe({
      next: (res: any) => {
        this.emailExists = res.emailExists;
        this.schoolExists = res.schoolExists;

        if(this.emailExists) {
          this.snack.open('Email already exists', '', { 
            duration: 3000,
            panelClass: ['white-bg-snack']
          });
        } else {
          this.step++;
        }
      },
      error: () => {
        this.snack.open('Error checking email/school', '', { 
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  onLogin() {
    const email = (document.querySelector('input[type="email"]') as HTMLInputElement)?.value;
    const password = (document.querySelector('input[type="password"]') as HTMLInputElement)?.value;

    this.auth.login({ email, password }).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        this.snack.open('Login successful!', '', { 
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
        const role = res.user.role;

        this.router.navigate([`/${role}`]);
      },
      error: () => {
        this.snack.open('Invalid credentials', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  onRegister() {
    if (this.personalInfoForm.invalid) return;

    const payload = {
      email: this.basicInfoForm.value.email,
      schoolName: this.basicInfoForm.value.schoolName,
      address: this.schoolInfoForm.value.address,
      state: this.schoolInfoForm.value.state,
      schoolType: this.schoolInfoForm.value.schoolType,
      fullName: this.personalInfoForm.value.fullName,
      phone: this.personalInfoForm.value.phone,
      gender: this.personalInfoForm.value.gender,
      bio: this.personalInfoForm.value.bio,
      role: this.personalInfoForm.value.role,
      password: this.personalInfoForm.value.password,
      confirmPassword: this.personalInfoForm.value.confirmPassword,
      schoolInfo: this.schoolExists ? null : this.schoolInfoForm.value
    };

    this.auth.register(payload).subscribe({
      next: () => {
        console.log('Registration Payload:', payload);

        this.snack.open('Registered successfully!', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
        this.isLogin = true;

        this.basicInfoForm.reset();
        this.schoolInfoForm.reset();
        this.personalInfoForm.reset();
        this.step = 0; // Optional: go back to first step
      },
      error: err => {
        this.snack.open(err.error.message || 'Registration failed.', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }
}
