import { NgFor } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'app-timetable',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgFor
  ],
  templateUrl: './timetable.html',
  styleUrl: './timetable.scss'
})
export class Timetable implements OnInit {
  @ViewChild('timetableGrid', { static: false }) timetableGrid!: ElementRef;

  selectedClass = 'JSS 1';
  classes: any[] = [];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  periods: string[] = Array.from({ length: 5 }, (_, i) => `${i + 1}`);

  timetable: { [key: string]: string } = {};

  constructor(
    private dialog: MatDialog,
    private classService: ClassService,
    private auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClasses();
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

  addPeriod() {
    const nextPeriod = `${this.periods.length + 1}`;
    this.periods.push(nextPeriod);
  }

  removeLastPeriod() {
    if (this.periods.length > 1) {
      this.periods.pop();
    }
  }

  editCell(day: string, period: string) {
    const key = `${day}_${period}`;
    const currentValue = this.timetable[key];

    const dialogRef = this.dialog.open(TimetableModal, {
      width: '400px',
      data: this.parseCellData(currentValue)
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.timetable[key] = `${result.subject} - ${result.teacher}`;
      }
    });
  }

  parseCellData(value: string | undefined) {
    if (!value) return {};
    const [subject, teacher] = value.split(' - ');
    return { subject, teacher };
  }

  async exportToPDF() {
    const canvas = await html2canvas(this.timetableGrid.nativeElement);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('landscape', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
    pdf.save(`${this.selectedClass}-timetable.pdf`);
  }

  exportToExcel() {
    const rows = [
      ['Day / Period', ...this.periods],
      ...this.days.map(day => [
        day,
        ...this.periods.map(period => this.timetable[`${day}_${period}`] || '')
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    saveAs(new Blob([excelBuffer]), `${this.selectedClass}-timetable.xlsx`);
  }
}
