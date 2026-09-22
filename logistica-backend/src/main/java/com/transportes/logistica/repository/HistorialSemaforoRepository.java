package com.transportes.logistica.repository;

import com.transportes.logistica.entity.HistorialSemaforo;
import com.transportes.logistica.entity.Unidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HistorialSemaforoRepository extends JpaRepository<HistorialSemaforo, Integer> {
    
    List<HistorialSemaforo> findByUnidadOrderByFechaCambioDesc(Unidad unidad);
}