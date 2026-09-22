package com.transportes.logistica.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secreto;

    @Value("${jwt.expiracion-ms}")
    private Long tiempoExpiracion;

    private SecretKey obtenerClave() {
        byte[] bytes = secreto.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(bytes);
    }

    public String extraerUsuario(String token) {
        return extraerReclamo(token, Claims::getSubject);
    }

    public Date extraerFechaExpiracion(String token) {
        return extraerReclamo(token, Claims::getExpiration);
    }

    public <T> T extraerReclamo(String token, Function<Claims, T> reclamoResolver) {
        final Claims reclamos = extraerTodosReclamos(token);
        return reclamoResolver.apply(reclamos);
    }

    private Claims extraerTodosReclamos(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(obtenerClave())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean tokenExpirado(String token) {
        return extraerFechaExpiracion(token).before(new Date());
    }

    public String generarToken(String usuario, String rol, Integer idUsuario) {
        Map<String, Object> reclamos = new HashMap<>();
        reclamos.put("rol", rol);
        reclamos.put("idUsuario", idUsuario);
        return crearToken(reclamos, usuario);
    }

    private String crearToken(Map<String, Object> reclamos, String sujeto) {
        return Jwts.builder()
                .setClaims(reclamos)
                .setSubject(sujeto)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + tiempoExpiracion))
                .signWith(obtenerClave(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validarToken(String token, UserDetails detallesUsuario) {
        final String nombreUsuarioExtraido = extraerUsuario(token);
        return (nombreUsuarioExtraido.equals(detallesUsuario.getUsername()) && !tokenExpirado(token));
    }
}