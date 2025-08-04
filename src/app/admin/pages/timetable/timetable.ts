import { NgFor } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { TimetableModal } from '../../components/modals/timetable-modal/timetable-modal';

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
export class Timetable {
  @ViewChild('timetableGrid', { static: false}) timetableGrid!: ElementRef;

  selectedClass = 'JSS 1';
  classes = ['JSS 1', 'JSS 2', 'SSS 1', 'SSS 2'];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  periods: string[] = Array.from({ length: 5 }, (_, i) => `${i + 1}`);


  timetable: { [key: string]: string } = {};

  constructor(private dialog: MatDialog) {}

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
    const key = day + '_' + period;
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

  exportToPDF() {
    html2canvas(this.timetableGrid.nativeElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`${this.selectedClass}-timetable.pdf`);
    });
  }

  exportToExcel() {
    const rows = [];

    const headerRow = ['Day / Period', ...this.periods];
    rows.push(headerRow);

    this.days.forEach(day => {
      const row = [day];
      this.periods.forEach(period => {
        const key = day + '_' + period;
        row.push(this.timetable[key] || '');
      });
      rows.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    FileSaver.saveAs(new Blob([excelBuffer]), `${this.selectedClass}-timetable.xlsx`);
  }
}
