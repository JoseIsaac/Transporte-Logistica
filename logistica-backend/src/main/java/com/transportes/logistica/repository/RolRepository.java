package com.transportes.logistica.repository;

import com.transportes.logistica.entity.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolRepository extends JpaRepository<Rol, Integer> {
    // Si necesitas buscar por nombre: Optional<Rol> findByNombre(String nombre);
}