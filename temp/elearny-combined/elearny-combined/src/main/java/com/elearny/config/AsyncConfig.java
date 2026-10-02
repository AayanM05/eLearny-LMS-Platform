package com.elearny.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

/**
 * Section 8.1 (Reliability Engineering). PDF generation and notification delivery run on a
 * dedicated executor, sized separately from the Tomcat request-handling pool, so a slow SMTP
 * server or PDF render never starves API responsiveness.
 */
@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfig {

    @Bean(name = "notificationExecutor")
    public ThreadPoolTaskExecutor notificationExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("notif-async-");
        executor.initialize();
        return executor;
    }

    @Bean(name = "pdfExecutor")
    public ThreadPoolTaskExecutor pdfExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(6);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("pdf-async-");
        executor.initialize();
        return executor;
    }
}
