import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from 'src/app/models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private baseUrl = 'http://localhost:8080/api/v1/productos';

  constructor(private http: HttpClient) {}

  getAllProductos(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getProductoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  saveProducto(producto: Producto): Observable<any> {
    return this.http.post<any>(this.baseUrl, producto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateProducto(id: number, producto: Producto): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, producto, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}