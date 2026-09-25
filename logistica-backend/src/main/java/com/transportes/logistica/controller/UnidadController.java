package com.transportes.logistica.controller;

import com.transportes.logistica.dto.UnidadPanelDTO;
import com.transportes.logistica.service.UnidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/unidades")
@CrossOrigin(origins = "*") // ✅ Debe estar presente
public class UnidadController {

    @Autowired
    private UnidadService unidadService;

    // ✅ Datos para el panel — usa el servicio ya existente
    @GetMapping("/panel")
    public ResponseEntity<List<UnidadPanelDTO>> obtenerParaPanel() {
        List<UnidadPanelDTO> lista = unidadService.obtenerPanelUnidades();
        return ResponseEntity.ok(lista);
    }

    // ✅ Resumen de semáforo para las tarjetas
    @GetMapping("/resumen")
    public ResponseEntity<Map<String, Long>> obtenerResumen() {
        Map<String, Long> resumen = unidadService.obtenerResumenSemaforo();
        return ResponseEntity.ok(resumen);
    }
}