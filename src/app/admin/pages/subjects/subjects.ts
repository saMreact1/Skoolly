import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SubjectModal } from '../../components/modals/subject-modal/subject-modal';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Subject } from '../../../core/models/subject.model';
import { SubjectService } from '../../../core/services/subject.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-subjects',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    NgIf,
    MatFormFieldModule,
    MatMenuModule,
  ],
  templateUrl: './subjects.html',
  styleUrl: './subjects.scss'
})
export class Subjects implements OnInit {
  // subjects: Subject[] = [];
  columnsToDisplay = ['name', 'class', 'teacher', 'actions'];
  dataSource = new MatTableDataSource<any>([])

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private subject: SubjectService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    // this.loadSubjects();

    this.dataSource.data = [
      { name: 'Mathematics', class: 'JSS1', teacher: 'Mr. Dada' },
      { name: 'English', class: 'JSS1', teacher: 'Ms. Florence' }
    ];
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // loadSubjects() {
  //   this.subject.getSubjects().subscribe({
  //     next: (data: Subject[]) => {
  //       this.subjects = data;
  //     },
  //     error: (err) => {
  //       console.error('Error loading subjects', err);
  //       this.snack.open('Failed to load subjects', 'Close', {
  //         duration: 3000,
  //       });
  //     }
  //   });
  // }

  // openAddSubjectModal() {
  //   const dialogRef = this.dialog.open(SubjectModal, { width: '400px' });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.subject.addSubject(result).subscribe(newSubj => {
  //         this.subjects.push(newSubj);
  //       })
  //     }
  //   });
  // }
  openAddSubjectModal() {
    const dialogRef = this.dialog.open(SubjectModal, { width: '400px' });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result];
      }
    });
  }

  // editSubject(subject: Subject) {
  //   const dialogRef = this.dialog.open(SubjectModal, {
  //     width: '400px',
  //     data: {...subject}
  //   });

  //   dialogRef.afterClosed().subscribe(updated => {
  //     if (updated && updated._id) {
  //       this.subject.updateSubject(updated._id, updated).subscribe(res => {
  //         const index = this.subjects.findIndex(s => s._id === subject._id)
  //       })
  //     };
  //   });
  // }
  editSubject(subject: any) {
    const dialogRef = this.dialog.open(SubjectModal, {
      width: '400px',
      data: subject
    });

    dialogRef.afterClosed().subscribe(updated => {
      if (updated) {
        const index = this.dataSource.data.indexOf(subject);
        const updatedData = [...this.dataSource.data];
        updatedData[index] = updated;
        this.dataSource.data = updatedData;
      }
    });
  }

  // deleteSubject(subject: Subject) {
  //   if (subject._id) {
  //     const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
  //       width: '350px',
  //       data: {
  //         title: 'Delete Class',
  //         message: 'Are you sure you want to delete this subject?'
  //       }
  //     });
  
  //     confirmDialog.afterClosed().subscribe(result => {
  //       if (result) {
  //         this.subject.deleteSubject(result).subscribe(() => {
  //           this.subjects = this.subjects.filter(s => s._id !== subject._id);
  //         })
  //         this.snack.open('Class deleted', 'Close', { duration: 3000 });
  //       }
  //     });
  //   }
  // }
  deleteSubject(subject: any) {
    this.dataSource.data = this.dataSource.data.filter(s => s !== subject);
  }
}
