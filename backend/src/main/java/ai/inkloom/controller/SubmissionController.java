package ai.inkloom.controller;

import ai.inkloom.dto.SubmissionDto;
import ai.inkloom.model.ContentSubmission;
import ai.inkloom.model.User;
import ai.inkloom.repository.ContentSubmissionRepository;
import ai.inkloom.repository.UserRepository;
import ai.inkloom.service.SubmissionAnalysisService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionAnalysisService submissionAnalysisService;
    private final ContentSubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public SubmissionController(
            SubmissionAnalysisService submissionAnalysisService,
            ContentSubmissionRepository submissionRepository,
            UserRepository userRepository) {
        this.submissionAnalysisService = submissionAnalysisService;
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SubmissionDto.Response> createJsonSubmission(
            @RequestBody SubmissionDto.CreateRequest req,
            Authentication authentication) throws IOException {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        ContentSubmission sub = submissionAnalysisService.createAndAnalyze(req, user, null);
        return ResponseEntity.ok(new SubmissionDto.Response(sub));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SubmissionDto.Response> createMultipartSubmission(
            @RequestParam("title") String title,
            @RequestParam("workspaceId") Long workspaceId,
            @RequestParam(value = "rawContent", required = false) String rawContent,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Authentication authentication) throws IOException {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SubmissionDto.CreateRequest req = new SubmissionDto.CreateRequest();
        req.setTitle(title);
        req.setWorkspaceId(workspaceId);
        req.setRawContent(rawContent);
        req.setContentType(file != null && !file.isEmpty() ? ContentSubmission.ContentType.PDF_UPLOAD : ContentSubmission.ContentType.TEXT_PASTE);

        ContentSubmission sub = submissionAnalysisService.createAndAnalyze(req, user, file);
        return ResponseEntity.ok(new SubmissionDto.Response(sub));
    }

    @GetMapping
    public ResponseEntity<List<SubmissionDto.Response>> getSubmissions(
            @RequestParam("workspaceId") Long workspaceId) {
        List<ContentSubmission> subs = submissionRepository.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId);
        return ResponseEntity.ok(subs.stream().map(SubmissionDto.Response::new).collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionDto.Response> getSubmissionById(@PathVariable("id") Long id) {
        ContentSubmission sub = submissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found: " + id));
        return ResponseEntity.ok(new SubmissionDto.Response(sub));
    }
}
