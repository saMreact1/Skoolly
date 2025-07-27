import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClassModel {
  _id?: string;
  name: string;
  tenantId?: string;
  schoolName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassService {
    private apiUrl = 'http://localhost:5000/classes';

    constructor(private http: HttpClient) {}

    // 🔹 Get all classes for logged-in user (protected route)
    getClasses(): Observable<ClassModel[]> {
        return this.http.get<ClassModel[]>(this.apiUrl);
    }

    // 🔹 Create a new class
    createClass(newClass: ClassModel): Observable<ClassModel> {
        return this.http.post<ClassModel>(this.apiUrl, newClass);
    }

  // 🔹 Get classes by school name (public route)
    getClassesByTenant(tenantId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/tenant/${tenantId}`);
    }
}
