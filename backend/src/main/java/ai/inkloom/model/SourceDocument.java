package ai.inkloom.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "source_documents")
public class SourceDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 100)
    private String section;

    @Column(nullable = false, length = 30)
    private String version;

    @Column(nullable = false, length = 100)
    private String ownerName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contentExcerpt;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String fullText;

    private LocalDate reviewDate;

    private LocalDate expiryDate;

    @Column(nullable = false)
    private Boolean isArchived = false;

    @Column(nullable = false)
    private Integer priority = 1;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public SourceDocument() {}

    public SourceDocument(Workspace workspace, String title, String section, String version,
                          String ownerName, String contentExcerpt, String fullText,
                          LocalDate reviewDate, LocalDate expiryDate, Integer priority) {
        this.workspace = workspace;
        this.title = title;
        this.section = section;
        this.version = version;
        this.ownerName = ownerName;
        this.contentExcerpt = contentExcerpt;
        this.fullText = fullText;
        this.reviewDate = reviewDate;
        this.expiryDate = expiryDate;
        this.priority = priority != null ? priority : 1;
        this.isArchived = false;
    }

    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDate.now());
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Workspace getWorkspace() { return workspace; }
    public void setWorkspace(Workspace workspace) { this.workspace = workspace; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
