package com.transportes.logistica.entity;

import com.transportes.logistica.enums.EstadoViaje;
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
@Table(name = "viajes")
public class Viaje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_viaje")
    private Long idViaje;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unidad", nullable = false)
    private Unidad unidad;
    
    @Column(nullable = false, length = 150)
    private String origen;
    
    @Column(name = "direccion_origen", columnDefinition = "TEXT")
    private String direccionOrigen;
    
    @Column(nullable = false, length = 150)
    private String destino;
    
    @Column(name = "direccion_destino", columnDefinition = "TEXT")
    private String direccionDestino;
    
    @Column(name = "fecha_salida")
    private LocalDateTime fechaSalida;
    
    @Column(name = "fecha_llegada_estimada")
    private LocalDateTime fechaLlegadaEstimada;
    
    @Column(name = "fecha_llegada_real")
    private LocalDateTime fechaLlegadaReal;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_viaje")
    private EstadoViaje estadoViaje = EstadoViaje.EN_ESPERA;
    
    @Column(columnDefinition = "TEXT")
    private String observaciones;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registrado_por", nullable = false)
    private Usuario registradoPor;
    
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();
    
    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean activo = true;
}