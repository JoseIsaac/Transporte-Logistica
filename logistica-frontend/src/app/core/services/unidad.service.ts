import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Unidad, UnidadPanelDTO, ResumenSemaforo, CambioSemaforoDTO } from '../models/unidad.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UnidadService {
  private readonly apiUrl = 'http://localhost:8080/api/unidades';

  constructor(private http: HttpClient) {}

  // ✅ Datos del panel con origen, destino y estado de viaje
  obtenerPanel(): Observable<UnidadPanelDTO[]> {
    return this.http.get<UnidadPanelDTO[]>(`${this.apiUrl}/panel`);
  }

  // ✅ Resumen del semáforo (conteo superior)
  obtenerResumenSemaforo(): Observable<ResumenSemaforo> {
    return this.http.get<ResumenSemaforo>(`${this.apiUrl}/resumen`);
  }

  // ✅ Lista completa de unidades
  obtenerTodas(): Observable<Unidad[]> {
    return this.http.get<Unidad[]>(this.apiUrl);
  }

  // ✅ Cambio de estado del semáforo
  cambiarSemaforo(idUnidad: number, dto: CambioSemaforoDTO): Observable<Unidad> {
    return this.http.put<Unidad>(`${this.apiUrl}/semaforo/unidad/${idUnidad}`, dto);
  }
}