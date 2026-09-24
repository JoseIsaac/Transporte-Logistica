import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 🔐 Pública
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },

  // 📋 Protegidas — requieren sesión
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
  { 
    path: 'usuarios', 
    loadComponent: () => import('./pages/usuarios/usuarios.component').then(m => m.UsuariosComponent),
    canActivate: [AuthGuard]
  },

  // 🏠 Redirección base
  { path: '', redirectTo: '/panel', pathMatch: 'full' },
  { path: '**', redirectTo: '/panel' }
];