package com.transportes.logistica.enums;

public enum EstadoSemaforo {
    VERDE("Operación Normal"),
    AMARILLO("Revisión / Atención"),
    ROJO("Fuera de Servicio");

    private final String descripcion;

    EstadoSemaforo(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}