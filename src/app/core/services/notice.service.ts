import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notice {
  title: string;
  description: string;
  tag: 'Urgent' | 'Event' | 'Reminder';
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
    private notices: Notice[] = [];

    private noticesSubject = new BehaviorSubject<Notice[]>(this.notices);
    notices$ = this.noticesSubject.asObservable();

    constructor() {}

    getNotices() {
        return this.noticesSubject.value;
    }

    addNotice(notice: Notice) {
        this.notices.unshift(notice);
        this.noticesSubject.next(this.notices);
    }

    updateNotice(index: number, notice: Notice) {
        this.notices[index] = notice;
        this.noticesSubject.next(this.notices);
    }

    deleteNotice(index: number) {
        this.notices.splice(index, 1);
        this.noticesSubject.next(this.notices);
    }
}