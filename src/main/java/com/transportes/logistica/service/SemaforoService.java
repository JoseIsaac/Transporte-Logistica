package com.transportes.logistica.service;

import com.transportes.logistica.dto.CambioSemaforoDTO;
import com.transportes.logistica.entity.HistorialSemaforo;
import com.transportes.logistica.entity.Unidad;
import com.transportes.logistica.entity.Usuario;
import com.transportes.logistica.enums.EstadoSemaforo;
import com.transportes.logistica.repository.HistorialSemaforoRepository;
import com.transportes.logistica.repository.UnidadRepository;
import com.transportes.logistica.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SemaforoService {
    
    @Autowired
    private UnidadRepository unidadRepository;
    
    @Autowired
    private HistorialSemaforoRepository historialRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Transactional
    public Unidad cambiarEstadoSemaforo(Integer idUnidad, CambioSemaforoDTO dto) {
        
        // Buscar unidad
        Unidad unidad = unidadRepository.findById(idUnidad)
            .orElseThrow(() -> new RuntimeException("Unidad no encontrada"));
        
        // Buscar usuario
        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Guardar estado anterior
        EstadoSemaforo estadoAnterior = unidad.getEstadoSemaforo();
        
        // 🚦 REGLA DE NEGOCIO: Si pasa a ROJO, registrar en historial
        // 🚦 REGLA DE NEGOCIO: Solo usuarios de mantenimiento o admin pueden cambiar a ROJO
        if (dto.getNuevoEstado() == EstadoSemaforo.ROJO) {
            String rolNombre = usuario.getRol().getNombre();
            if (!rolNombre.equals("Administrador") && !rolNombre.equals("Mantenimiento")) {
                throw new RuntimeException("No tienes permisos para cambiar el estado a ROJO");
            }
        }
        
        // Actualizar unidad
        unidad.setEstadoSemaforo(dto.getNuevoEstado());
        unidad.setObservacionesSemaforo(dto.getMotivo());
        unidad.setUsuarioActualiza(usuario);
        
        // Guardar historial
        HistorialSemaforo historial = new HistorialSemaforo();
        historial.setUnidad(unidad);
        historial.setEstadoAnterior(estadoAnterior);
        historial.setEstadoNuevo(dto.getNuevoEstado());
        historial.setMotivo(dto.getMotivo());
        historial.setUsuario(usuario);
        
        historialRepository.save(historial);
        
        return unidadRepository.save(unidad);
    }
}