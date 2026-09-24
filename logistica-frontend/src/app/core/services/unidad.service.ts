// unidad.service.ts → TAL CUAL LO TIENES ✅
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Unidad, UnidadPanelDTO, ResumenSemaforo, CambioSemaforoDTO } from '../models/unidad.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UnidadService {
  private readonly apiUrl = 'http://localhost:8080/api/unidades';
  constructor(private http: HttpClient) {}

  obtenerPanel(): Observable<UnidadPanelDTO[]> {
    return this.http.get<UnidadPanelDTO[]>(`${this.apiUrl}/panel`);
  }

  obtenerResumenSemaforo(): Observable<ResumenSemaforo> {
    return this.http.get<ResumenSemaforo>(`${this.apiUrl}/resumen`);
  }

  obtenerTodas(): Observable<Unidad[]> {
    return this.http.get<Unidad[]>(this.apiUrl);
  }

  cambiarSemaforo(idUnidad: number, dto: CambioSemaforoDTO): Observable<Unidad> {
    return this.http.put<Unidad>(`${this.apiUrl}/semaforo/unidad/${idUnidad}`, dto);
  }
}