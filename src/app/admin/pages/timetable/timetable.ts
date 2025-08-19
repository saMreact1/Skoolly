import { NgFor, NgIf } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { TimetableModal } from '../../components/modals/timetable-modal/timetable-modal';
import { ClassService } from '../../../core/services/class.service';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { TimetableService } from '../../../core/services/timetable.service';
import { SubjectService } from '../../../core/services/subject.service';
import { TimetableClass } from '../../../core/models/timetable.model';
import { Subject } from '../../../core/models/subject.model';

type Slot = { id?: string; subjectName: string; color: string; };
type Grid = Record<string, Slot[]>;


@Component({
  selector: 'app-timetable',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgFor,
    FormsModule,
    NgIf,
    MatDialogModule
  ],
  templateUrl: './timetable.html',
  styleUrl: './timetable.scss'
})
export class Timetable implements OnInit {
  classes: any[] = [];
  selectedClass: string = '';
  timetables: { [classId: string]: { [slotId: string]: TimetableClass[] } } = {};
  subjects: Subject[] = [];

  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  times = ['8-9am', '9-10am', '10-11am', '11-12pm', '12-1pm', '1-2pm'];

  grid: { [slotId: string]: TimetableClass[] } = {};

  constructor(
    private dialog: MatDialog,
    private classService: ClassService,
    private auth: AuthService,
    private snack: MatSnackBar,
    private timetableService: TimetableService,
    private subject: SubjectService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadSubjects();
  }

  private ensureGridSkeleton() {
    for (const d of this.days) {
      for (const t of this.times) {
        const k = this.key(d, t);
        if (!this.grid[k]) this.grid[k] = [];
      }
    }
  }

  key(day: string, time: string) {
    return `${day}-${time}`;
  }

  openSubjectSelector(day: string, time: string) {
    const dialogRef = this.dialog.open(TimetableModal, {
      width: '300px',
      data: { subjects: this.subjects }
    });

    dialogRef.afterClosed().subscribe((selected: Subject | null) => {
      if (selected) {
        const timetableClass: TimetableClass = {
          id: selected._id!,
          subjectName: selected.name ?? 'Unnamed',
          color: (selected as any).color ?? this.getRandomColor()
        };

        const key = this.key(day, time);
        this.grid[key] = [timetableClass];

        if (!this.timetables[this.selectedClass]) {
          this.initTimetableForClass(this.selectedClass);
        }
        this.timetables[this.selectedClass][key] = [timetableClass];

        this.saveTimetable();
      }
    });
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
        });
      }
    });
  }

  loadSubjects() {
    this.subject.getSubjects().subscribe((res: Subject[]) => {
      this.subjects = res.map(s => ({
        ...s,
        color: this.getRandomColor()
      }));
    });
  }

  getClasses(day: string, time: string) {
    return this.grid[this.key(day, time)] || [];
  }

  onClassChange() {
    if (!this.selectedClass) return;

    if (this.timetables[this.selectedClass]) {
      this.grid = { ...this.timetables[this.selectedClass] };
      this.ensureGridSkeleton();
      return;
    }

    this.timetableService.getTimetable(this.selectedClass).subscribe({
      next: (res: any) => {
        const fetchedGrid = res.data || {};
        this.timetables[this.selectedClass] = fetchedGrid;
        this.grid = { ...fetchedGrid };
        this.ensureGridSkeleton();
      },
      error: () => this.snack.open('Failed to load timetable.', '', { duration: 2500 })
    });
  }

  saveTimetable() {
    if (!this.selectedClass) {
      this.snack.open('Select a class first', '', { duration: 2000 });
      return;
    }
    this.timetableService.saveTimetable(this.selectedClass, this.grid).subscribe({
      next: () => this.snack.open('Timetable saved.', '', { duration: 2000 }),
      error: () => this.snack.open('Failed to save timetable.', '', { duration: 3000 })
    });
  }

  private getRandomColor(): string {
    const colors = ['#6c5ce7', '#00b894', '#0984e3', '#d63031', '#fdcb6e'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private initTimetableForClass(classId: string) {
    this.timetables[classId] = {};
    this.days.forEach(day => {
      this.times.forEach(time => {
        this.timetables[classId][`${day}-${time}`] = [];
      });
    });
  }
}