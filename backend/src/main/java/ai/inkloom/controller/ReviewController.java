package ai.inkloom.controller;

import ai.inkloom.dto.FindingDto;
import ai.inkloom.dto.ReviewActionRequest;
import ai.inkloom.model.Finding;
import ai.inkloom.model.ReviewDecision;
import ai.inkloom.model.User;
import ai.inkloom.repository.ReviewDecisionRepository;
import ai.inkloom.repository.UserRepository;
import ai.inkloom.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewDecisionRepository reviewDecisionRepository;
    private final UserRepository userRepository;

    public ReviewController(
            ReviewService reviewService,
            ReviewDecisionRepository reviewDecisionRepository,
            UserRepository userRepository) {
        this.reviewService = reviewService;
        this.reviewDecisionRepository = reviewDecisionRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/findings/{id}/review")
    @PreAuthorize("hasAnyRole('ADMIN', 'REVIEWER', 'SOURCE_OWNER')")
    public ResponseEntity<FindingDto> reviewFinding(
            @PathVariable("id") Long id,
            @Valid @RequestBody ReviewActionRequest req,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Finding updatedFinding = reviewService.reviewFinding(id, req, user);
        return ResponseEntity.ok(new FindingDto(updatedFinding));
    }

    @GetMapping("/submissions/{id}/reviews")
    public ResponseEntity<List<ReviewDecision>> getReviewHistory(@PathVariable("id") Long submissionId) {
        List<ReviewDecision> decisions = reviewDecisionRepository.findBySubmissionIdOrderByCreatedAtDesc(submissionId);
        return ResponseEntity.ok(decisions);
    }
}
