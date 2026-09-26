package com.transportes.logistica.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UsuarioDTO {
    private Integer idUsuario;

    @NotNull(message = "El rol es obligatorio")
    private Integer idRol;
    private String nombreRol; // Para mostrar en la tabla

    @NotBlank(message = "El nombre completo es obligatorio")
    private String nombreCompleto;

    @NotBlank(message = "El usuario es obligatorio")
    private String usuario;

    private String correo;

    // Solo al crear o cambiar contraseña
    private String contrasena;

    private Boolean activo;
    private String fechaCreacion;
}