package com.transportes.logistica.dto;

import com.transportes.logistica.enums.EstadoSemaforo;
import com.transportes.logistica.enums.EstadoViaje;
import com.transportes.logistica.enums.TipoUnidad;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UnidadPanelDTO {
    private Integer idUnidad;
    private String numeroEconomico;
    private TipoUnidad tipoUnidad;
    private String placas;
    private String operadorAsignado;
    private EstadoSemaforo estadoSemaforo;
    private String observacionesSemaforo;
    private EstadoViaje estadoViaje;
    private String origen;
    private String destino;
    private LocalDateTime fechaSalida;
    private LocalDateTime fechaLlegadaEstimada;
}