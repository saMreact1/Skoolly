import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChartWidget } from '../../components/widgets/chart-widget/chart-widget';
import { OverviewCard } from '../../components/widgets/overview-card/overview-card';
import { NoticeBoard } from '../../components/widgets/notice-board/notice-board';
import { AdminOverview } from '../../../core/models/overview.model';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    RouterModule,
    ChartWidget,
    OverviewCard,
    NoticeBoard,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  overview: AdminOverview | any;
  totalStudents = 0;
  totalTeachers = 0;
  attendanceToday = 0;

  attendanceData = {
    series: [
      {
        name: 'Attendance %',
        data: [80, 85, 78, 90, 88, 92, 86]
      }
    ],
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };

  populationData = {
    series: [120, 15],
    labels: ['Students', 'Teachers']
  };

  classData: any;

  constructor(
    private admin: AdminService
  ) {}

  ngOnInit(): void {
    this.admin.getOverview().subscribe({
      next: (data) => {
        this.totalStudents = data.totalStudents;
        this.totalTeachers = data.totalTeachers;
        this.attendanceToday = data.attendanceToday;
      },
      error: (err) => {
        console.error('Error fetching overview', err);
      }
    })

    this.admin.getClassCount().subscribe((res) => {
      this.classData = {
        series: [
          {
            name: 'Students',
            data: res.map((item: any) => item.count)  
          }
        ],
        categories: res.map((item: any, index: number) => `Item ${index + 1}`)
      }
    })
  }
}
