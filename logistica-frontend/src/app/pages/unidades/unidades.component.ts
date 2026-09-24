import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnidadService } from '../../core/services/unidad.service';
import { Unidad, UnidadPanelDTO, EstadoSemaforo, EstadoViaje } from '../../core/models/unidad.model';
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
  styleUrls: ['./unidades.component.css'] // ✅ AQUÍ → con "s"
})
export class UnidadesComponent implements OnInit {
  unidades: Unidad[] = [];
  unidadesPanel: UnidadPanelDTO[] = []; // ✅ Tipado fuerte
  resumen: ResumenSemaforo = { VERDE: 0, AMARILLO: 0, ROJO: 0, TOTAL: 0 };
  cargando = true;
  formCambio!: FormGroup;
  mostrarModal = false;
  unidadSeleccionada: Unidad | UnidadPanelDTO | null = null; // ✅ Acepta ambos tipos
  error = '';
  exito = '';
  filtro: string = 'todas';

  constructor(
    private fb: FormBuilder,
    private unidadService: UnidadService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // ✅ Para asegurar actualización de vista
  ) {}

  ngOnInit() {
    this.cargarTodo();
    this.formCambio = this.fb.group({
      nuevoEstado: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  cargarTodo(): void {
    this.cargando = true;

    // Cargar lista completa
    this.unidadService.obtenerTodas().subscribe({
      next: (datos) => {
        this.unidades = datos;
        this.finalizarCarga();
      },
      error: () => this.finalizarCarga()
    });

    // Cargar datos del panel con origen/destino
    this.unidadService.obtenerPanel().subscribe({
      next: (datos) => {
        this.unidadesPanel = datos;
        this.finalizarCarga();
      },
      error: (err) => {
        console.error('Error al cargar panel:', err);
        this.finalizarCarga();
      }
    });

    // Cargar resumen de semáforo
    this.unidadService.obtenerResumenSemaforo().subscribe({
      next: (datos) => {
        this.resumen = datos;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar resumen:', err)
    });
  }

  private contadorCargas = 0;
  private finalizarCarga(): void {
    this.contadorCargas++;
    if (this.contadorCargas >= 2) { // Esperamos ambas llamadas
      this.cargando = false;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
    }
  }

  filtrar(estado: string) {
    this.filtro = estado;
  }

  get unidadesFiltradas(): (Unidad | UnidadPanelDTO)[] {
    const lista = this.unidadesPanel.length > 0 ? this.unidadesPanel : this.unidades;
    
    if (this.filtro === 'todas') return lista;
    
    if (['VERDE', 'AMARILLO', 'ROJO'].includes(this.filtro)) {
      return lista.filter(u => u.estadoSemaforo === this.filtro);
    }
    
    if (['EN_ESPERA', 'EN_RUTA', 'EN_DESCARGA', 'FINALIZADO', 'RETRASADO'].includes(this.filtro)) {
      return lista.filter(u => u.estadoViaje === this.filtro);
    }
    
    return lista;
  }

  getEstadoViajeTexto(estado?: string): string {
    if (!estado) return 'Sin asignar';
    const textos: Record<string, string> = {
      EN_ESPERA: 'En Espera',
      EN_RUTA: 'En Ruta',
      EN_DESCARGA: 'En Descarga',
      FINALIZADO: 'Finalizado',
      RETRASADO: 'Retrasado'
    };
    return textos[estado] || estado.replace('_', ' ');
  }

  getEstadoViajeIcono(estado?: string): string {
    const iconos: Record<string, string> = {
      EN_ESPERA: '⏳',
      EN_RUTA: '🚛',
      EN_DESCARGA: '📦',
      FINALIZADO: '✅',
      RETRASADO: '⚠️'
    };
    return estado ? (iconos[estado] || '—') : '—';
  }

  formatearFecha(fecha?: string): string {
    if (!fecha) return '—';
    return new Date(fecha).toLocaleString('es-MX', { 
      dateStyle: 'short', 
      timeStyle: 'short' 
    });
  }

  abrirModal(unidad: Unidad | UnidadPanelDTO) {
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
    if (!usuario) {
      this.error = 'No hay sesión activa';
      return;
    }

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
        this.exito = '✅ Estado actualizado correctamente';
        this.contadorCargas = 0;
        this.cargarTodo();
        setTimeout(() => this.cerrarModal(), 1500);
      },
      error: (err) => {
        this.error = err.error?.message || '❌ No se pudo actualizar el estado';
      }
    });
  }
}