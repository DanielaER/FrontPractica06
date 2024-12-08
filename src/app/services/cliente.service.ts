import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private baseUrl = 'http://localhost:8080/api/v1/clientes';

  constructor(private http: HttpClient) {}

  getAllClientes(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  saveCliente(cliente: Cliente): Observable<any> {
    return this.http.post<any>(this.baseUrl, cliente, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateCliente(id: number, cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, cliente, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  getDireccionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}/direccion`);
  }

  existsById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/exists/${id}`);
  }
}