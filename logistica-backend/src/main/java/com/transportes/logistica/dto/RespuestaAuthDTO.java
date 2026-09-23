package com.transportes.logistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RespuestaAuthDTO {
    private String token;
    private String tipo;
    private String nombreCompleto;
    private String rol;
    private Integer idUsuario;
}