package com.transportes.logistica.repository;

import com.transportes.logistica.entity.Unidad;
import com.transportes.logistica.entity.Viaje;
import com.transportes.logistica.enums.EstadoViaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ViajeRepository extends JpaRepository<Viaje, Long> {
    
    List<Viaje> findByUnidadAndActivoTrue(Unidad unidad);
    
    @Query("SELECT v FROM Viaje v WHERE v.unidad.idUnidad = :idUnidad " +
           "AND v.activo = true AND v.estadoViaje NOT IN ('FINALIZADO')")
    Optional<Viaje> findViajeActivoByUnidad(Integer idUnidad);
    
    List<Viaje> findByEstadoViajeAndActivoTrue(EstadoViaje estado);
}