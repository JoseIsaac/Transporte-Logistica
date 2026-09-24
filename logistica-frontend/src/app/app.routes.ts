import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { UnidadesComponent } from './pages/unidades/unidades.component';
import { PanelComponent } from './pages/panel/panel.component';


export const routes: Routes = [
  { path: '', component: PanelComponent },
  { path: 'unidades', component: UnidadesComponent },
  { path: '**', redirectTo: '' },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) 
  },
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
    path: 'viajes', 
    loadComponent: () => import('./pages/viajes/viajes.component').then(m => m.ViajesComponent),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/panel', pathMatch: 'full' },
  { path: '**', redirectTo: '/panel' }
];