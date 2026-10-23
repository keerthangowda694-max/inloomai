package ai.inkloom.dto;

import ai.inkloom.model.SourceDocument;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class SourceDocumentDto {
    private Long id;

    @NotNull(message = "Workspace ID is required")
    private Long workspaceId;

    @NotBlank(message = "Title is required")
    private String title;

    private String section;

    @NotBlank(message = "Version is required")
    private String version;

    @NotBlank(message = "Owner name is required")
    private String ownerName;

    @NotBlank(message = "Content excerpt is required")
    private String contentExcerpt;

    private String fullText;
    private LocalDate reviewDate;
    private LocalDate expiryDate;
    private Boolean isArchived;
    private Integer priority;
    private Boolean isExpired;
    private LocalDateTime createdAt;

    public SourceDocumentDto() {}

    public SourceDocumentDto(SourceDocument s) {
        this.id = s.getId();
        this.workspaceId = s.getWorkspace().getId();
        this.title = s.getTitle();
        this.section = s.getSection();
        this.version = s.getVersion();
        this.ownerName = s.getOwnerName();
        this.contentExcerpt = s.getContentExcerpt();
        this.fullText = s.getFullText();
        this.reviewDate = s.getReviewDate();
        this.expiryDate = s.getExpiryDate();
        this.isArchived = s.getIsArchived();
        this.priority = s.getPriority();
        this.isExpired = s.isExpired();
        this.createdAt = s.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(Long workspaceId) { this.workspaceId = workspaceId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getContentExcerpt() { return contentExcerpt; }
    public void setContentExcerpt(String contentExcerpt) { this.contentExcerpt = contentExcerpt; }

    public String getFullText() { return fullText; }
    public void setFullText(String fullText) { this.fullText = fullText; }

    public LocalDate getReviewDate() { return reviewDate; }
    public void setReviewDate(LocalDate reviewDate) { this.reviewDate = reviewDate; }

    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }

    public Boolean getIsArchived() { return isArchived; }
    public void setIsArchived(Boolean isArchived) { this.isArchived = isArchived; }

    public Integer getPriority() { return priority; }
    public void setPriority(Integer priority) { this.priority = priority; }

    public Boolean getIsExpired() { return isExpired; }
    public void setIsExpired(Boolean isExpired) { this.isExpired = isExpired; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
