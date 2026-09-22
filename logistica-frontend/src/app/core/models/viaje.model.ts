export type EstadoViaje = 'EN_ESPERA' | 'EN_RUTA' | 'EN_DESCARGA' | 'FINALIZADO' | 'RETRASADO';

export interface Viaje {
  idViaje: number;
  unidad: { idUnidad: number; numeroEconomico: string };
  origen: string;
  destino: string;
  fechaSalida: string;
  fechaLlegadaEstimada?: string;
  fechaLlegadaReal?: string;
  estadoViaje: EstadoViaje;
  observaciones?: string;
}

export interface ViajeDTO {
  idUnidad: number;
  origen: string;
  destino: string;
  direccionOrigen?: string;
  direccionDestino?: string;
  fechaSalida: string;
  fechaLlegadaEstimada?: string;
  observaciones?: string;
  idUsuario: number;
}

export interface CambioEstadoViajeDTO {
  nuevoEstado: EstadoViaje;
  observaciones?: string;
  idUsuario: number;
}