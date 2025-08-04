import { NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ViewTeacherModal } from '../../components/modals/view-teacher-modal/view-teacher-modal';
import { AddTeacherModal } from '../../components/modals/add-teacher-modal/add-teacher-modal';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-teachers',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    NgIf
  ],
  templateUrl: './teachers.html',
  styleUrl: './teachers.scss'
})
export class Teachers {
  searchTerm = '';

  columns: string[] = ['name', 'subject', 'email', 'actions'];

  teachers = [
    { name: 'Samuel Adeleke', subject: 'Math', email: 'sam@skoolly.com' },
    { name: 'Iziren Adedoyin', subject: 'Biology', email: 'doyin@skoolly.com' },
    { name: 'John Smith', subject: 'English', email: 'john@skoolly.com' }
  ];

  constructor(
    private dialog: MatDialog
  ) {}

  filteredTeachers() {
    if(!this.searchTerm) return this.teachers;
    return this.teachers.filter(t => 
      t.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openAddTeacherModal() {
    const dialogRef = this.dialog.open(AddTeacherModal, {
      width: '400px',
      panelClass: 'custom-modal'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teachers.push(result); // TEMP: Update local array
      }
    });
  }

  viewTeacher(teacher: any) {
    this.dialog.open(ViewTeacherModal, {
      width: '400px',
      data: teacher,
      panelClass: 'custom-modal'
    });
  }
}
