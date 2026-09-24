package com.transportes.logistica.enums;

public enum EstadoViaje {
    EN_ESPERA("En Espera"),
    EN_RUTA("En Ruta"),
    EN_DESCARGA("En Descarga"),
    FINALIZADO("Finalizado"),
    RETRASADO("Retrasado");

    private final String descripcion;

    EstadoViaje(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}