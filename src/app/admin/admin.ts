import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
  collapsed: boolean = false;
  user: any;

  constructor(
    private router: Router
  ) {}

  toggleSidebar() {
    this.collapsed = !this.collapsed
  }

  goToSettings() {
    this.router.navigate(['/admin/profile'])
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
