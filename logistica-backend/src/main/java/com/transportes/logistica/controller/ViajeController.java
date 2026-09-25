package com.transportes.logistica.controller;

import com.transportes.logistica.dto.CambioEstadoViajeDTO;
import com.transportes.logistica.dto.ViajeDTO;
import com.transportes.logistica.entity.Viaje;
import com.transportes.logistica.service.ViajeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/viajes")
@CrossOrigin(origins = "*")
public class ViajeController {

    @Autowired
    private ViajeService viajeService;

    // ✅ LISTAR TODOS LOS VIAJES (lo que llama tu frontend)
    @GetMapping
    public ResponseEntity<List<ViajeDTO>> obtenerTodos() {
        List<ViajeDTO> lista = viajeService.obtenerTodos()
                .stream()
                .map(viaje -> convertirADTO(viaje))
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    // CREAR NUEVO VIAJE
    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody ViajeDTO dto, BindingResult resultado) {
        // ✅ Si falla la validación, devolvemos el error claro
        if (resultado.hasErrors()) {
            List<String> errores = resultado.getFieldErrors().stream()
                    .map(e -> e.getField() + ": " + e.getDefaultMessage())
                    .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errores);
        }
        Viaje nuevo = viajeService.crearViaje(dto);
        return ResponseEntity.status(201).body(convertirADTO(nuevo));
    }

    // ✅ CAMBIAR ESTADO — PATCH para coincidir con el frontend
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
        @PathVariable Long id,
        @Valid @RequestBody CambioEstadoViajeDTO dto,
        BindingResult resultado) {
    if (resultado.hasErrors()) {
        List<String> errores = resultado.getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.toList());
        return ResponseEntity.badRequest().body(errores);
    }
    Viaje viajeActualizado = viajeService.cambiarEstado(id, dto);
    return ResponseEntity.ok(convertirADTO(viajeActualizado));
}

    // VER VIAJES ACTIVOS
    @GetMapping("/activos")
    public ResponseEntity<List<ViajeDTO>> obtenerActivos() {
        List<ViajeDTO> lista = viajeService.obtenerViajesActivos()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    // HISTORIAL POR UNIDAD
    @GetMapping("/unidad/{idUnidad}")
    public ResponseEntity<List<ViajeDTO>> obtenerHistorialUnidad(@PathVariable Integer idUnidad) {
        List<ViajeDTO> lista = viajeService.obtenerHistorialPorUnidad(idUnidad)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lista);
    }

    // DETALLE INDIVIDUAL
    @GetMapping("/{id}")
    public ResponseEntity<ViajeDTO> obtenerDetalle(@PathVariable Long id) {
        return viajeService.obtenerPorId(id)
                .map(viaje -> ResponseEntity.ok(convertirADTO(viaje)))
                .orElse(ResponseEntity.notFound().build());
    }

    // CANCELAR/ELIMINAR
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        if (!viajeService.existePorId(id)) {
            return ResponseEntity.notFound().build();
        }
        viajeService.cancelarViaje(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Convertir Entidad → DTO para enviar al frontend
    private ViajeDTO convertirADTO(Viaje viaje) {
        ViajeDTO dto = new ViajeDTO();
        dto.setIdViaje(viaje.getIdViaje());
        dto.setIdUnidad(viaje.getUnidad().getIdUnidad());
        dto.setNumeroEconomico(viaje.getUnidad().getNumeroEconomico()); // ✅ Para la tabla
        dto.setOrigen(viaje.getOrigen());
        dto.setDestino(viaje.getDestino());
        dto.setDireccionOrigen(viaje.getDireccionOrigen());
        dto.setDireccionDestino(viaje.getDireccionDestino());
        dto.setFechaSalida(viaje.getFechaSalida());
        dto.setFechaLlegadaEstimada(viaje.getFechaLlegadaEstimada());
        dto.setFechaLlegadaReal(viaje.getFechaLlegadaReal());
        dto.setEstadoViaje(viaje.getEstadoViaje());
        dto.setObservaciones(viaje.getObservaciones());
        return dto;
    }
}