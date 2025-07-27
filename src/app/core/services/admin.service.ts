// src/app/admin/services/admin.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5000/admin';

  constructor(private http: HttpClient) {}

  getOverview(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard`);
  }
}
