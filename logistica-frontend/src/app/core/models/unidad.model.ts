export type TipoUnidad = 'CAMIÓN' | 'TANQUE' | 'CAMIÓN_CARGA' | 'OTRO';
export type EstadoSemaforo = 'VERDE' | 'AMARILLO' | 'ROJO';

export interface Unidad {
  idUnidad: number;
  numeroEconomico: string;
  tipoUnidad: TipoUnidad;
  marca: string;
  modelo: string;
  anio: number;
  placas: string;
  operadorAsignado: string;
  estadoSemaforo: EstadoSemaforo;
  observacionesSemaforo?: string;
  activo: boolean;
}

export interface UnidadPanelDTO {
  idUnidad: number;
  numeroEconomico: string;
  tipoUnidad: TipoUnidad;
  placas: string;
  operadorAsignado: string;
  estadoSemaforo: EstadoSemaforo;
  observacionesSemaforo?: string;
  estadoViaje?: string;
  origen?: string;
  destino?: string;
  fechaSalida?: string;
  fechaLlegadaEstimada?: string;
}

export interface ResumenSemaforo {
  VERDE: number;
  AMARILLO: number;
  ROJO: number;
  TOTAL: number;
}

export interface CambioSemaforoDTO {
  nuevoEstado: EstadoSemaforo;
  motivo: string;
  idUsuario: number;
}