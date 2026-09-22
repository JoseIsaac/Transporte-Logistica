package com.transportes.logistica.controller;

import com.transportes.logistica.dto.CambioSemaforoDTO;
import com.transportes.logistica.entity.Unidad;
import com.transportes.logistica.service.SemaforoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/semaforo")
@CrossOrigin(origins = "*")
public class SemaforoController {
    
    @Autowired
    private SemaforoService semaforoService;
    
    // PUT: Cambiar estado del semáforo de una unidad
    @PutMapping("/unidad/{idUnidad}")
    public ResponseEntity<Unidad> cambiarEstado(
            @PathVariable Integer idUnidad,
            @Valid @RequestBody CambioSemaforoDTO dto) {
        
        Unidad unidadActualizada = semaforoService.cambiarEstadoSemaforo(idUnidad, dto);
        return ResponseEntity.ok(unidadActualizada);
    }
}