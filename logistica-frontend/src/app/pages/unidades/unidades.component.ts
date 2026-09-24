import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnidadService } from '../../core/services/unidad.service';
import { Unidad, EstadoSemaforo, EstadoViaje } from '../../core/models/unidad.model';
import { AuthService } from '../../core/services/auth.service';
import { SemaforoBadgeComponent } from '../../shared/semaforo-badge/semaforo-badge.component';

interface ResumenSemaforo {
  VERDE: number;
  AMARILLO: number;
  ROJO: number;
  TOTAL: number;
}

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SemaforoBadgeComponent],
  templateUrl: './unidades.component.html',
  styleUrl: './unidades.component.css'
})
export class UnidadesComponent implements OnInit {
  unidades: Unidad[] = [];
  unidadesPanel: any[] = [];
  resumen: ResumenSemaforo = { VERDE: 0, AMARILLO: 0, ROJO: 0, TOTAL: 0 };
  cargando = true;
  formCambio!: FormGroup;
  mostrarModal = false;
  unidadSeleccionada!: Unidad | null;
  error = '';
  exito = '';
  filtro: string = 'todas';

  constructor(
    private fb: FormBuilder,
    private unidadService: UnidadService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarUnidades();
    this.cargarResumen();
    this.formCambio = this.fb.group({
      nuevoEstado: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  cargarUnidades() {
    this.cargando = true;
    this.unidadService.obtenerTodas().subscribe({
      next: (datos) => {
        this.unidades = datos;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });

    this.unidadService.obtenerPanel().subscribe({
      next: (datos) => {
        this.unidadesPanel = datos;
      },
      error: (err) => console.error('Error al cargar panel:', err)
    });
  }

  cargarResumen() {
    this.unidadService.obtenerResumenSemaforo().subscribe({
      next: (datos) => { this.resumen = datos; },
      error: (err) => console.error('Error al cargar resumen:', err)
    });
  }

  filtrar(estado: string) {
    this.filtro = estado;
  }

  get unidadesFiltradas(): any[] {
    const lista = this.unidadesPanel.length > 0 ? this.unidadesPanel : this.unidades;
    if (this.filtro === 'todas') return lista;
    if (['VERDE', 'AMARILLO', 'ROJO'].includes(this.filtro)) {
      return lista.filter(u => u.estadoSemaforo === this.filtro);
    }
    // ✅ Filtramos por estadoViaje
    if (['EN_ESPERA', 'EN_RUTA', 'EN_DESCARGA', 'FINALIZADO', 'RETRASADO'].includes(this.filtro)) {
      return this.unidadesPanel.filter(u => u.estadoViaje === this.filtro);
    }
    return lista;
  }

  // ✅ Cambiado de estadoViaje → estadoRuta
  getEstadoRutaTexto(estado: string | undefined): string {
    if (!estado) return 'Sin asignar';
    return estado.replace('_', ' ');
  }

  getEstadoRutaIcono(estado: string | undefined): string {
    switch (estado) {
      case 'EN_ESPERA': return '⏳';
      case 'EN_RUTA': return '🚛';
      case 'EN_DESCARGA': return '📦';
      case 'FINALIZADO': return '✅';
      case 'RETRASADO': return '⚠️';
      default: return '—';
    }
  }

  formatearFecha(fecha: string | undefined): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
  }

  abrirModal(unidad: Unidad) {
    this.unidadSeleccionada = unidad;
    this.formCambio.reset();
    this.mostrarModal = true;
    this.error = '';
    this.exito = '';
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.unidadSeleccionada = null;
  }

  guardarCambio() {
    if (this.formCambio.invalid || !this.unidadSeleccionada) return;
    const usuario = this.authService.getUsuario();
    if (!usuario) return;
    this.error = '';
    this.exito = '';

    this.unidadService.cambiarSemaforo(
      this.unidadSeleccionada.idUnidad,
      {
        nuevoEstado: this.formCambio.value.nuevoEstado as EstadoSemaforo,
        motivo: this.formCambio.value.motivo,
        idUsuario: usuario.idUsuario
      }
    ).subscribe({
      next: () => {
        this.exito = 'Estado actualizado correctamente';
        this.cargarUnidades();
        this.cargarResumen();
        setTimeout(() => this.cerrarModal(), 1200);
      },
      error: (err) => {
        this.error = err.error?.message || 'No se pudo actualizar el estado';
      }
    });
  }
}