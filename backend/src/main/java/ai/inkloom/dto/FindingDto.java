package ai.inkloom.dto;

import ai.inkloom.model.Finding;
import java.time.LocalDateTime;

public class FindingDto {
    private Long id;
    private Long submissionId;
    private Long ruleId;
    private Long sourceDocumentId;
    private String category;
    private String severity;
    private String claimExcerpt;
    private Integer startIndex;
    private Integer endIndex;
    private String explanation;
    private String approvedSourceExcerpt;
    private String suggestedCorrection;
    private String evidenceStatus;
    private String status;
    private String reviewerComment;
    private LocalDateTime createdAt;

    // Associated Source Metadata
    private String sourceTitle;
    private String sourceVersion;
    private String sourceSection;
    private String sourceOwner;
    private Boolean sourceExpired;

    public FindingDto() {}

    public FindingDto(Finding f) {
        this.id = f.getId();
        this.submissionId = f.getSubmission().getId();
        if (f.getRule() != null) {
            this.ruleId = f.getRule().getId();
        }
        if (f.getSourceDocument() != null) {
            this.sourceDocumentId = f.getSourceDocument().getId();
            this.sourceTitle = f.getSourceDocument().getTitle();
            this.sourceVersion = f.getSourceDocument().getVersion();
            this.sourceSection = f.getSourceDocument().getSection();
            this.sourceOwner = f.getSourceDocument().getOwnerName();
            this.sourceExpired = f.getSourceDocument().isExpired();
        }
        this.category = f.getCategory().name();
        this.severity = f.getSeverity().name();
        this.claimExcerpt = f.getClaimExcerpt();
        this.startIndex = f.getStartIndex();
        this.endIndex = f.getEndIndex();
        this.explanation = f.getExplanation();
        this.approvedSourceExcerpt = f.getApprovedSourceExcerpt();
        this.suggestedCorrection = f.getSuggestedCorrection();
        this.evidenceStatus = f.getEvidenceStatus().name();
        this.status = f.getStatus().name();
        this.reviewerComment = f.getReviewerComment();
        this.createdAt = f.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }

    public Long getRuleId() { return ruleId; }
    public void setRuleId(Long ruleId) { this.ruleId = ruleId; }

    public Long getSourceDocumentId() { return sourceDocumentId; }
    public void setSourceDocumentId(Long sourceDocumentId) { this.sourceDocumentId = sourceDocumentId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

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

    public String getEvidenceStatus() { return evidenceStatus; }
    public void setEvidenceStatus(String evidenceStatus) { this.evidenceStatus = evidenceStatus; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReviewerComment() { return reviewerComment; }
    public void setReviewerComment(String reviewerComment) { this.reviewerComment = reviewerComment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getSourceTitle() { return sourceTitle; }
    public void setSourceTitle(String sourceTitle) { this.sourceTitle = sourceTitle; }

    public String getSourceVersion() { return sourceVersion; }
    public void setSourceVersion(String sourceVersion) { this.sourceVersion = sourceVersion; }

    public String getSourceSection() { return sourceSection; }
    public void setSourceSection(String sourceSection) { this.sourceSection = sourceSection; }

    public String getSourceOwner() { return sourceOwner; }
    public void setSourceOwner(String sourceOwner) { this.sourceOwner = sourceOwner; }

    public Boolean getSourceExpired() { return sourceExpired; }
    public void setSourceExpired(Boolean sourceExpired) { this.sourceExpired = sourceExpired; }
}
