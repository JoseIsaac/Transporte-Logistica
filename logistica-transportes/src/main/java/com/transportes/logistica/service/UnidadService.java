package com.transportes.logistica.service;

import com.transportes.logistica.dto.UnidadPanelDTO;
import com.transportes.logistica.entity.Unidad;
import com.transportes.logistica.entity.Viaje;
import com.transportes.logistica.enums.EstadoSemaforo;
import com.transportes.logistica.repository.UnidadRepository;
import com.transportes.logistica.repository.ViajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UnidadService {
    
    @Autowired
    private UnidadRepository unidadRepository;
    
    @Autowired
    private ViajeRepository viajeRepository;
    
    // Obtener todas las unidades activas
    public List<Unidad> obtenerTodasActivas() {
        return unidadRepository.findByActivoTrue();
    }
    
    // Obtener unidades para el panel (con viaje activo)
    public List<UnidadPanelDTO> obtenerPanelUnidades() {
        List<Unidad> unidades = unidadRepository.findByActivoTrue();
        List<UnidadPanelDTO> panel = new ArrayList<>();
        
        for (Unidad u : unidades) {
            Optional<Viaje> viajeActivo = viajeRepository.findViajeActivoByUnidad(u.getIdUnidad());
            
            UnidadPanelDTO dto = new UnidadPanelDTO(
                u.getIdUnidad(),
                u.getNumeroEconomico(),
                u.getTipoUnidad(),
                u.getPlacas(),
                u.getOperadorAsignado(),
                u.getEstadoSemaforo(),
                u.getObservacionesSemaforo(),
                viajeActivo.map(Viaje::getEstadoViaje).orElse(null),
                viajeActivo.map(Viaje::getOrigen).orElse(null),
                viajeActivo.map(Viaje::getDestino).orElse(null),
                viajeActivo.map(Viaje::getFechaSalida).orElse(null),
                viajeActivo.map(Viaje::getFechaLlegadaEstimada).orElse(null)
            );
            panel.add(dto);
        }
        return panel;
    }
    
    // Obtener resumen del semáforo
    public Map<String, Long> obtenerResumenSemaforo() {
        Map<String, Long> resumen = new HashMap<>();
        resumen.put("VERDE", unidadRepository.countByEstadoSemaforoAndActivoTrue(EstadoSemaforo.VERDE));
        resumen.put("AMARILLO", unidadRepository.countByEstadoSemaforoAndActivoTrue(EstadoSemaforo.AMARILLO));
        resumen.put("ROJO", unidadRepository.countByEstadoSemaforoAndActivoTrue(EstadoSemaforo.ROJO));
        resumen.put("TOTAL", unidadRepository.findByActivoTrue().size());
        return resumen;
    }
    
    // Obtener por ID
    public Unidad obtenerPorId(Integer id) {
        return unidadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Unidad no encontrada"));
    }
    
    // Guardar nueva unidad
    public Unidad guardarUnidad(Unidad unidad) {
        return unidadRepository.save(unidad);
    }
    
    // Eliminación lógica
    public void desactivarUnidad(Integer id) {
        Unidad unidad = obtenerPorId(id);
        unidad.setActivo(false);
        unidadRepository.save(unidad);
    }
}