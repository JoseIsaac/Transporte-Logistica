package com.transportes.logistica.repository;

import com.transportes.logistica.entity.HistorialEstadoViaje;
import com.transportes.logistica.entity.Viaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorialEstadoViajeRepository extends JpaRepository<HistorialEstadoViaje, Long> {
    List<HistorialEstadoViaje> findByViajeOrderByFechaCambioDesc(Viaje viaje);
}