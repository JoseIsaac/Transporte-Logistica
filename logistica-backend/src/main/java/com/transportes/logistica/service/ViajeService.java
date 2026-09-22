package com.transportes.logistica.service;

import com.transportes.logistica.dto.CambioEstadoViajeDTO;
import com.transportes.logistica.dto.ViajeDTO;
import com.transportes.logistica.entity.HistorialEstadoViaje;
import com.transportes.logistica.entity.Unidad;
import com.transportes.logistica.entity.Usuario;
import com.transportes.logistica.entity.Viaje;
import com.transportes.logistica.enums.EstadoSemaforo;
import com.transportes.logistica.enums.EstadoViaje;
import com.transportes.logistica.repository.HistorialEstadoViajeRepository;
import com.transportes.logistica.repository.UnidadRepository;
import com.transportes.logistica.repository.UsuarioRepository;
import com.transportes.logistica.repository.ViajeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ViajeService {

    @Autowired
    private ViajeRepository viajeRepository;

    @Autowired
    private UnidadRepository unidadRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private HistorialEstadoViajeRepository historialRepository;

    // CREAR NUEVO VIAJE
    @Transactional
    public Viaje crearViaje(ViajeDTO dto) {

        // 1. Buscar unidad
        Unidad unidad = unidadRepository.findById(dto.getIdUnidad())
            .orElseThrow(() -> new RuntimeException("Unidad no encontrada"));

        // 2. 🚦 REGLA: No asignar viaje si la unidad está en ROJO
        if (unidad.getEstadoSemaforo() == EstadoSemaforo.ROJO) {
            throw new RuntimeException("No se puede asignar viaje: la unidad está FUERA DE SERVICIO (Semáforo ROJO)");
        }

        // 3. 🚦 REGLA: No crear viaje si ya tiene uno activo
        Optional<Viaje> viajeActivo = viajeRepository.findViajeActivoByUnidad(dto.getIdUnidad());
        if (viajeActivo.isPresent()) {
            throw new RuntimeException("La unidad ya tiene un viaje en curso. Finalícelo primero.");
        }

        // 4. Buscar usuario que registra
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 5. Crear el viaje
        Viaje viaje = new Viaje();
        viaje.setUnidad(unidad);
        viaje.setOrigen(dto.getOrigen());
        viaje.setDireccionOrigen(dto.getDireccionOrigen());
        viaje.setDestino(dto.getDestino());
        viaje.setDireccionDestino(dto.getDireccionDestino());
        viaje.setFechaSalida(dto.getFechaSalida());
        viaje.setFechaLlegadaEstimada(dto.getFechaLlegadaEstimada());
        viaje.setObservaciones(dto.getObservaciones());
        viaje.setRegistradoPor(usuario);
        viaje.setEstadoViaje(EstadoViaje.EN_ESPERA);

        return viajeRepository.save(viaje);
    }

    // CAMBIAR ESTADO DEL VIAJE
    @Transactional
    public Viaje cambiarEstado(Long idViaje, CambioEstadoViajeDTO dto) {

        Viaje viaje = viajeRepository.findById(idViaje)
            .orElseThrow(() -> new RuntimeException("Viaje no encontrado"));

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        EstadoViaje estadoAnterior = viaje.getEstadoViaje();

        // Actualizar estado
        viaje.setEstadoViaje(dto.getNuevoEstado());

        // Si se marca como FINALIZADO, registrar llegada real
        if (dto.getNuevoEstado() == EstadoViaje.FINALIZADO) {
            viaje.setFechaLlegadaReal(java.time.LocalDateTime.now());
        }

        // Guardar en historial
        HistorialEstadoViaje registro = new HistorialEstadoViaje();
        registro.setViaje(viaje);
        registro.setEstadoAnterior(estadoAnterior.name());
        registro.setEstadoNuevo(dto.getNuevoEstado().name());
        registro.setUsuario(usuario);
        historialRepository.save(registro);

        return viajeRepository.save(viaje);
    }

    // OBTENER VIAJES ACTIVOS
    public List<Viaje> obtenerViajesActivos() {
        return viajeRepository.findByEstadoViajeAndActivoTrue(EstadoViaje.EN_RUTA);
    }

    // OBTENER HISTORIAL POR UNIDAD
    public List<Viaje> obtenerHistorialPorUnidad(Integer idUnidad) {
        Unidad unidad = unidadRepository.findById(idUnidad)
            .orElseThrow(() -> new RuntimeException("Unidad no encontrada"));
        return viajeRepository.findByUnidadAndActivoTrue(unidad);
    }

    // OBTENER VIAJE POR ID
    public Viaje obtenerPorId(Long id) {
        return viajeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Viaje no encontrado"));
    }

    // ELIMINACIÓN LÓGICA
    public void cancelarViaje(Long id) {
        Viaje viaje = obtenerPorId(id);
        viaje.setActivo(false);
        viajeRepository.save(viaje);
    }
}