import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioDTO, CambiarContrasenaDTO } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  // ✅ URL CORRECTA y verificada
  private readonly apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {
    console.log('✅ UsuarioService inicializado — URL:', this.apiUrl);
  }

  obtenerTodos(): Observable<UsuarioDTO[]> {
    console.log('📞 Llamando a obtenerTodos() →', this.apiUrl);
    return this.http.get<UsuarioDTO[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<UsuarioDTO> {
    return this.http.get<UsuarioDTO>(`${this.apiUrl}/${id}`);
  }

  crear(datos: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.post<UsuarioDTO>(this.apiUrl, datos);
  }

  actualizar(id: number, datos: UsuarioDTO): Observable<UsuarioDTO> {
    return this.http.put<UsuarioDTO>(`${this.apiUrl}/${id}`, datos);
  }

  cambiarEstado(id: number): Observable<UsuarioDTO> {
    return this.http.patch<UsuarioDTO>(`${this.apiUrl}/${id}/estado`, {});
  }

  cambiarContrasena(id: number, datos: {
    contrasenaActual: string;
    nuevaContrasena: string;
  }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/contrasena`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}