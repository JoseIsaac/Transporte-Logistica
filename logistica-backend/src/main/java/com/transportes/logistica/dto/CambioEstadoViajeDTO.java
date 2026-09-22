package com.transportes.logistica.dto;

import com.transportes.logistica.enums.EstadoViaje;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CambioEstadoViajeDTO {

    @NotNull(message = "El nuevo estado es obligatorio")
    private EstadoViaje nuevoEstado;

    private String observaciones;

    @NotNull(message = "El ID del usuario es obligatorio")
    private Integer idUsuario;
}