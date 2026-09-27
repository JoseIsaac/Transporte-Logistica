import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Sistema de Logística';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ✅ Nombre completo en VERDE
  get nombreCompleto(): string {
    const usuario = this.authService.getUsuario();
    return usuario?.nombreCompleto || 'Usuario';
  }

  // ✅ Rol del usuario (texto directo)
  get rolUsuario(): string {
    const usuario = this.authService.getUsuario();
    return usuario?.rol || 'Perfil';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}