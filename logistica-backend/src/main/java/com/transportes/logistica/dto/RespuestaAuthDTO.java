package com.transportes.logistica.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RespuestaAuthDTO {

    private String token;
    private String tipo = "Bearer";
    private String nombreCompleto;
    private String rol;
    private Integer idUsuario;
}