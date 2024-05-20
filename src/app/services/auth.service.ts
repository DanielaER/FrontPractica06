import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:8000/DAPP01Practica05-0.0.1-SNAPSHOT/api/v1/employees'; 

  //private authUrl = 'http://172.23.0.3:80/DAPP01Practica05-0.0.1-SNAPSHOT/api/v1/employees'; 
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const basicAuth = 'Basic ' + btoa(username + ':' + password);
    const headers = new HttpHeaders({ Authorization: basicAuth });
    console.log('Enviando petición de autenticación al servidor');
    

    return this.http.get<any>(this.authUrl, { headers }).pipe(
      tap(response => {
        console.log('Respuesta del servidor:', response);
        localStorage.setItem('credentials', btoa(username + ':' + password));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('credentials');
    
    localStorage.removeItem('token');
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCredentials(): { username: string, password: string } | null {
    const credentialsString = localStorage.getItem('credentials');
    if (credentialsString) {
      // Decodificar las credenciales y dividirlas en username y password
      const [username, password] = atob(credentialsString).split(':');
      return { username, password };
    }
    return null;
  }
}
