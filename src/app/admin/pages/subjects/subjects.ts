import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubjectModal } from '../../components/modals/subject-modal/subject-modal';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-subjects',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    NgIf
  ],
  templateUrl: './subjects.html',
  styleUrl: './subjects.scss'
})
export class Subjects {
  subjects = [
    { name: 'Mathematics', class: 'JSS1', teacher: 'Mr. Dada' },
    { name: 'English', class: 'JSS1', teacher: 'Ms. Florence' },
  ];

  columnsToDisplay = ['name', 'class', 'teacher', 'actions'];

  constructor(private dialog: MatDialog) {}

  openAddSubjectModal() {
    const dialogRef = this.dialog.open(SubjectModal, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subjects.push(result); // you can call backend here instead
      }
    });
  }

  editSubject(subject: any) {
    const dialogRef = this.dialog.open(SubjectModal, {
      width: '400px',
      data: subject,
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        const index = this.subjects.indexOf(subject);
        this.subjects[index] = updated;
      }
    });
  }

  deleteSubject(subject: any) {
    // add confirm dialog here later
    this.subjects = this.subjects.filter(s => s !== subject);
  }
}
