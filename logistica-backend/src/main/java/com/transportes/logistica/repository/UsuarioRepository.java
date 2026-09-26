package com.transportes.logistica.repository;

import com.transportes.logistica.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    
    Optional<Usuario> findByUsuario(String usuario);

    Optional<Usuario> findByUsuarioAndActivoTrue(String usuario);
    
    Optional<Usuario> findByCorreo(String correo);
    
    List<Usuario> findByActivoTrue();
    
    boolean existsByUsuario(String usuario);
    
    boolean existsByCorreo(String correo);
}