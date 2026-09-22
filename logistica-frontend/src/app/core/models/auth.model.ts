export interface LoginDTO {
  usuario: string;
  contrasena: string;
}

export interface RespuestaAuthDTO {
  token: string;
  tipo: string;
  nombreCompleto: string;
  rol: string;
  idUsuario: number;
}