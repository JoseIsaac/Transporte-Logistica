package com.transportes.logistica.controller;

import com.transportes.logistica.dto.CambiarContrasenaDTO;
import com.transportes.logistica.dto.UsuarioDTO;
import com.transportes.logistica.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    // ✅ LISTAR TODOS LOS USUARIOS
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listar() {
        List<UsuarioDTO> lista = usuarioService.obtenerTodos();
        return ResponseEntity.ok(lista);
    }

    // ✅ OBTENER UNO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Integer id) {
        try {
            UsuarioDTO dto = usuarioService.obtenerPorId(id);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ CREAR NUEVO USUARIO
    @PostMapping
    public ResponseEntity<?> crear(
            @Valid @RequestBody UsuarioDTO dto,
            BindingResult resultadoValidacion) {

        if (resultadoValidacion.hasErrors()) {
            List<String> errores = resultadoValidacion.getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.toList());
            return ResponseEntity.badRequest().body(errores);
        }

        try {
            UsuarioDTO nuevo = usuarioService.crear(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ ACTUALIZAR USUARIO EXISTENTE
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioDTO dto,
            BindingResult resultadoValidacion) {

        if (resultadoValidacion.hasErrors()) {
            return ResponseEntity.badRequest()
                .body(resultadoValidacion.getFieldErrors());
        }

        try {
            UsuarioDTO actualizado = usuarioService.actualizar(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ ACTIVAR / DESACTIVAR USUARIO
    @PatchMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Integer id) {
        try {
            UsuarioDTO actualizado = usuarioService.cambiarEstado(id);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ CAMBIAR CONTRASEÑA
    @PatchMapping("/{id}/contrasena")
    public ResponseEntity<?> cambiarContrasena(
            @PathVariable Integer id,
            @Valid @RequestBody CambiarContrasenaDTO dto) {

        try {
            usuarioService.cambiarContrasena(id, dto.getNuevaContrasena());
            return ResponseEntity.ok("Contraseña actualizada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ ELIMINAR USUARIO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}