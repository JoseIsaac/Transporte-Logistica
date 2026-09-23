package com.transportes.logistica.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl servicioUsuario;

    @Override
    protected void doFilterInternal(HttpServletRequest solicitud,
                                    HttpServletResponse respuesta,
                                    FilterChain cadena)
            throws ServletException, IOException {

        // ✅ Saltar rutas de autenticación
        String ruta = solicitud.getRequestURI();
        if (ruta.startsWith("/api/auth/")) {
            cadena.doFilter(solicitud, respuesta);
            return;
        }

        final String encabezadoAuth = solicitud.getHeader("Authorization");
        String token = null;
        String nombreUsuario = null;

        if (StringUtils.hasText(encabezadoAuth) && encabezadoAuth.startsWith("Bearer ")) {
            token = encabezadoAuth.substring(7);
            nombreUsuario = jwtUtil.extraerUsuario(token);
        }

        if (nombreUsuario != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails detallesUsuario = servicioUsuario.loadUserByUsername(nombreUsuario);
            if (jwtUtil.validarToken(token, detallesUsuario)) {
                UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                        detallesUsuario,
                        null,
                        detallesUsuario.getAuthorities()
                    );
                authToken.setDetails(new WebAuthenticationDetailsSource()
                    .buildDetails(solicitud));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        cadena.doFilter(solicitud, respuesta);
    }
}