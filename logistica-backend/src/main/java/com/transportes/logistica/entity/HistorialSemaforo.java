package com.transportes.logistica.entity;

import com.transportes.logistica.enums.EstadoSemaforo;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "historial_semaforo")
public class HistorialSemaforo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial")
    private Integer idHistorial;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unidad", nullable = false)
    private Unidad unidad;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_anterior")
    private EstadoSemaforo estadoAnterior;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_nuevo", nullable = false)
    private EstadoSemaforo estadoNuevo;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String motivo;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;
    
    @Column(name = "fecha_cambio")
    private LocalDateTime fechaCambio = LocalDateTime.now();
}