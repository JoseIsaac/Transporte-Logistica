package com.transportes.logistica.controller;

import com.transportes.logistica.dto.UnidadPanelDTO;
import com.transportes.logistica.entity.Unidad;
import com.transportes.logistica.enums.EstadoSemaforo;
import com.transportes.logistica.service.UnidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/unidades")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UnidadController {

    private final UnidadService unidadService;

    @GetMapping("/panel")
    public ResponseEntity<List<UnidadPanelDTO>> obtenerPanel() {
        return ResponseEntity.ok(unidadService.obtenerPanelUnidades());
    }

    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Long>> obtenerResumen() {
        return ResponseEntity.ok(unidadService.obtenerResumenSemaforo());
    }

    @GetMapping
    public ResponseEntity<List<Unidad>> listarTodas() {
        return ResponseEntity.ok(unidadService.obtenerTodasActivas());
    }

    // ✅ Editar — Solo campos permitidos
    @PatchMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Map<String, Object> campos) {
        Unidad unidad = unidadService.buscarPorId(id);
        if (unidad == null) {
            return ResponseEntity.notFound().build();
        }

        if (campos.containsKey("placas")) {
            unidad.setPlacas((String) campos.get("placas"));
        }
        if (campos.containsKey("operadorAsignado")) {
            unidad.setOperadorAsignado((String) campos.get("operadorAsignado"));
        }
        if (campos.containsKey("estadoSemaforo")) {
            unidad.setEstadoSemaforo(EstadoSemaforo.valueOf((String) campos.get("estadoSemaforo")));
        }
        if (campos.containsKey("observacionesSemaforo")) {
            unidad.setObservacionesSemaforo((String) campos.get("observacionesSemaforo"));
        }

        unidadService.guardar(unidad);
        return ResponseEntity.ok(Map.of("mensaje", "Unidad actualizada correctamente"));
    }
}