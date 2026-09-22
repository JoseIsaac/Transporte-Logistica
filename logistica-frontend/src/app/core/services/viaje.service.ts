import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Viaje, ViajeDTO, CambioEstadoViajeDTO } from '../models/viaje.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViajeService {
  private readonly apiUrl = 'http://localhost:8080/api/viajes';

  constructor(private http: HttpClient) {}

  crear(dto: ViajeDTO): Observable<Viaje> {
    return this.http.post<Viaje>(this.apiUrl, dto);
  }

  cambiarEstado(idViaje: number, dto: CambioEstadoViajeDTO): Observable<Viaje> {
    return this.http.put<Viaje>(`${this.apiUrl}/${idViaje}/estado`, dto);
  }

  obtenerActivos(): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${this.apiUrl}/activos`);
  }

  obtenerPorUnidad(idUnidad: number): Observable<Viaje[]> {
    return this.http.get<Viaje[]>(`${this.apiUrl}/unidad/${idUnidad}`);
  }
}