package com.transportes.logistica.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/panel")
@CrossOrigin(origins = "*")
public class PanelController {

    @GetMapping("/resumen")
    public Map<String, Object> obtenerResumen() {
        return Map.of(
            "vehiculosActivos", 24,
            "rutasActivas", 12,
            "entregasHoy", 47,
            "incidencias", 2,
            "variacionVehiculos", "+3 este mes",
            "variacionRutas", "Estables",
            "variacionEntregas", "+12 vs ayer",
            "variacionIncidencias", "-2 esta semana"
        );
    }
}