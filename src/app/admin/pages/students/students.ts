import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { AddStudentModal } from '../../components/modals/add-student-modal/add-student-modal';
import { ViewStudentModal } from '../../components/modals/view-student-modal/view-student-modal';

@Component({
  selector: 'app-students',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './students.html',
  styleUrl: './students.scss'
})
export class Students {
  searchTerm = '';

  columns: string[] = ['name', 'class', 'gender', 'email', 'actions'];

  students = [
    { name: 'Adeola Yusuf', class: 'Pry 1', gender: 'Male', email: 'adeola@skoolly.com' },
    { name: 'Sarah Bello', class: 'Pry 2', gender: 'Female', email: 'sarah@skoolly.com' },
    { name: 'David Obi', class: 'Pry 3', gender: 'Male', email: 'david@skoolly.com' }
  ];

  constructor(private dialog: MatDialog) {}

  openAddStudentModal() {
    const dialogRef = this.dialog.open(AddStudentModal, {
      width: '400px',
      panelClass: 'custom-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.students.push(result); // Local update for now
      }
    });
  }

  viewStudent(student: any) {
    this.dialog.open(ViewStudentModal, {
      width: '100%',
      maxWidth: '600px',
      data: student,
      panelClass: 'responsive-modal'
    });
  }

  filteredStudents() {
    if (!this.searchTerm) return this.students;

    const term = this.searchTerm.toLowerCase();

    return this.students.filter(student =>
      student.name.toLowerCase().includes(term) ||
      student.class.toLowerCase().includes(term) ||
      student.gender.toLowerCase().includes(term)
    );
  }

}
