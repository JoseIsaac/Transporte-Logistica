package com.transportes.logistica.controller;

import com.transportes.logistica.dto.UnidadPanelDTO;
import com.transportes.logistica.entity.Unidad;
import com.transportes.logistica.service.UnidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/unidades")
@CrossOrigin(origins = "*") // Permitir Angular en desarrollo
public class UnidadController {
    
    @Autowired
    private UnidadService unidadService;
    
    // GET: Panel principal de unidades
    @GetMapping("/panel")
    public ResponseEntity<List<UnidadPanelDTO>> obtenerPanel() {
        return ResponseEntity.ok(unidadService.obtenerPanelUnidades());
    }
    
    // GET: Resumen del semáforo (tarjetas superiores)
    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Long>> obtenerResumen() {
        return ResponseEntity.ok(unidadService.obtenerResumenSemaforo());
    }
    
    // GET: Todas las unidades activas
    @GetMapping
    public ResponseEntity<List<Unidad>> obtenerTodas() {
        return ResponseEntity.ok(unidadService.obtenerTodasActivas());
    }
    
    // GET: Una unidad por ID
    @GetMapping("/{id}")
    public ResponseEntity<Unidad> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(unidadService.obtenerPorId(id));
    }
    
    // POST: Crear nueva unidad
    @PostMapping
    public ResponseEntity<Unidad> crearUnidad(@RequestBody Unidad unidad) {
        Unidad nueva = unidadService.guardarUnidad(unidad);
        return ResponseEntity.status(201).body(nueva);
    }
    
    // PUT: Actualizar unidad
    @PutMapping("/{id}")
    public ResponseEntity<Unidad> actualizarUnidad(@PathVariable Integer id, @RequestBody Unidad unidad) {
        unidad.setIdUnidad(id);
        return ResponseEntity.ok(unidadService.guardarUnidad(unidad));
    }
    
    // DELETE: Desactivar unidad (eliminación lógica)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarUnidad(@PathVariable Integer id) {
        unidadService.desactivarUnidad(id);
        return ResponseEntity.noContent().build();
    }
}