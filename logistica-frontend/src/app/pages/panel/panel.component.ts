import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnidadService } from '../../core/services/unidad.service';
import { UnidadPanelDTO, ResumenSemaforo } from '../../core/models/unidad.model';
import { SemaforoBadgeComponent } from '../../shared/semaforo-badge/semaforo-badge.component';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, SemaforoBadgeComponent],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css'
})
export class PanelComponent implements OnInit {
  unidades: UnidadPanelDTO[] = [];
  resumen!: ResumenSemaforo;
  cargando = true;

  constructor(private unidadService: UnidadService) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.unidadService.obtenerResumen().subscribe(res => this.resumen = res);
    this.unidadService.obtenerPanel().subscribe({
      next: datos => {
        this.unidades = datos;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }
}