import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ViajeDTO } from '../models/viaje.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ViajeService {
  private readonly apiUrl = 'http://localhost:8080/api/viajes';

  constructor(private http: HttpClient) {}

  obtenerTodos(): Observable<ViajeDTO[]> {
    return this.http.get<ViajeDTO[]>(this.apiUrl);
  }

  crear(viaje: ViajeDTO): Observable<ViajeDTO> {
    return this.http.post<ViajeDTO>(this.apiUrl, viaje);
  }

  cambiarEstado(
  id: number, 
  nuevoEstado: string,
  observaciones?: string
): Observable<ViajeDTO> {
  return this.http.patch<ViajeDTO>(`${this.apiUrl}/${id}/estado`, {
    nuevoEstado,
    observaciones,
    idUsuario: 1 // ✅ Reemplaza con el ID real del usuario autenticado
  });
}
}