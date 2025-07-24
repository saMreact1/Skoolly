import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  checkSchoolAndEmail(email: string, school: string) {
    return this.http.post(`${this.apiUrl}/check`, { email, school });
  }

  saveUser(user: any, token: string) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }

  logout() {
    localStorage.clear();
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
