import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';
import { CreateNoticeModal } from '../../components/modals/create-notice-modal/create-notice-modal';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { NoticeService } from '../../../core/services/notice.service';

export interface Notice {
  title: string;
  description: string;
  tag: string;
  date: Date;
  _id?: string;
}

@Component({
  selector: 'app-notices',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    NgClass,
    NgFor,
    NgIf,
    DatePipe
  ],
  templateUrl: './notices.html',
  styleUrl: './notices.scss'
})
export class Notices {
  notices: Notice[] = [];

  constructor(
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private notice: NoticeService
  ) {}

  ngOnInit() {
    this.notice.notices$.subscribe((data) => {
      // this.notices = data;
    });
  }

  addNotice() {
    const dialogRef = this.dialog.open(CreateNoticeModal, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((newNotice) => {
      if (newNotice) {
        const noticeToAdd = {
          ...newNotice,
          date: new Date().toISOString()
        };
        this.notice.addNotice(noticeToAdd);
        this.snack.open('Notice added', 'Close', { duration: 3000 });
      }
    });
  }

  onNoticeUpdated(index: number) {
    const updated = this.notices[index];
    // this.notice.updateNotice(index, updated);
    this.snack.open('Notice updated', 'Close', { duration: 3000 });
  }

  confirmDeleteNotice(index: number) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Notice',
        message: 'Are you sure you want to delete this notice?'
      }
    });

    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.notice.deleteNotice(index);
        this.snack.open('Notice deleted', 'Close', { duration: 3000 });
      }
    });
  }
}
