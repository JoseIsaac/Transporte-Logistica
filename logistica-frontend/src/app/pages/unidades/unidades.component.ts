import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnidadService } from '../../core/services/unidad.service';
import { Unidad, UnidadPanelDTO, EstadoSemaforo, EstadoViaje, CambioSemaforoDTO, TipoUnidad } from '../../core/models/unidad.model';
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
  styleUrls: ['./unidades.component.css']
})
export class UnidadesComponent implements OnInit {
  unidades: Unidad[] = [];
  unidadesPanel: UnidadPanelDTO[] = [];
  resumen: ResumenSemaforo = { VERDE: 0, AMARILLO: 0, ROJO: 0, TOTAL: 0 };
  cargando = true;

  // 📋 Formularios
  formCambio!: FormGroup;
  formCrear!: FormGroup;
  formEditar!: FormGroup; // ✅ Agregado

  // 🎯 Modales
  mostrarModal = false;
  mostrarModalCrear = false;
  mostrarModalEditar = false; // ✅ Agregado
  unidadSeleccionada: Unidad | UnidadPanelDTO | null = null;
  unidadEditar: Partial<UnidadPanelDTO> | null = null; // ✅ Agregado

  // 📊 Filtros y mensajes
  error = '';
  exito = '';
  filtro: string = 'todas';

  // 🔄 Opciones para formulario
  tiposUnidad: TipoUnidad[] = ['CAMIÓN', 'TANQUE', 'CAMIÓN_CARGA', 'OTRO'];
  estadosSemaforo: EstadoSemaforo[] = ['VERDE', 'AMARILLO', 'ROJO'];

  constructor(
    private fb: FormBuilder,
    private unidadService: UnidadService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.inicializarFormularios();
    this.cargarTodo();
  }

  // ✅ Inicializar TODOS los formularios
  inicializarFormularios(): void {
    // Formulario cambio de semáforo
    this.formCambio = this.fb.group({
      nuevoEstado: ['', Validators.required],
      motivo: ['']
    });
    this.formCambio.get('nuevoEstado')?.valueChanges.subscribe(estado => {
      const motivoControl = this.formCambio.get('motivo');
      if (estado && estado !== 'VERDE') {
        motivoControl?.setValidators([Validators.required]);
      } else {
        motivoControl?.clearValidators();
      }
      motivoControl?.updateValueAndValidity();
    });

    // Formulario alta de unidad
    this.formCrear = this.fb.group({
      numeroEconomico: ['', [Validators.required, Validators.maxLength(20)]],
      tipoUnidad: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', [Validators.required, Validators.min(1990), Validators.max(new Date().getFullYear() + 1)]],
      placas: ['', [Validators.required, Validators.maxLength(15)]],
      operadorAsignado: [''],
      estadoSemaforo: ['VERDE', Validators.required],
      observacionesSemaforo: ['']
    });

    // ✅ Formulario EDITAR — solo campos permitidos
    this.formEditar = this.fb.group({
      idUnidad: [null],
      placas: ['', Validators.required],
      operadorAsignado: [''],
      estadoSemaforo: ['', Validators.required],
      observacionesSemaforo: ['']
    });
  }

  cargarTodo(): void {
    this.cargando = true;
    this.contadorCargas = 0;
    this.error = '';
    this.exito = '';

    // Lista completa (tipo Unidad)
    this.unidadService.obtenerTodas().subscribe({
      next: (datos) => {
        this.unidades = datos; // ✅ correcto
        this.finalizarCarga();
      },
      error: () => this.finalizarCarga()
    });

    // Datos del panel (tipo UnidadPanelDTO)
    this.unidadService.obtenerPanel().subscribe({
      next: (datos) => {
        this.unidadesPanel = datos; // ✅ correcto — NO asignar a this.unidades
        this.finalizarCarga();
      },
      error: (err) => {
        console.error('Error al cargar panel:', err);
        this.finalizarCarga();
      }
    });

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
    if (this.contadorCargas >= 2 || this.contadorCargas === 1) {
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

  // 📌 Cambiar estado del semáforo
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
    this.formCambio.reset();
    this.error = '';
    this.exito = '';
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
    const datos: CambioSemaforoDTO = {
      nuevoEstado: this.formCambio.value.nuevoEstado as EstadoSemaforo,
      motivo: this.formCambio.value.motivo || '',
      idUsuario: usuario.idUsuario
    };
    this.unidadService.cambiarSemaforo(
      this.unidadSeleccionada.idUnidad,
      datos
    ).subscribe({
      next: () => {
        this.exito = '✅ Estado actualizado correctamente';
        this.contadorCargas = 0;
        setTimeout(() => {
          this.cargarTodo();
          this.cerrarModal();
        }, 1200);
      },
      error: (err) => {
        this.error = err.error?.message || '❌ No se pudo actualizar el estado';
      }
    });
  }

  // ✅ Alta de Unidad
  abrirModalCrear(): void {
    this.mostrarModalCrear = true;
    this.formCrear.reset({ estadoSemaforo: 'VERDE' });
    this.error = '';
    this.exito = '';
  }

  cerrarModalCrear(): void {
    this.mostrarModalCrear = false;
    this.formCrear.reset();
    this.error = '';
    this.exito = '';
  }

  guardarNuevaUnidad(): void {
    if (this.formCrear.invalid) {
      this.formCrear.markAllAsTouched();
      return;
    }
    this.error = '';
    this.exito = '';
    this.unidadService.crearUnidad(this.formCrear.value).subscribe({
      next: () => {
        this.exito = '✅ Unidad registrada correctamente';
        setTimeout(() => {
          this.cerrarModalCrear();
          this.contadorCargas = 0;
          this.cargarTodo();
        }, 1200);
      },
      error: (err) => {
        if (err.status === 409) {
          this.error = '⚠️ El número económico ya existe';
        } else {
          this.error = '❌ Error al registrar la unidad';
        }
      }
    });
  }

  // ✅ Verificar Administrador
  get esAdministrador(): boolean {
    const usuario = this.authService.getUsuario();
    return usuario?.rol === 'Administrador';
  }

  // ✅ MODAL EDITAR
  abrirModalEditar(unidad: UnidadPanelDTO) {
    this.unidadEditar = unidad;
    this.formEditar.patchValue({
      idUnidad: unidad.idUnidad,
      placas: unidad.placas,
      operadorAsignado: unidad.operadorAsignado || '',
      estadoSemaforo: unidad.estadoSemaforo,
      observacionesSemaforo: unidad.observacionesSemaforo || ''
    });
    this.mostrarModalEditar = true;
    this.error = '';
    this.exito = '';
  }

  cerrarModalEditar() {
    this.mostrarModalEditar = false;
    this.unidadEditar = null;
    this.formEditar.reset();
  }

  guardarEdicion() {
    if (this.formEditar.invalid) {
      this.formEditar.markAllAsTouched();
      return;
    }

    this.error = '';
    this.exito = '';
    const datos = this.formEditar.value;

    this.unidadService.actualizarUnidad(datos).subscribe({
      next: () => {
        this.exito = '✅ Unidad actualizada correctamente';
        setTimeout(() => {
          this.cerrarModalEditar();
          this.contadorCargas = 0;
          this.cargarTodo(); // Recargar lista con datos nuevos
        }, 1200);
      },
      error: (err) => {
        this.error = err.error?.message || '❌ Error al actualizar la unidad';
      }
    });
  }
}