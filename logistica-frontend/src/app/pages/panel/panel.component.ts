import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface ResumenPanel {
  vehiculosActivos: number;
  rutasActivas: number;
  entregasHoy: number;
  incidencias: number;
  variacionVehiculos: string;
  variacionRutas: string;
  variacionEntregas: string;
  variacionIncidencias: string;
}

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  cargando = true;

  datos: ResumenPanel = {
    vehiculosActivos: 0,
    rutasActivas: 0,
    entregasHoy: 0,
    incidencias: 0,
    variacionVehiculos: '',
    variacionRutas: '',
    variacionEntregas: '',
    variacionIncidencias: ''
  };

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef // 🔑 Forzamos la actualización de la vista
  ) {}

  ngOnInit(): void {
    this.cargarDatosBackend();
  }

  cargarDatosBackend(): void {
    this.cargando = true;

    const url = 'http://localhost:8080/api/panel/resumen';

    this.http.get<ResumenPanel>(url).subscribe({
      next: (respuesta) => {
        console.log('✅ Datos recibidos:', respuesta);
        
        // Asignación directa de cada campo
        this.datos.vehiculosActivos = respuesta.vehiculosActivos;
        this.datos.rutasActivas = respuesta.rutasActivas;
        this.datos.entregasHoy = respuesta.entregasHoy;
        this.datos.incidencias = respuesta.incidencias;
        this.datos.variacionVehiculos = respuesta.variacionVehiculos;
        this.datos.variacionRutas = respuesta.variacionRutas;
        this.datos.variacionEntregas = respuesta.variacionEntregas;
        this.datos.variacionIncidencias = respuesta.variacionIncidencias;

        this.cargando = false;
        
        // 🔑 Obliga a Angular a refrescar la vista INMEDIATAMENTE
        this.cdr.markForCheck();
        this.cdr.detectChanges();
        
        console.log('✅ Carga finalizada — cargando =', this.cargando);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        // Datos de respaldo
        this.datos = {
          vehiculosActivos: 24,
          rutasActivas: 12,
          entregasHoy: 47,
          incidencias: 2,
          variacionVehiculos: '+3 este mes',
          variacionRutas: 'Estables',
          variacionEntregas: '+12 vs ayer',
          variacionIncidencias: '-2 esta semana'
        };
        this.cargando = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }
}