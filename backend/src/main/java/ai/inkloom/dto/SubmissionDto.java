package ai.inkloom.dto;

import ai.inkloom.model.ContentSubmission;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class SubmissionDto {

    public static class CreateRequest {
        @NotBlank(message = "Title is required")
        private String title;

        @NotNull(message = "Content type is required")
        private ContentSubmission.ContentType contentType = ContentSubmission.ContentType.TEXT_PASTE;

        private String rawContent;

        @NotNull(message = "Workspace ID is required")
        private Long workspaceId;

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public ContentSubmission.ContentType getContentType() { return contentType; }
        public void setContentType(ContentSubmission.ContentType contentType) { this.contentType = contentType; }

        public String getRawContent() { return rawContent; }
        public void setRawContent(String rawContent) { this.rawContent = rawContent; }

        public Long getWorkspaceId() { return workspaceId; }
        public void setWorkspaceId(Long workspaceId) { this.workspaceId = workspaceId; }
    }

    public static class Response {
        private Long id;
        private Long workspaceId;
        private String title;
        private String contentType;
        private String rawContent;
        private String extractedText;
        private Integer wordCount;
        private Integer characterCount;
        private String originalFileName;
        private String status;
        private Integer findingCount;
        private Integer criticalCount;
        private Integer warningCount;
        private String submittedByName;
        private String submittedByEmail;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Response() {}

        public Response(ContentSubmission s) {
            this.id = s.getId();
            this.workspaceId = s.getWorkspace().getId();
            this.title = s.getTitle();
            this.contentType = s.getContentType().name();
            this.rawContent = s.getRawContent();
            this.extractedText = s.getExtractedText();
            this.wordCount = s.getWordCount();
            this.characterCount = s.getCharacterCount();
            this.originalFileName = s.getOriginalFileName();
            this.status = s.getStatus().name();
            this.findingCount = s.getFindingCount();
            this.criticalCount = s.getCriticalCount();
            this.warningCount = s.getWarningCount();
            if (s.getSubmittedBy() != null) {
                this.submittedByName = s.getSubmittedBy().getFullName();
                this.submittedByEmail = s.getSubmittedBy().getEmail();
            }
            this.createdAt = s.getCreatedAt();
            this.updatedAt = s.getUpdatedAt();
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getWorkspaceId() { return workspaceId; }
        public void setWorkspaceId(Long workspaceId) { this.workspaceId = workspaceId; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getContentType() { return contentType; }
        public void setContentType(String contentType) { this.contentType = contentType; }

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

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Integer getFindingCount() { return findingCount; }
        public void setFindingCount(Integer findingCount) { this.findingCount = findingCount; }

        public Integer getCriticalCount() { return criticalCount; }
        public void setCriticalCount(Integer criticalCount) { this.criticalCount = criticalCount; }

        public Integer getWarningCount() { return warningCount; }
        public void setWarningCount(Integer warningCount) { this.warningCount = warningCount; }

        public String getSubmittedByName() { return submittedByName; }
        public void setSubmittedByName(String submittedByName) { this.submittedByName = submittedByName; }

        public String getSubmittedByEmail() { return submittedByEmail; }
        public void setSubmittedByEmail(String submittedByEmail) { this.submittedByEmail = submittedByEmail; }

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }
}
