import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UnidadPanelDTO, ResumenSemaforo, CambioSemaforoDTO } from '../models/unidad.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UnidadService {
  private readonly apiUrl = 'http://localhost:8080/api/unidades';

  constructor(private http: HttpClient) { }

  // ✅ Para el panel
  obtenerPanel(): Observable<UnidadPanelDTO[]> {
    return this.http.get<UnidadPanelDTO[]>(`${this.apiUrl}/panel`);
  }

  // ✅ Para unidades.component.ts
  obtenerTodas(): Observable<UnidadPanelDTO[]> {
    return this.obtenerPanel();
  }

  // ✅ Resumen
  obtenerResumenSemaforo(): Observable<ResumenSemaforo> {
    return this.http.get<ResumenSemaforo>(`${this.apiUrl}/resumen`);
  }

  // ✅ Cambiar semáforo
  cambiarSemaforo(id: number, datos: CambioSemaforoDTO): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/semaforo`, datos);
  }
  // ✅ NUEVO — Crear unidad
  crearUnidad(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }

  // ✅ Actualizar unidad (solo campos permitidos)
  actualizarUnidad(datos: {
    idUnidad: number;
    placas: string;
    operadorAsignado?: string;
    estadoSemaforo: string;
    observacionesSemaforo?: string;
  }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${datos.idUnidad}`, datos);
  }
}

