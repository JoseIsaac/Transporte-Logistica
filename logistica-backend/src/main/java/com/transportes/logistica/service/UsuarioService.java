package com.transportes.logistica.service;

import com.transportes.logistica.dto.UsuarioDTO;
import com.transportes.logistica.entity.Rol;
import com.transportes.logistica.entity.Usuario;
import com.transportes.logistica.repository.RolRepository;
import com.transportes.logistica.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired(required = false)
    private PasswordEncoder passwordEncoder;

    // Listar todos
    public List<UsuarioDTO> obtenerTodos() {
        return usuarioRepository.findAll().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
    }

    // Obtener por ID
    public UsuarioDTO obtenerPorId(Integer id) {
        return usuarioRepository.findById(id)
            .map(this::convertirADTO)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    // Crear
    public UsuarioDTO crear(UsuarioDTO dto) {
        if (usuarioRepository.existsByUsuario(dto.getUsuario())) {
            throw new RuntimeException("El usuario ya existe");
        }
        if (dto.getCorreo() != null && !dto.getCorreo().isBlank() &&
            usuarioRepository.existsByCorreo(dto.getCorreo())) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Rol rol = rolRepository.findById(dto.getIdRol())
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        Usuario usuario = new Usuario();
        usuario.setRol(rol);
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setUsuario(dto.getUsuario());
        usuario.setCorreo(dto.getCorreo());
        
        // Contraseña: sin encriptar por ahora como acordamos
        usuario.setContrasena(dto.getContrasena());
        usuario.setActivo(dto.getActivo() != null ? dto.getActivo() : true);

        return convertirADTO(usuarioRepository.save(usuario));
    }

    // Editar
    public UsuarioDTO actualizar(Integer id, UsuarioDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!usuario.getUsuario().equals(dto.getUsuario()) &&
            usuarioRepository.existsByUsuario(dto.getUsuario())) {
            throw new RuntimeException("El usuario ya existe");
        }

        Rol rol = rolRepository.findById(dto.getIdRol())
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        usuario.setRol(rol);
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setUsuario(dto.getUsuario());
        usuario.setCorreo(dto.getCorreo());
        usuario.setActivo(dto.getActivo());

        return convertirADTO(usuarioRepository.save(usuario));
    }

    // Cambiar estado
    public UsuarioDTO cambiarEstado(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(!usuario.getActivo());
        return convertirADTO(usuarioRepository.save(usuario));
    }

    // Cambiar contraseña
    public void cambiarContrasena(Integer id, String nuevaContrasena) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setContrasena(nuevaContrasena); // Plana por ahora
        usuarioRepository.save(usuario);
    }

    // Eliminar lógico
    public void eliminar(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(false);
        usuarioRepository.save(usuario);
    }

    // Convertir Entidad → DTO
    private UsuarioDTO convertirADTO(Usuario u) {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setIdUsuario(u.getIdUsuario());
        dto.setIdRol(u.getRol().getIdRol());
        dto.setNombreRol(u.getRol().getNombre());
        dto.setNombreCompleto(u.getNombreCompleto());
        dto.setUsuario(u.getUsuario());
        dto.setCorreo(u.getCorreo());
        dto.setActivo(u.getActivo());
        dto.setFechaCreacion(u.getFechaCreacion() != null ? u.getFechaCreacion().toString() : null);
        return dto;
    }
}