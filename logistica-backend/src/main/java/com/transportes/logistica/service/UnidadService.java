package com.transportes.logistica.service;

import com.transportes.logistica.dto.UnidadPanelDTO;
import com.transportes.logistica.entity.Unidad;
import com.transportes.logistica.entity.Viaje;
import com.transportes.logistica.enums.EstadoSemaforo;
import com.transportes.logistica.enums.EstadoViaje;
import com.transportes.logistica.repository.UnidadRepository;
import com.transportes.logistica.repository.ViajeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UnidadService {

    private final UnidadRepository unidadRepository;
    private final ViajeRepository viajeRepository;

    private static final DateTimeFormatter FORMATO_FECHA = 
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public List<Unidad> obtenerTodasActivas() {
        return unidadRepository.findByActivoTrue();
    }

    public List<UnidadPanelDTO> obtenerPanelUnidades() {
        List<Unidad> unidades = unidadRepository.findByActivoTrue();
        List<UnidadPanelDTO> panel = new ArrayList<>();

        for (Unidad u : unidades) {
            Optional<Viaje> viajeActivo = viajeRepository.findViajeActivoByUnidad(u.getIdUnidad());

            EstadoViaje estadoViaje = viajeActivo
                .map(Viaje::getEstadoViaje)
                .orElse(u.getEstadoViaje());

            String origen = viajeActivo.map(Viaje::getOrigen).orElse(u.getOrigen());
            String destino = viajeActivo.map(Viaje::getDestino).orElse(u.getDestino());

            // ✅ Formateo seguro de LocalDateTime → String
            String fechaSalida = viajeActivo.isPresent() && viajeActivo.get().getFechaSalida() != null
                ? viajeActivo.get().getFechaSalida().format(FORMATO_FECHA)
                : null;

            String fechaLlegadaEstimada = viajeActivo.isPresent() && viajeActivo.get().getFechaLlegadaEstimada() != null
                ? viajeActivo.get().getFechaLlegadaEstimada().format(FORMATO_FECHA)
                : null;

            UnidadPanelDTO dto = new UnidadPanelDTO(
                u.getIdUnidad(),
                u.getNumeroEconomico(),
                u.getTipoUnidad() != null ? u.getTipoUnidad().name() : null,
                u.getPlacas(),
                u.getOperadorAsignado(),
                u.getEstadoSemaforo() != null ? u.getEstadoSemaforo().name() : null,
                u.getObservacionesSemaforo(),
                estadoViaje != null ? estadoViaje.name() : null,
                origen,
                destino,
                fechaSalida,
                fechaLlegadaEstimada
            );
            panel.add(dto);
        }
        return panel;
    }

    public Map<String, Long> obtenerResumenSemaforo() {
        Map<String, Long> resumen = new HashMap<>();
        resumen.put("VERDE", unidadRepository.countByEstadoSemaforoAndActivoTrue(EstadoSemaforo.VERDE));
        resumen.put("AMARILLO", unidadRepository.countByEstadoSemaforoAndActivoTrue(EstadoSemaforo.AMARILLO));
        resumen.put("ROJO", unidadRepository.countByEstadoSemaforoAndActivoTrue(EstadoSemaforo.ROJO));
        resumen.put("TOTAL", (long) unidadRepository.findByActivoTrue().size());
        return resumen;
    }

    public Unidad obtenerPorId(Integer id) {
        return unidadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Unidad no encontrada con ID: " + id));
    }

    public Unidad guardarUnidad(Unidad unidad) {
        return unidadRepository.save(unidad);
    }

    public void desactivarUnidad(Integer id) {
        Unidad unidad = obtenerPorId(id);
        unidad.setActivo(false);
        unidadRepository.save(unidad);
    }
}