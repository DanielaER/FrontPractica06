import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8000/DAPP01Practica05-0.0.1-SNAPSHOT/api/v1/employees'; 

  //private apiUrl = 'http://172.23.0.3:80/DAPP01Practica05-0.0.1-SNAPSHOT/api/v1/employees'; 
  constructor(private http: HttpClient, private authService: AuthService) {}

  getHttpOptions() {const credentials = this.authService.getCredentials();
    if (credentials) {
      // Encode credentials to Base64
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
   
   
    const token = this.authService.getCredentials();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedCredentials}`
      })
    };
  }else{
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        
      })
    };
  }
  }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl, this.getHttpOptions());
  }

  getEmployee(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee, this.getHttpOptions());
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.apiUrl}/${employee.key}`, employee, this.getHttpOptions());
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions());
  }
}