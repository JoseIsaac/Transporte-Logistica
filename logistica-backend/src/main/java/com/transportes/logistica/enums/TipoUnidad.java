package com.transportes.logistica.enums;

public enum TipoUnidad {
    CAMIÓN("Camión"),
    TANQUE("Tanque / Cisterna"),
    CAMIÓN_CARGA("Camión de Carga"),
    OTRO("Otro");

    private final String descripcion;

    TipoUnidad(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}