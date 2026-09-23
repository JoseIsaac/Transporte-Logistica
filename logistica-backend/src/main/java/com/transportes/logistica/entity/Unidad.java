package com.transportes.logistica.entity;

import com.transportes.logistica.enums.EstadoSemaforo;
import com.transportes.logistica.enums.TipoUnidad;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "unidades")
public class Unidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_unidad")
    private Integer idUnidad;
    
    @Column(name = "numero_economico", nullable = false, unique = true, length = 20)
    private String numeroEconomico;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_unidad", nullable = false)
    private TipoUnidad tipoUnidad;
    
    @Column(nullable = false, length = 50)
    private String marca;
    
    @Column(nullable = false, length = 50)
    private String modelo;
    
    @Column(nullable = false)
    private Integer anio;
    
    @Column(nullable = false, unique = true, length = 20)
    private String placas;
    
    @Column(name = "numero_serie", unique = true, length = 50)
    private String numeroSerie;
    
    @Column(name = "operador_asignado", length = 100)
    private String operadorAsignado;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_semaforo")
    private EstadoSemaforo estadoSemaforo = EstadoSemaforo.VERDE;
    
    @Column(name = "observaciones_semaforo", columnDefinition = "TEXT")
    private String observacionesSemaforo;
    
    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso = LocalDate.now();
    
    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_actualiza")
    private Usuario usuarioActualiza;
    
    @Column(columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean activo = true;
    
    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}