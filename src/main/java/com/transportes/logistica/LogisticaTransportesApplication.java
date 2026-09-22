package com.transportes.logistica;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LogisticaTransportesApplication {

    public static void main(String[] args) {
        SpringApplication.run(LogisticaTransportesApplication.class, args);
        System.out.println("🚚 Sistema de Logística de Transportes - Backend iniciado correctamente");
    }
}