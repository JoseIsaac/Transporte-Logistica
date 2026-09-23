import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})
export class PanelComponent implements OnInit {
  loading = true;
  
  vehiculosActivos = 0;
  rutasActivas = 0;
  entregasHoy = 0;
  incidencias = 0;

  ngOnInit(): void {
    console.log('✅ Iniciando carga...'); // Para depurar
    setTimeout(() => {
      this.vehiculosActivos = 24;
      this.rutasActivas = 12;
      this.entregasHoy = 47;
      this.incidencias = 2;
      this.loading = false;
      console.log('✅ Datos cargados, loading =', this.loading);
    }, 2000);
  }
}