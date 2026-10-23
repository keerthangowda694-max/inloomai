package ai.inkloom.service;

import ai.inkloom.dto.SubmissionDto;
import ai.inkloom.model.*;
import ai.inkloom.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class SubmissionAnalysisService {

    private final ContentSubmissionRepository submissionRepository;
    private final BrandRuleRepository brandRuleRepository;
    private final SourceDocumentRepository sourceDocumentRepository;
    private final FindingRepository findingRepository;
    private final WorkspaceRepository workspaceRepository;
    private final DeterministicGovernanceEngine deterministicEngine;
    private final AiValidationService aiValidationService;
    private final PdfExtractionService pdfExtractionService;
    private final AuditService auditService;

    public SubmissionAnalysisService(
            ContentSubmissionRepository submissionRepository,
            BrandRuleRepository brandRuleRepository,
            SourceDocumentRepository sourceDocumentRepository,
            FindingRepository findingRepository,
            WorkspaceRepository workspaceRepository,
            DeterministicGovernanceEngine deterministicEngine,
            AiValidationService aiValidationService,
            PdfExtractionService pdfExtractionService,
            AuditService auditService) {
        this.submissionRepository = submissionRepository;
        this.brandRuleRepository = brandRuleRepository;
        this.sourceDocumentRepository = sourceDocumentRepository;
        this.findingRepository = findingRepository;
        this.workspaceRepository = workspaceRepository;
        this.deterministicEngine = deterministicEngine;
        this.aiValidationService = aiValidationService;
        this.pdfExtractionService = pdfExtractionService;
        this.auditService = auditService;
    }

    @Transactional
    public ContentSubmission createAndAnalyze(SubmissionDto.CreateRequest req, User user, MultipartFile file) throws IOException {
        Workspace workspace = workspaceRepository.findById(req.getWorkspaceId())
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found: " + req.getWorkspaceId()));

        String extractedText = req.getRawContent();
        String originalFileName = null;
        ContentSubmission.ContentType contentType = req.getContentType();

        if (file != null && !file.isEmpty()) {
            contentType = ContentSubmission.ContentType.PDF_UPLOAD;
            originalFileName = file.getOriginalFilename();
            extractedText = pdfExtractionService.extractText(file);
        }

        if (extractedText == null || extractedText.trim().isEmpty()) {
            throw new IllegalArgumentException("Content text cannot be empty.");
        }

        ContentSubmission submission = new ContentSubmission(
                workspace,
                user,
                req.getTitle(),
                contentType,
                req.getRawContent(),
                extractedText,
                originalFileName
        );
        submission.setStatus(ContentSubmission.Status.ANALYZING);
        submission = submissionRepository.save(submission);

        auditService.log(workspace, user, "SUBMISSION_CREATED", "ContentSubmission", submission.getId(),
                "Submitted content '" + submission.getTitle() + "' (" + contentType + ")", null);

        // Perform Governance Pipeline Analysis
        List<BrandRule> activeRules = brandRuleRepository.findByWorkspaceIdAndIsActiveTrue(workspace.getId());
        List<SourceDocument> activeSources = sourceDocumentRepository.findByWorkspaceIdAndIsArchivedFalseOrderByPriorityDesc(workspace.getId());

        List<Finding> allFindings = new ArrayList<>();

        // Stage 1: Deterministic Engine (Rules, Terminology, Claim bounds, Expiry)
        List<Finding> deterministicFindings = deterministicEngine.evaluate(submission, activeRules, activeSources);
        allFindings.addAll(deterministicFindings);

        // Stage 2: Semantic / Spring AI Validation (if enabled)
        if (aiValidationService.isAiConfigured()) {
            List<Finding> aiFindings = aiValidationService.evaluateWithAi(submission, activeSources);
            allFindings.addAll(aiFindings);
        }

        // Save Findings
        int criticalCount = 0;
        int warningCount = 0;

        for (Finding f : allFindings) {
            findingRepository.save(f);
            if (f.getSeverity() == BrandRule.Severity.CRITICAL) {
                criticalCount++;
            } else if (f.getSeverity() == BrandRule.Severity.WARNING) {
                warningCount++;
            }
        }

        submission.setFindingCount(allFindings.size());
        submission.setCriticalCount(criticalCount);
        submission.setWarningCount(warningCount);
        submission.setStatus(allFindings.isEmpty() ? ContentSubmission.Status.APPROVED : ContentSubmission.Status.REVIEW_PENDING);

        submission = submissionRepository.save(submission);

        auditService.log(workspace, user, "ANALYSIS_COMPLETED", "ContentSubmission", submission.getId(),
                "Governance engine identified " + allFindings.size() + " findings (" + criticalCount + " critical, " + warningCount + " warning)", null);

        return submission;
    }
}
