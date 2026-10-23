package ai.inkloom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "content_submissions")
public class ContentSubmission {

    public enum ContentType {
        TEXT_PASTE,
        PDF_UPLOAD
    }

    public enum Status {
        SUBMITTED,
        ANALYZING,
        VALIDATED,
        REVIEW_PENDING,
        APPROVED,
        REJECTED,
        REVISION_REQUESTED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User submittedBy;

    @Column(nullable = false, length = 150)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ContentType contentType;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String rawContent;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String extractedText;

    private Integer wordCount;

    private Integer characterCount;

    @Column(length = 200)
    private String originalFileName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Status status = Status.SUBMITTED;

    @Column(nullable = false)
    private Integer findingCount = 0;

    @Column(nullable = false)
    private Integer criticalCount = 0;

    @Column(nullable = false)
    private Integer warningCount = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    public ContentSubmission() {}

    public ContentSubmission(Workspace workspace, User submittedBy, String title,
                             ContentType contentType, String rawContent, String extractedText,
                             String originalFileName) {
        this.workspace = workspace;
        this.submittedBy = submittedBy;
        this.title = title;
        this.contentType = contentType;
        this.rawContent = rawContent;
        this.extractedText = extractedText;
        this.originalFileName = originalFileName;
        this.status = Status.SUBMITTED;
        if (extractedText != null) {
            this.characterCount = extractedText.length();
            this.wordCount = extractedText.trim().isEmpty() ? 0 : extractedText.trim().split("\\s+").length;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Workspace getWorkspace() { return workspace; }
    public void setWorkspace(Workspace workspace) { this.workspace = workspace; }

    public User getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(User submittedBy) { this.submittedBy = submittedBy; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public ContentType getContentType() { return contentType; }
    public void setContentType(ContentType contentType) { this.contentType = contentType; }

    public String getRawContent() { return rawContent; }
    public void setRawContent(String rawContent) { this.rawContent = rawContent; }

    public String getExtractedText() { return extractedText; }
    public void setExtractedText(String extractedText) { this.extractedText = extractedText; }

    public Integer getWordCount() { return wordCount; }
    public void setWordCount(Integer wordCount) { this.wordCount = wordCount; }

    public Integer getCharacterCount() { return characterCount; }
    public void setCharacterCount(Integer characterCount) { this.characterCount = characterCount; }

    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public Integer getFindingCount() { return findingCount; }
    public void setFindingCount(Integer findingCount) { this.findingCount = findingCount; }

    public Integer getCriticalCount() { return criticalCount; }
    public void setCriticalCount(Integer criticalCount) { this.criticalCount = criticalCount; }

    public Integer getWarningCount() { return warningCount; }
    public void setWarningCount(Integer warningCount) { this.warningCount = warningCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
