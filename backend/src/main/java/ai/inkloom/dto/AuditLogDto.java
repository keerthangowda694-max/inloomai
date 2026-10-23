package ai.inkloom.dto;

import ai.inkloom.model.AuditLog;
import java.time.LocalDateTime;

public class AuditLogDto {
    private Long id;
    private String action;
    private String entityType;
    private Long entityId;
    private String details;
    private String userName;
    private String userEmail;
    private String ipAddress;
    private LocalDateTime createdAt;

    public AuditLogDto() {}

    public AuditLogDto(AuditLog a) {
        this.id = a.getId();
        this.action = a.getAction();
        this.entityType = a.getEntityType();
        this.entityId = a.getEntityId();
        this.details = a.getDetails();
        if (a.getUser() != null) {
            this.userName = a.getUser().getFullName();
            this.userEmail = a.getUser().getEmail();
        } else {
            this.userName = "System Governance Engine";
            this.userEmail = "engine@inkloom.ai";
        }
        this.ipAddress = a.getIpAddress();
        this.createdAt = a.getCreatedAt();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
