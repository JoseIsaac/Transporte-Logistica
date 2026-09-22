import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginDTO, RespuestaAuthDTO } from '../models/auth.model';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly STORAGE_KEY = 'auth_data';
  
  private usuarioSubject = new BehaviorSubject<RespuestaAuthDTO | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    const guardado = localStorage.getItem(this.STORAGE_KEY);
    if (guardado) {
      const datos = JSON.parse(guardado) as RespuestaAuthDTO;
      this.usuarioSubject.next(datos);
    }
  }

  login(dto: LoginDTO) {
    return this.http.post<RespuestaAuthDTO>(`${this.apiUrl}/login`, dto).pipe(
      map(resp => {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resp));
        this.usuarioSubject.next(resp);
        return resp;
      })
    );
  }

  logout() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.usuarioSubject.next(null);
  }

  getToken(): string | null {
    const datos = this.usuarioSubject.value;
    return datos ? datos.token : null;
  }

  getUsuario(): RespuestaAuthDTO | null {
    return this.usuarioSubject.value;
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }
}