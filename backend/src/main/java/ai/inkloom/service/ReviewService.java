package ai.inkloom.service;

import ai.inkloom.dto.ReviewActionRequest;
import ai.inkloom.model.*;
import ai.inkloom.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final FindingRepository findingRepository;
    private final ReviewDecisionRepository reviewDecisionRepository;
    private final ContentSubmissionRepository submissionRepository;
    private final AuditService auditService;

    public ReviewService(
            FindingRepository findingRepository,
            ReviewDecisionRepository reviewDecisionRepository,
            ContentSubmissionRepository submissionRepository,
            AuditService auditService) {
        this.findingRepository = findingRepository;
        this.reviewDecisionRepository = reviewDecisionRepository;
        this.submissionRepository = submissionRepository;
        this.auditService = auditService;
    }

    @Transactional
    public Finding reviewFinding(Long findingId, ReviewActionRequest req, User reviewer) {
        Finding finding = findingRepository.findById(findingId)
                .orElseThrow(() -> new IllegalArgumentException("Finding not found: " + findingId));

        ContentSubmission submission = finding.getSubmission();

        String originalCorrection = finding.getSuggestedCorrection();
        String finalCorrection = (req.getFinalCorrection() != null && !req.getFinalCorrection().trim().isEmpty())
                ? req.getFinalCorrection().trim()
                : originalCorrection;

        Finding.Status newStatus;
        switch (req.getDecision()) {
            case ACCEPT -> newStatus = Finding.Status.ACCEPTED;
            case REJECT -> newStatus = Finding.Status.REJECTED;
            case EDIT -> newStatus = Finding.Status.MODIFIED;
            case REVISE -> newStatus = Finding.Status.PENDING;
            default -> newStatus = Finding.Status.ACCEPTED;
        }

        finding.setStatus(newStatus);
        finding.setSuggestedCorrection(finalCorrection);
        finding.setReviewerComment(req.getNotes());
        finding = findingRepository.save(finding);

        ReviewDecision decision = new ReviewDecision(
                submission,
                finding,
                reviewer,
                req.getDecision(),
                originalCorrection,
                finalCorrection,
                req.getNotes()
        );
        reviewDecisionRepository.save(decision);

        // Update overall submission status if all findings reviewed
        List<Finding> allFindings = findingRepository.findBySubmissionIdOrderByIdAsc(submission.getId());
        boolean hasPending = allFindings.stream().anyMatch(f -> f.getStatus() == Finding.Status.PENDING);

        if (!hasPending) {
            boolean hasRevision = (req.getDecision() == ReviewDecision.DecisionType.REVISE);
            submission.setStatus(hasRevision ? ContentSubmission.Status.REVISION_REQUESTED : ContentSubmission.Status.APPROVED);
            submissionRepository.save(submission);
        }

        auditService.log(
                submission.getWorkspace(),
                reviewer,
                "FINDING_REVIEWED",
                "Finding",
                finding.getId(),
                "Decision: " + req.getDecision() + " on claim '" + finding.getClaimExcerpt() + "'. Note: " + req.getNotes(),
                null
        );

        return finding;
    }
}
