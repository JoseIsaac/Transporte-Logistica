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
      this.usuarioSubject.next(JSON.parse(guardado));
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

  getUsuario(): RespuestaAuthDTO | null {
    const datos = localStorage.getItem(this.STORAGE_KEY);
    return datos ? JSON.parse(datos) : null;
  }

  getToken(): string | null {
    return this.usuarioSubject.value?.token || null;
  }

  estaAutenticado(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.usuarioSubject.next(null);
  }
}