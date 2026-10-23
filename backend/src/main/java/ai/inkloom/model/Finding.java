package ai.inkloom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "findings")
public class Finding {

    public enum Category {
        TERMINOLOGY,
        PROHIBITED,
        CLAIM_MISMATCH,
        MISSING_EVIDENCE,
        SOURCE_EXPIRED,
        CONFLICTING_SOURCES,
        TONE_STYLE
    }

    public enum EvidenceStatus {
        VERIFIED_EVIDENCE,
        MISSING_EVIDENCE,
        CONFLICTING_EVIDENCE,
        EXPIRED_SOURCE,
        AI_ASSISTED_PENDING
    }

    public enum Status {
        PENDING,
        ACCEPTED,
        REJECTED,
        MODIFIED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "submission_id", nullable = false)
    private ContentSubmission submission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rule_id")
    private BrandRule rule;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "source_document_id")
    private SourceDocument sourceDocument;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BrandRule.Severity severity = BrandRule.Severity.WARNING;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String claimExcerpt;

    private Integer startIndex;

    private Integer endIndex;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String explanation;

    @Column(columnDefinition = "TEXT")
    private String approvedSourceExcerpt;

    @Column(columnDefinition = "TEXT")
    private String suggestedCorrection;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EvidenceStatus evidenceStatus = EvidenceStatus.VERIFIED_EVIDENCE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.PENDING;

    @Column(columnDefinition = "TEXT")
    private String reviewerComment;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Finding() {}

    public Finding(ContentSubmission submission, BrandRule rule, SourceDocument sourceDocument,
                   Category category, BrandRule.Severity severity, String claimExcerpt,
                   Integer startIndex, Integer endIndex, String explanation,
                   String approvedSourceExcerpt, String suggestedCorrection,
                   EvidenceStatus evidenceStatus) {
        this.submission = submission;
        this.rule = rule;
        this.sourceDocument = sourceDocument;
        this.category = category;
        this.severity = severity != null ? severity : BrandRule.Severity.WARNING;
        this.claimExcerpt = claimExcerpt;
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        this.explanation = explanation;
        this.approvedSourceExcerpt = approvedSourceExcerpt;
        this.suggestedCorrection = suggestedCorrection;
        this.evidenceStatus = evidenceStatus != null ? evidenceStatus : EvidenceStatus.VERIFIED_EVIDENCE;
        this.status = Status.PENDING;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ContentSubmission getSubmission() { return submission; }
    public void setSubmission(ContentSubmission submission) { this.submission = submission; }

    public BrandRule getRule() { return rule; }
    public void setRule(BrandRule rule) { this.rule = rule; }

    public SourceDocument getSourceDocument() { return sourceDocument; }
    public void setSourceDocument(SourceDocument sourceDocument) { this.sourceDocument = sourceDocument; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public BrandRule.Severity getSeverity() { return severity; }
    public void setSeverity(BrandRule.Severity severity) { this.severity = severity; }

    public String getClaimExcerpt() { return claimExcerpt; }
    public void setClaimExcerpt(String claimExcerpt) { this.claimExcerpt = claimExcerpt; }

    public Integer getStartIndex() { return startIndex; }
    public void setStartIndex(Integer startIndex) { this.startIndex = startIndex; }

    public Integer getEndIndex() { return endIndex; }
    public void setEndIndex(Integer endIndex) { this.endIndex = endIndex; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getApprovedSourceExcerpt() { return approvedSourceExcerpt; }
    public void setApprovedSourceExcerpt(String approvedSourceExcerpt) { this.approvedSourceExcerpt = approvedSourceExcerpt; }

    public String getSuggestedCorrection() { return suggestedCorrection; }
    public void setSuggestedCorrection(String suggestedCorrection) { this.suggestedCorrection = suggestedCorrection; }

    public EvidenceStatus getEvidenceStatus() { return evidenceStatus; }
    public void setEvidenceStatus(EvidenceStatus evidenceStatus) { this.evidenceStatus = evidenceStatus; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getReviewerComment() { return reviewerComment; }
    public void setReviewerComment(String reviewerComment) { this.reviewerComment = reviewerComment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
