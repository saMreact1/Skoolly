import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { Notice, NoticeService } from '../../../../core/services/notice.service';
import { DatePipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-notice-board',
  imports: [
    MatCardModule,
    DatePipe,
    NgFor
  ],
  templateUrl: './notice-board.html',
  styleUrl: './notice-board.scss'
})
export class NoticeBoard {
  notices: Notice[] = [];

  constructor(
    private dialog: MatDialog,
    private notice: NoticeService
  ) {}

  ngOnInit() {
    this.notice.notices$.subscribe((data) => {
      this.notices = data;
    });
  }

  // addNotice() {
  //   const dialogRef = this.dialog.open(CreateNoticeModalComponent, {
  //     width: '400px'
  //   });

  //   dialogRef.afterClosed().subscribe((newNotice) => {
  //     if (newNotice) {
  //       this.notices.unshift({
  //         ...newNotice,
  //         date: new Date().toISOString()
  //       });
  //     }
  //   });
  // }
}
