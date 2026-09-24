export type TipoUnidad = 'CAMIÓN' | 'TANQUE' | 'CAMIÓN_CARGA' | 'OTRO';
export type EstadoSemaforo = 'VERDE' | 'AMARILLO' | 'ROJO';
export type EstadoViaje = 'EN_ESPERA' | 'EN_RUTA' | 'EN_DESCARGA' | 'FINALIZADO' | 'RETRASADO';

export interface Unidad {
  idUnidad: number;
  numeroEconomico: string;
  tipoUnidad: string;
  placas: string;
  operadorAsignado?: string;
  estadoSemaforo?: EstadoSemaforo;
  observacionesSemaforo?: string;
  estadoViaje?: EstadoViaje; // ✅ NO EstadoRuta
  origen?: string;
  destino?: string;
  fechaSalida?: string;
  fechaLlegadaEstimada?: string;
}

export interface UnidadPanelDTO {
  idUnidad: number;
  numeroEconomico: string;
  tipoUnidad: TipoUnidad;
  placas: string;
  operadorAsignado: string;
  estadoSemaforo: EstadoSemaforo;
  observacionesSemaforo?: string;
  estadoViaje?: EstadoViaje; // ✅ De vuelta a estadoViaje
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