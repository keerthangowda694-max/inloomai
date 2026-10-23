package ai.inkloom.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "brand_rules")
public class BrandRule {

    public enum RuleType {
        PROHIBITED_PHRASE,
        APPROVED_TERMINOLOGY,
        NUMERICAL_BOUND,
        TONE_STYLE
    }

    public enum Severity {
        CRITICAL,
        WARNING,
        INFO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RuleType ruleType;

    @Column(nullable = false, length = 150)
    private String targetPhrase;

    @Column(length = 150)
    private String approvedAlternative;

    @Column(columnDefinition = "TEXT")
    private String contextGuideline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Severity severity = Severity.WARNING;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public BrandRule() {}

    public BrandRule(Workspace workspace, RuleType ruleType, String targetPhrase,
                     String approvedAlternative, String contextGuideline, Severity severity) {
        this.workspace = workspace;
        this.ruleType = ruleType;
        this.targetPhrase = targetPhrase;
        this.approvedAlternative = approvedAlternative;
        this.contextGuideline = contextGuideline;
        this.severity = severity != null ? severity : Severity.WARNING;
        this.isActive = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Workspace getWorkspace() { return workspace; }
    public void setWorkspace(Workspace workspace) { this.workspace = workspace; }

    public RuleType getRuleType() { return ruleType; }
    public void setRuleType(RuleType ruleType) { this.ruleType = ruleType; }

    public String getTargetPhrase() { return targetPhrase; }
    public void setTargetPhrase(String targetPhrase) { this.targetPhrase = targetPhrase; }

    public String getApprovedAlternative() { return approvedAlternative; }
    public void setApprovedAlternative(String approvedAlternative) { this.approvedAlternative = approvedAlternative; }

    public String getContextGuideline() { return contextGuideline; }
    public void setContextGuideline(String contextGuideline) { this.contextGuideline = contextGuideline; }

    public Severity getSeverity() { return severity; }
    public void setSeverity(Severity severity) { this.severity = severity; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
