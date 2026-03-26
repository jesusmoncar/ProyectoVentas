package com.backend.TiendaTemplateBackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TiendaTemplateBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TiendaTemplateBackendApplication.class, args);
    }

}
