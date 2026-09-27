export type TipoUnidad = 'CAMIÓN' | 'TANQUE' | 'CAMIÓN_CARGA' | 'OTRO';
export type EstadoSemaforo = 'VERDE' | 'AMARILLO' | 'ROJO';
export type EstadoViaje = 'EN_ESPERA' | 'EN_RUTA' | 'EN_DESCARGA' | 'FINALIZADO' | 'RETRASADO';

export interface Unidad {
  idUnidad: number;
  numeroEconomico: string;
  tipoUnidad: TipoUnidad | string;
  marca?: string;        // ✅ con ? = puede ser undefined
  modelo?: string;       // ✅ con ? = puede ser undefined
  anio?: number;
  placas: string;
  numeroSerie?: string;
  operadorAsignado?: string;
  estadoSemaforo?: EstadoSemaforo;
  observacionesSemaforo?: string;
  estadoViaje?: EstadoViaje;
  origen?: string;
  destino?: string;
  fechaSalida?: string;
  fechaLlegadaEstimada?: string;
  fechaIngreso?: string;
  activo?: boolean;
}

export interface UnidadPanelDTO {
  idUnidad: number;
  numeroEconomico: string;
  tipoUnidad: TipoUnidad | string;
  marca?: string;                    // ✅ Agregado
  modelo?: string;                   // ✅ Agregado
  placas: string;
  operadorAsignado?: string;
  estadoSemaforo?: EstadoSemaforo;
  observacionesSemaforo?: string;
  estadoViaje?: EstadoViaje;
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