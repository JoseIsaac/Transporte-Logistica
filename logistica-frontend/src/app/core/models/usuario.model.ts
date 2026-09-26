export interface Rol {
  idRol: number;
  nombre: string;
  descripcion?: string;
}

export interface UsuarioDTO {
  idUsuario?: number;
  idRol: number;
  nombreRol?: string;
  nombreCompleto: string;
  usuario: string;
  correo?: string;
  contrasena?: string; // Solo al crear/cambiar
  activo?: boolean;
  fechaCreacion?: string;
}

export interface CambiarContrasenaDTO {
  contrasenaActual: string;
  nuevaContrasena: string;
}