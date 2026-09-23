package com.transportes.logistica.controller;

import com.transportes.logistica.dto.LoginRequest;
import com.transportes.logistica.dto.RespuestaAuthDTO;
import com.transportes.logistica.entity.Usuario;
import com.transportes.logistica.repository.UsuarioRepository;
import com.transportes.logistica.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager gestorAutenticacion;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<RespuestaAuthDTO> login(@RequestBody LoginRequest datos) {
        Authentication autenticacion = gestorAutenticacion.authenticate(
            new UsernamePasswordAuthenticationToken(
                datos.getUsuario(),
                datos.getContrasena()
            )
        );

        Usuario usuario = usuarioRepository.findByUsuarioAndActivoTrue(datos.getUsuario())
            .orElseThrow();

        String token = jwtUtil.generarToken(
            usuario.getUsuario(),
            usuario.getRol().getNombre(),
            usuario.getIdUsuario()
        );

        RespuestaAuthDTO respuesta = new RespuestaAuthDTO(
            token,
            "Bearer",
            usuario.getNombreCompleto(),
            usuario.getRol().getNombre(),
            usuario.getIdUsuario()
        );

        return ResponseEntity.ok(respuesta);
    }
}