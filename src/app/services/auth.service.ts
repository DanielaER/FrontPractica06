import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const loginRequest = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('Enviando petición de autenticación al servidor');
    
    return this.http.post<any>(`${this.baseUrl}/login`, loginRequest, { headers }).pipe(
      tap(response => {
        console.log('Respuesta del servidor:', response);
        localStorage.setItem('credentials', btoa(username + ':' + password));
        localStorage.setItem('role', response.data.roles); // Guardar el rol del usuario
        console.log(localStorage.getItem('role'));
        window.location.href = '/ventas';
      })
    );
  }

  logout(): void {
    localStorage.removeItem('credentials');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  window.location.href = '/login';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCredentials(): { username: string, password: string } | null {
    const credentialsString = localStorage.getItem('credentials');
    if (credentialsString) {
      const [username, password] = atob(credentialsString).split(':');
      return { username, password };
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('credentials');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  register(username: string, password: string, roles: string): Observable<any> {
    const registerRequest = { username, password, roles };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.baseUrl}/register`, registerRequest, { headers });
  }
}