package com.elearny.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

/**
 * FR27/FR29-FR31: server-rendered PDFs from Thymeleaf HTML templates via Flying Saucer,
 * regenerated on demand from the live database record — never a client upload.
 * Files are written to a local storage directory; in production this would be an object
 * store (S3-compatible) behind the same interface.
 */
@Service
@RequiredArgsConstructor
public class PdfGenerationService {

    private final TemplateEngine templateEngine;

    @Value("${app.storage.dir:/tmp/elearny-storage}")
    private String storageDir;

    public String renderAndStore(String templateName, Map<String, Object> variables, String subfolder) {
        Context context = new Context();
        context.setVariables(variables);
        String html = templateEngine.process("pdf/" + templateName, context);

        try {
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(os);

            Path dir = Path.of(storageDir, subfolder);
            Files.createDirectories(dir);
            String filename = UUID.randomUUID() + ".pdf";
            Path filePath = dir.resolve(filename);
            try (FileOutputStream fos = new FileOutputStream(filePath.toFile())) {
                fos.write(os.toByteArray());
            }
            return filePath.toString();
        } catch (Exception e) {
            throw new IllegalStateException("PDF generation failed: " + e.getMessage(), e);
        }
    }

    public byte[] readPdf(String pathOrUrl) {
        try {
            return Files.readAllBytes(Path.of(pathOrUrl));
        } catch (Exception e) {
            throw new IllegalStateException("Could not read generated PDF: " + e.getMessage(), e);
        }
    }
}
