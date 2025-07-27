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
    NgIf
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  overview: AdminOverview | any;

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

  classData = {
    series: [
      {
        name: 'No. of Students',
        data: [5, 10, 25, 30, 22, 27, 18]
      }
    ],
    categories: ['Nur 1', 'Nur 2', 'Pry 1', 'Pry 2', 'Pry 3', 'Pry 4', 'Pry 5']
  }

  constructor(
    private admin: AdminService
  ) {}

  ngOnInit(): void {
      this.admin.getOverview().subscribe({
        next: (res) => {
          console.log('Dashboard data:', res);
          this.overview = res;
        },
        error: (err) => console.error('Error loading overview', err)
      })
  }
}
