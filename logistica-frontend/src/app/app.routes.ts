import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

// ✅ IMPORTANTE: La línea de Usuarios ya la tienes arriba, se mantiene
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

export const routes: Routes = [
  // 🔐 RUTA PÚBLICA — Login (sin sesión)
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },

  // 📋 RUTAS PROTEGIDAS — Requieren iniciar sesión
  { 
    path: 'panel', 
    loadComponent: () => import('./pages/panel/panel.component').then(m => m.PanelComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'unidades', 
    loadComponent: () => import('./pages/unidades/unidades.component').then(m => m.UnidadesComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'rutas', 
    loadComponent: () => import('./pages/rutas/rutas.component').then(m => m.RutasComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'operadores', 
    loadComponent: () => import('./pages/operadores/operadores.component').then(m => m.OperadoresComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'viajes', 
    loadComponent: () => import('./pages/viajes/viajes.component').then(m => m.ViajesComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'reportes', 
    loadComponent: () => import('./pages/reportes/reportes.component').then(m => m.ReportesComponent),
    canActivate: [AuthGuard]
  },

  // 👤 RUTA DE USUARIOS — Aquí la agregué, entre reportes y redirección
  { 
    path: 'usuarios', 
    loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent),
    canActivate: [AuthGuard]
  },

  // 🏠 REDIRECCIÓN — Si entras a la raíz, te lleva al panel
  { path: '', redirectTo: '/panel', pathMatch: 'full' },

 
];