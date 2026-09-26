package com.transportes.logistica.dto;

import com.transportes.logistica.enums.EstadoViaje;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ViajeDTO {

    private Long idViaje;

    @NotNull(message = "La unidad es obligatoria")
    private Integer idUnidad;

    @NotNull(message = "El número económico es obligatorio")
    private String numeroEconomico;

    @NotBlank(message = "El origen es obligatorio")
    private String origen;

    private String direccionOrigen;

    @NotBlank(message = "El destino es obligatorio")
    private String destino;

    private String direccionDestino;

    @NotNull(message = "La fecha de salida es obligatoria")
    private LocalDateTime fechaSalida;

    private LocalDateTime fechaLlegadaEstimada;
    private LocalDateTime fechaLlegadaReal;

    private EstadoViaje estadoViaje;
    private String observaciones;

    @NotNull(message = "El usuario que registra es obligatorio")
    private Integer idUsuario;
}