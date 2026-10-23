package ai.inkloom.dto;

import ai.inkloom.model.BrandRule;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class BrandRuleDto {
    private Long id;

    @NotNull(message = "Workspace ID is required")
    private Long workspaceId;

    @NotNull(message = "Rule type is required")
    private BrandRule.RuleType ruleType;

    @NotBlank(message = "Target phrase is required")
    private String targetPhrase;

    private String approvedAlternative;
    private String contextGuideline;
    private BrandRule.Severity severity;
    private Boolean isActive;
    private LocalDateTime createdAt;

    public BrandRuleDto() {}

    public BrandRuleDto(BrandRule r) {
        this.id = r.getId();
        this.workspaceId = r.getWorkspace().getId();
        this.ruleType = r.getRuleType();
        this.targetPhrase = r.getTargetPhrase();
        this.approvedAlternative = r.getApprovedAlternative();
        this.contextGuideline = r.getContextGuideline();
        this.severity = r.getSeverity();
        this.isActive = r.getIsActive();
        this.createdAt = r.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(Long workspaceId) { this.workspaceId = workspaceId; }

    public BrandRule.RuleType getRuleType() { return ruleType; }
    public void setRuleType(BrandRule.RuleType ruleType) { this.ruleType = ruleType; }

    public String getTargetPhrase() { return targetPhrase; }
    public void setTargetPhrase(String targetPhrase) { this.targetPhrase = targetPhrase; }

    public String getApprovedAlternative() { return approvedAlternative; }
    public void setApprovedAlternative(String approvedAlternative) { this.approvedAlternative = approvedAlternative; }

    public String getContextGuideline() { return contextGuideline; }
    public void setContextGuideline(String contextGuideline) { this.contextGuideline = contextGuideline; }

    public BrandRule.Severity getSeverity() { return severity; }
    public void setSeverity(BrandRule.Severity severity) { this.severity = severity; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
