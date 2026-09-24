package com.transportes.logistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UnidadPanelDTO {
    private Integer idUnidad;
    private String numeroEconomico;
    private String tipoUnidad;
    private String placas;
    private String operadorAsignado;
    private String estadoSemaforo;
    private String observacionesSemaforo;
    private String estadoViaje;
    private String origen;
    private String destino;
    private String fechaSalida;
    private String fechaLlegadaEstimada;
}