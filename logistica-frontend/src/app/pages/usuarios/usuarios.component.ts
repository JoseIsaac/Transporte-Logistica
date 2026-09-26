import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioDTO, Rol } from '../../core/models/usuario.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: UsuarioDTO[] = [];
  cargando = true;
  roles: Rol[] = [];
  error = '';
  exito = '';
  mostrarModalCrear = false;
  mostrarModalEditar = false;
  mostrarModalContrasena = false;
  usuarioSeleccionado: UsuarioDTO | null = null;

  formCrear: FormGroup;
  formEditar: FormGroup;
  formContrasena: FormGroup;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.formCrear = this.fb.group({
      idRol: ['', Validators.required],
      nombreCompleto: ['', Validators.required],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      correo: [''],
      contrasena: ['', [Validators.required, Validators.minLength(4)]],
      activo: [true]
    });

    this.formEditar = this.fb.group({
      idRol: ['', Validators.required],
      nombreCompleto: ['', Validators.required],
      usuario: ['', [Validators.required, Validators.minLength(3)]],
      correo: [''],
      activo: [true]
    });

    this.formContrasena = this.fb.group({
      contrasenaActual: ['', [Validators.required]], // ✅ Obligatorio
      nuevaContrasena: ['', [Validators.required, Validators.minLength(4)]], // ✅ Obligatorio + mínimo
      confirmarContrasena: ['', [Validators.required]] // ✅ Obligatorio
    });
  }

  ngOnInit(): void {
    // ✅ Reiniciamos TODO desde cero
    this.usuarios = [];
    this.cargando = true;
    this.cdr.markForCheck();
    this.cdr.detectChanges();

    this.cargarDatos();
    this.cargarRoles();
  }

  cargarDatos(): void {
    // ✅ Antes de llamar: aseguramos que muestra "Cargando..."
    this.cargando = true;
    this.usuarios = [];
    this.cdr.markForCheck();
    this.cdr.detectChanges();

    this.usuarioService.obtenerTodos().subscribe({
      next: (datos) => {
        console.log('✅ DATOS RECIBIDOS:', datos.length);

        // ✅ ASIGNACIÓN + FUERZA TOTAL DE REFRESCO
        this.usuarios = [...datos]; // Copia nueva para que Angular lo detecte
        this.cargando = false;

        // 🔴 FUERZA BRUTA — 3 niveles de refresco para que NO falle
        setTimeout(() => {
          this.cdr.markForCheck();
          this.cdr.detectChanges();
          console.log('✅ TABLA OBLIGADA A MOSTRARSE — cargando =', this.cargando);
        }, 0);

        setTimeout(() => {
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        }, 50);
      },
      error: (err) => {
        console.error('❌ ERROR:', err);
        this.error = 'No se pudieron cargar los usuarios';
        this.cargando = false;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      }
    });
  }

  cargarRoles(): void {
    this.http.get<Rol[]>('http://localhost:8080/api/roles').subscribe({
      next: (datos) => { this.roles = datos; }
    });
  }

  abrirModalCrear(): void {
    this.mostrarModalCrear = true;
    this.error = '';
    this.exito = '';
    this.formCrear.reset({ activo: true });
  }

  abrirModalEditar(usuario: UsuarioDTO): void {
    this.usuarioSeleccionado = usuario;
    this.mostrarModalEditar = true;
    this.error = '';
    this.exito = '';
    this.formEditar.patchValue({
      idRol: usuario.idRol,
      nombreCompleto: usuario.nombreCompleto,
      usuario: usuario.usuario,
      correo: usuario.correo,
      activo: usuario.activo
    });
  }

  abrirModalContrasena(usuario: UsuarioDTO): void {
    this.usuarioSeleccionado = usuario;
    this.mostrarModalContrasena = true;
    this.error = '';
    this.exito = '';
    this.formContrasena.reset();
  }

  cerrarModales(): void {
    this.mostrarModalCrear = false;
    this.mostrarModalEditar = false;
    this.mostrarModalContrasena = false;
    this.usuarioSeleccionado = null;
    this.formCrear.reset();
    this.formEditar.reset();
    this.formContrasena.reset();
    this.error = '';   // ✅ Limpia error
    this.exito = '';   // ✅ Limpia éxito
  }

  crearUsuario(): void {
    if (this.formCrear.invalid) return;
    this.usuarioService.crear(this.formCrear.value).subscribe({
      next: () => {
        this.exito = '✅ Usuario creado correctamente';
        this.cerrarModales();
        this.cargarDatos(); // ✅ Recarga la tabla automáticamente
      },
      error: (err) => {
        this.error = err.error?.message || '❌ Error al crear el usuario';
      }
    });
  }

  editarUsuario(): void {
    if (!this.usuarioSeleccionado || this.formEditar.invalid) return;
    this.usuarioService.actualizar(this.usuarioSeleccionado.idUsuario!, this.formEditar.value).subscribe({
      next: () => {
        this.exito = '✅ Usuario actualizado';
        this.cerrarModales();
        this.cargarDatos();
      },
      error: (err) => {
        this.error = err.error?.message || '❌ Error al actualizar';
      }
    });
  }

   cambiarContrasena(): void {
    // Limpiar mensajes anteriores
    this.error = '';
    this.exito = '';

    // Validar formulario
    if (this.formContrasena.invalid) {
      this.error = '❌ Completa todos los campos obligatorios';
      return;
    }

    const vals = this.formContrasena.value;

    // Validar coincidencia
    if (vals.nuevaContrasena !== vals.confirmarContrasena) {
      this.error = '❌ La nueva contraseña y la confirmación no coinciden';
      return;
    }

    // Validar longitud
    if (vals.nuevaContrasena.length < 4) {
      this.error = '❌ La nueva contraseña debe tener al menos 4 caracteres';
      return;
    }

    // Llamar al servicio
    this.usuarioService.cambiarContrasena(
      this.usuarioSeleccionado!.idUsuario!,
      {
        contrasenaActual: vals.contrasenaActual,
        nuevaContrasena: vals.nuevaContrasena
      }
    ).subscribe({
      next: (respuesta) => {
        // ✅ ÉXITO — Mostrar mensaje y cerrar
        this.exito = '✅ Contraseña actualizada correctamente';
        this.error = '';

        // Esperar 1 segundo para que veas el mensaje y cerrar
        setTimeout(() => {
          this.cerrarModales();
        }, 1000);
      },
      error: (err) => {
        this.exito = '';
        const mensaje = err.error?.message || err.error || '';
        if (String(mensaje).includes('actual') || String(mensaje).includes('incorrecta') || err.status === 400) {
          this.error = '❌ La contraseña actual no es correcta';
        } else {
          this.error = '❌ No se pudo cambiar la contraseña';
        }
      }
    });
  }

  toggleEstado(usuario: UsuarioDTO): void {
    this.usuarioService.cambiarEstado(usuario.idUsuario!).subscribe({
      next: () => {
        this.exito = '✅ Estado actualizado';
        this.cargarDatos();
      },
      error: () => {
        this.error = '❌ Error al cambiar estado';
      }
    });
  }
}