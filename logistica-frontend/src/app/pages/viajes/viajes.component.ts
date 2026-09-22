import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViajeService } from '../../core/services/viaje.service';
import { UnidadService } from '../../core/services/unidad.service';
import { AuthService } from '../../core/services/auth.service';
import { Viaje, ViajeDTO, CambioEstadoViajeDTO, EstadoViaje } from '../../core/models/viaje.model';
import { Unidad } from '../../core/models/unidad.model';

@Component({
  selector: 'app-viajes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './viajes.component.html',
  styleUrl: './viajes.component.css'
})
export class ViajesComponent implements OnInit {
  viajesActivos: Viaje[] = [];
  unidades: Unidad[] = [];
  cargando = true;
  formCrear!: FormGroup;
  formEstado!: FormGroup;
  mostrarModalCrear = false;
  mostrarModalEstado = false;
  viajeSeleccionado: Viaje | null = null;
  error = '';
  exito = '';

  constructor(
    private fb: FormBuilder,
    private viajeService: ViajeService,
    private unidadService: UnidadService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarDatos();
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
      nuevoEstado: ['', Validators.required],
      observaciones: ['']
    });
  }

  cargarDatos() {
    this.cargando = true;
    this.unidadService.obtenerTodas().subscribe(datos => this.unidades = datos);
    this.viajeService.obtenerActivos().subscribe({
      next: datos => { this.viajesActivos = datos; this.cargando = false; },
      error: () => this.cargando = false
    });
  }

  abrirModalCrear() {
    this.formCrear.reset();
    this.error = ''; this.exito = '';
    this.mostrarModalCrear = true;
  }

  abrirModalEstado(viaje: Viaje) {
    this.viajeSeleccionado = viaje;
    this.formEstado.reset();
    this.error = ''; this.exito = '';
    this.mostrarModalEstado = true;
  }

  cerrarModales() {
    this.mostrarModalCrear = false;
    this.mostrarModalEstado = false;
    this.viajeSeleccionado = null;
  }

  crearViaje() {
    if (this.formCrear.invalid) return;
    const usuario = this.authService.getUsuario();
    if (!usuario) return;

    this.error = '';
    const datos = { ...this.formCrear.value, idUsuario: usuario.idUsuario } as ViajeDTO;

    this.viajeService.crear(datos).subscribe({
      next: () => {
        this.exito = 'Viaje creado correctamente';
        this.cargarDatos();
        setTimeout(() => this.cerrarModales(), 1200);
      },
      error: err => this.error = err.error?.message || 'No se pudo crear el viaje'
    });
  }

  cambiarEstado() {
    if (this.formEstado.invalid || !this.viajeSeleccionado) return;
    const usuario = this.authService.getUsuario();
    if (!usuario) return;

    this.error = '';
    const datos = {
      nuevoEstado: this.formEstado.value.nuevoEstado as EstadoViaje,
      observaciones: this.formEstado.value.observaciones,
      idUsuario: usuario.idUsuario
    } as CambioEstadoViajeDTO;

    this.viajeService.cambiarEstado(this.viajeSeleccionado.idViaje, datos).subscribe({
      next: () => {
        this.exito = 'Estado actualizado';
        this.cargarDatos();
        setTimeout(() => this.cerrarModales(), 1200);
      },
      error: err => this.error = err.error?.message || 'No se pudo actualizar'
    });
  }
}