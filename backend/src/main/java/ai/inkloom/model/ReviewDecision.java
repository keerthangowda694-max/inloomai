package ai.inkloom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review_decisions")
public class ReviewDecision {

    public enum DecisionType {
        ACCEPT,
        REJECT,
        EDIT,
        REVISE
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private ContentSubmission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "finding_id")
    private Finding finding;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DecisionType decision;

    @Column(columnDefinition = "TEXT")
    private String originalCorrection;

    @Column(columnDefinition = "TEXT")
    private String finalCorrection;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public ReviewDecision() {}

    public ReviewDecision(ContentSubmission submission, Finding finding, User reviewer,
                          DecisionType decision, String originalCorrection,
                          String finalCorrection, String notes) {
        this.submission = submission;
        this.finding = finding;
        this.reviewer = reviewer;
        this.decision = decision;
        this.originalCorrection = originalCorrection;
        this.finalCorrection = finalCorrection;
        this.notes = notes;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ContentSubmission getSubmission() { return submission; }
    public void setSubmission(ContentSubmission submission) { this.submission = submission; }

    public Finding getFinding() { return finding; }
    public void setFinding(Finding finding) { this.finding = finding; }

    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public DecisionType getDecision() { return decision; }
    public void setDecision(DecisionType decision) { this.decision = decision; }

    public String getOriginalCorrection() { return originalCorrection; }
    public void setOriginalCorrection(String originalCorrection) { this.originalCorrection = originalCorrection; }

    public String getFinalCorrection() { return finalCorrection; }
    public void setFinalCorrection(String finalCorrection) { this.finalCorrection = finalCorrection; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
