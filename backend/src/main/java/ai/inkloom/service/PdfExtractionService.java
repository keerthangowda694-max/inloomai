package ai.inkloom.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.io.RandomAccessReadBuffer;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PdfExtractionService {

    public String extractText(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty.");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename != null && !originalFilename.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("File must be a PDF document (.pdf).");
        }

        byte[] bytes = file.getBytes();
        if (bytes.length > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("PDF file size exceeds maximum limit of 10MB.");
        }

        try (PDDocument document = Loader.loadPDF(new RandomAccessReadBuffer(bytes))) {
            if (document.isEncrypted()) {
                throw new IllegalArgumentException("Password-protected or encrypted PDFs cannot be processed.");
            }

            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String text = stripper.getText(document);

            if (text == null || text.trim().isEmpty()) {
                throw new IllegalArgumentException(
                    "The uploaded PDF appears to be a scanned image without an accessible text layer. " +
                    "Please upload a text-based PDF or paste the document text directly into the editor."
                );
            }

            return text.trim();
        }
    }
}
