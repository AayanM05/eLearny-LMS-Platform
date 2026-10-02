package com.elearny;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.retry.annotation.EnableRetry;

@SpringBootApplication
public class ElearnyApplication {
    public static void main(String[] args) {
        SpringApplication.run(ElearnyApplication.class, args);
    }
}
