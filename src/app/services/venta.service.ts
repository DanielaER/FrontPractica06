import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from 'src/app/models/venta.model';  // Importamos el modelo Venta
import { DetalleVenta } from '../models/detalle-venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private baseUrl = 'http://localhost:8080/api/v1/ventas';  // URL base para las ventas

  constructor(private http: HttpClient) {}

  // Obtener todas las ventas
  getAllVentas(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // Obtener venta por ID
  getVentaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  // Guardar una nueva venta
  saveVenta(data: { venta: Venta, detalles: DetalleVenta[] }): Observable<any> {
    return this.http.post<any>(this.baseUrl, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  
  //DESCARGAR PDF
  downloadVentaReport(idVenta: number): Observable<Blob> {
    const url = `${this.baseUrl}/download-report/${idVenta}`;
    return this.http.get(url, { responseType: 'blob' }); // Indicamos que la respuesta será un archivo binario (PDF)
  }
  // Enviar Mail
  sendVenta(id: number): Observable<any> {
    console.log('Enviando venta al servidor');
    console.log(id);
    return this.http.get<any>(`${this.baseUrl}/send-report/${id}`);
  }
}
