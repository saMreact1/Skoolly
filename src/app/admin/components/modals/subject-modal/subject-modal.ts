import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subject } from '../../../../core/models/subject.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClassModel, ClassService } from '../../../../core/services/class.service';
import { MatSelectModule } from '@angular/material/select';
import { TeacherService } from '../../../../core/services/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-subject-modal',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgFor,
    NgIf
  ],
  templateUrl: './subject-modal.html',
  styleUrl: './subject-modal.scss'
})
export class SubjectModal implements OnInit {
  form: FormGroup;
  classes: ClassModel[] = [];
  teachers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SubjectModal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private classService: ClassService,
    private teacher: TeacherService,
    private snack: MatSnackBar,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      class: [data?.class || '', Validators.required],
      teacher: [data?.teacher || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadClasses();
    this.loadTeachers();
  }

  loadClasses() {
    const tenantId = this.auth.getTenantId();
    if (!tenantId) {
      console.warn('Tenant ID is missing. Cannot load classes.');
      return;
    }

    this.classService.getClassesByTenant(tenantId).subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: () => {
        this.snack.open('Could not fetch classes for this school.', '', {
          duration: 3000,
          panelClass: ['white-bg-snack']
        });
      }
    });
  }

  loadTeachers() {
    this.teacher.getTeachers().subscribe(t => this.teachers = t);
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
