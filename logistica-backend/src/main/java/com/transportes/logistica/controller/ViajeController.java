package com.transportes.logistica.controller;

import com.transportes.logistica.dto.CambioEstadoViajeDTO;
import com.transportes.logistica.dto.ViajeDTO;
import com.transportes.logistica.entity.Viaje;
import com.transportes.logistica.service.ViajeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/viajes")
@CrossOrigin(origins = "*")
public class ViajeController {

    @Autowired
    private ViajeService viajeService;

    // CREAR NUEVO VIAJE
    @PostMapping
    public ResponseEntity<Viaje> crear(@Valid @RequestBody ViajeDTO dto) {
        Viaje nuevo = viajeService.crearViaje(dto);
        return ResponseEntity.status(201).body(nuevo);
    }

    // CAMBIAR ESTADO DEL VIAJE
    @PutMapping("/{id}/estado")
    public ResponseEntity<Viaje> cambiarEstado(
            @PathVariable Long id,
            @Valid @RequestBody CambioEstadoViajeDTO dto) {
        return ResponseEntity.ok(viajeService.cambiarEstado(id, dto));
    }

    // VER VIAJES ACTIVOS (EN RUTA)
    @GetMapping("/activos")
    public ResponseEntity<List<Viaje>> obtenerActivos() {
        return ResponseEntity.ok(viajeService.obtenerViajesActivos());
    }

    // VER HISTORIAL DE VIAJES DE UNA UNIDAD
    @GetMapping("/unidad/{idUnidad}")
    public ResponseEntity<List<Viaje>> obtenerHistorialUnidad(@PathVariable Integer idUnidad) {
        return ResponseEntity.ok(viajeService.obtenerHistorialPorUnidad(idUnidad));
    }

    // VER DETALLE DE UN VIAJE
    @GetMapping("/{id}")
    public ResponseEntity<Viaje> obtenerDetalle(@PathVariable Long id) {
        return ResponseEntity.ok(viajeService.obtenerPorId(id));
    }

    // CANCELAR VIAJE (eliminación lógica)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        viajeService.cancelarViaje(id);
        return ResponseEntity.noContent().build();
    }
}