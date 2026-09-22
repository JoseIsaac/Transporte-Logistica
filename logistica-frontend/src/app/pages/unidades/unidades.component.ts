import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UnidadService } from '../../core/services/unidad.service';
import { Unidad, EstadoSemaforo } from '../../core/models/unidad.model';
import { AuthService } from '../../core/services/auth.service';
import { SemaforoBadgeComponent } from '../../shared/semaforo-badge/semaforo-badge.component';

@Component({
  selector: 'app-unidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SemaforoBadgeComponent],
  templateUrl: './unidades.component.html',
  styleUrl: './unidades.component.css'
})
export class UnidadesComponent implements OnInit {
  unidades: Unidad[] = [];
  cargando = true;
  formCambio!: FormGroup;
  mostrarModal = false;
  unidadSeleccionada!: Unidad | null;
  error = '';
  exito = '';

  constructor(
    private fb: FormBuilder,
    private unidadService: UnidadService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarUnidades();
    this.formCambio = this.fb.group({
      nuevoEstado: ['', Validators.required],
      motivo: ['', Validators.required]
    });
  }

  cargarUnidades() {
    this.cargando = true;
    this.unidadService.obtenerTodas().subscribe({
      next: datos => {
        this.unidades = datos;
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
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
        setTimeout(() => this.cerrarModal(), 1200);
      },
      error: err => {
        this.error = err.error?.message || 'No se pudo actualizar el estado';
      }
    });
  }
}