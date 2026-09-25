import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViajeService } from '../../core/services/viaje.service';
import { UnidadService } from '../../core/services/unidad.service';
import { ViajeDTO, EstadoViaje } from '../../core/models/viaje.model';

interface UnidadSelect {
  idUnidad: number;
  numeroEconomico: string;
  placas: string;
}

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viajes.component.html',
  styleUrls: ['./viajes.component.css']
})
export class ViajesComponent implements OnInit {
  viajes: ViajeDTO[] = [];
  unidades: UnidadSelect[] = [];
  cargando = true;

  mostrarModalCrear = false;
  mostrarModalEstado = false;
  viajeSeleccionado: ViajeDTO | null = null;
  error = '';
  exito = '';

  formCrear: FormGroup;
  formEstado: FormGroup;

  estados = [
    { valor: 'EN_ESPERA' as EstadoViaje, etiqueta: 'En Espera', clase: 'espera' },
    { valor: 'EN_RUTA' as EstadoViaje, etiqueta: 'En Ruta', clase: 'ruta' },
    { valor: 'EN_DESCARGA' as EstadoViaje, etiqueta: 'En Descarga', clase: 'descarga' },
    { valor: 'FINALIZADO' as EstadoViaje, etiqueta: 'Finalizado', clase: 'finalizado' },
    { valor: 'RETRASADO' as EstadoViaje, etiqueta: 'Retrasado', clase: 'retrasado' }
  ];

  constructor(
    private fb: FormBuilder,
    private viajeService: ViajeService,
    private unidadService: UnidadService
  ) {
    this.formCrear = this.fb.group({
      idUnidad: ['', Validators.required],
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      direccionOrigen: [''],
      direccionDestino: [''],
      fechaSalida: ['', Validators.required],
      fechaLlegadaEstimada: [''],
      observaciones: ['']
    });

    this.formEstado = this.fb.group({
      estadoViaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
    this.cargarUnidades();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error = '';
    this.viajeService.obtenerTodos().subscribe({
      next: (datos) => {
        this.viajes = datos;
        this.cargando = false;
      },
      error: () => {
        this.error = 'Error al cargar viajes';
        this.cargando = false;
      }
    });
  }

  cargarUnidades(): void {
    this.unidadService.obtenerPanel().subscribe({
      next: (datos) => {
        this.unidades = datos.map(dto => ({
          idUnidad: dto.idUnidad,
          numeroEconomico: dto.numeroEconomico,
          placas: dto.placas
        }));
      },
      error: () => {
        this.error = 'No se pudieron cargar las unidades';
      }
    });
  }

  get viajesActivos(): ViajeDTO[] {
    return this.viajes;
  }

  abrirModalCrear(): void {
    this.mostrarModalCrear = true;
    this.error = '';
    this.exito = '';
    this.formCrear.reset();
  }

  cerrarModales(): void {
    this.mostrarModalCrear = false;
    this.mostrarModalEstado = false;
    this.viajeSeleccionado = null;
    this.formCrear.reset();
    this.formEstado.reset();
    this.error = '';
    this.exito = '';
  }

  crearViaje(): void {
    if (this.formCrear.invalid) return;

    const valores = this.formCrear.value;

    // ✅ Convertir y formatear datos correctamente
    const viaje: ViajeDTO = {
      idUnidad: Number(valores.idUnidad), // ← Texto → Número
      origen: valores.origen,
      destino: valores.destino,
      direccionOrigen: valores.direccionOrigen,
      direccionDestino: valores.direccionDestino,
      fechaSalida: valores.fechaSalida ? new Date(valores.fechaSalida).toISOString() : '',
      fechaLlegadaEstimada: valores.fechaLlegadaEstimada ? new Date(valores.fechaLlegadaEstimada).toISOString() : undefined,
      estadoViaje: 'EN_ESPERA',
      observaciones: valores.observaciones,
      idUsuario: 1 // ← Reemplaza con el ID real del usuario autenticado
    };

    console.log('Enviando viaje:', viaje); // Para depurar

    this.viajeService.crear(viaje).subscribe({
      next: () => {
        this.exito = 'Viaje creado correctamente';
        this.cerrarModales();
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error completo:', err);
        this.error = 'Error al crear el viaje';
      }
    });
  }

  abrirModalEstado(viaje: ViajeDTO): void {
    this.viajeSeleccionado = viaje;
    this.mostrarModalEstado = true;
    this.formEstado.patchValue({ estadoViaje: viaje.estadoViaje });
    this.error = '';
    this.exito = '';
  }

  cambiarEstado(): void {
    if (!this.viajeSeleccionado || this.formEstado.invalid) return;

    const nuevoEstado = this.formEstado.get('estadoViaje')?.value;
    this.viajeService.cambiarEstado(this.viajeSeleccionado.idViaje!, nuevoEstado).subscribe({
      next: () => {
        this.exito = 'Estado actualizado';
        this.cerrarModales();
        this.cargarDatos();
      },
      error: () => {
        this.error = 'Error al cambiar estado';
      }
    });
  }

  obtenerClaseEstado(estado: string): string {
    return this.estados.find(e => e.valor === estado)?.clase || '';
  }

  obtenerEtiquetaEstado(estado: string): string {
    return this.estados.find(e => e.valor === estado)?.etiqueta || estado;
  }
}