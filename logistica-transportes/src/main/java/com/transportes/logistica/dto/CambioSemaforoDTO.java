package com.transportes.logistica.dto;

import com.transportes.logistica.enums.EstadoSemaforo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CambioSemaforoDTO {
    
    @NotNull(message = "El nuevo estado del semáforo es obligatorio")
    private EstadoSemaforo nuevoEstado;
    
    @NotBlank(message = "El motivo del cambio es obligatorio")
    private String motivo;
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Integer idUsuario;
}