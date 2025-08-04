import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddClassModal } from '../../components/modals/add-class-modal/add-class-modal';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-classes',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatOptionModule,
    NgIf,
    MatSelectModule
  ],
  templateUrl: './classes.html',
  styleUrl: './classes.scss'
})
export class Classes {
  classes: any[] = [
    // {
    //   level: 'JSS 1',
    //   teacher: 'Mr. Adewale',
    //   students: ['Ayo', 'Chisom', 'Fatima', 'John']
    // },
    // {
    //   level: 'SS 2',
    //   teacher: 'Mrs. Chioma',
    //   students: ['Tega', 'Zainab']
    // }
  ];

  availableTeachers = ['Mr. Adewale', 'Mrs. Chioma', 'Ms. Fatima', 'Mr. Obi'];

  editingIndex: number | null = null;

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  updateTeacher(index: number, newTeacher: string) {
    this.classes[index].teacher = newTeacher;
    this.editingIndex = null;
    this.snack.open('Teacher updated', 'Close', { duration: 3000 });
  }

  openAddClassModal() {
    const dialogRef = this.dialog.open(AddClassModal, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((newClass) => {
      if (newClass) {
        this.classes.unshift(newClass);
      }
    });
  }
}
