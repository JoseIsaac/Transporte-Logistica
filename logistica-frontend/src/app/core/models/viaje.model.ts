export type EstadoViaje = 'EN_ESPERA' | 'EN_RUTA' | 'EN_DESCARGA' | 'FINALIZADO' | 'RETRASADO';

export interface UnidadSelect {
  idUnidad: number;
  numeroEconomico: string;
  placas: string;
}

export interface ViajeDTO {
  idViaje?: number;
  idUnidad: number;
  // ✅ Agregado para que el HTML lo encuentre
  numeroEconomico?: string;
  unidad?: {
    numeroEconomico: string;
  };
  origen: string;
  destino: string;
  direccionOrigen?: string;
  direccionDestino?: string;
  fechaSalida?: string;
  fechaLlegadaEstimada?: string;
  fechaLlegadaReal?: string;
  estadoViaje: EstadoViaje | string;
  observaciones?: string;
  idUsuario?: number;
}