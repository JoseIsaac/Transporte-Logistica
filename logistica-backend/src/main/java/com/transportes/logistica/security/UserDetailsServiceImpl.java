package com.transportes.logistica.security;

import com.transportes.logistica.entity.Usuario;
import com.transportes.logistica.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String usuario) throws UsernameNotFoundException {
        Usuario usuarioBD = usuarioRepository.findByUsuarioAndActivoTrue(usuario)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + usuario));

        return User.builder()
                .username(usuarioBD.getUsuario())
                .password(usuarioBD.getContrasena())
                .authorities(Collections.singletonList(
                        new SimpleGrantedAuthority("ROLE_" + usuarioBD.getRol().getNombre().toUpperCase())
                ))
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(!usuarioBD.getActivo())
                .build();
    }
}