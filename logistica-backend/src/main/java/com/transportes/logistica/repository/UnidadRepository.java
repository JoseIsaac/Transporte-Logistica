package com.transportes.logistica.repository;

import com.transportes.logistica.entity.Unidad;
import com.transportes.logistica.enums.EstadoSemaforo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnidadRepository extends JpaRepository<Unidad, Integer> {
    
    // ✅ Todas las unidades activas
    List<Unidad> findByActivoTrue();
    
    // ✅ Conteo por estado del semáforo (con Enum)
    long countByEstadoSemaforoAndActivoTrue(EstadoSemaforo estadoSemaforo);
}