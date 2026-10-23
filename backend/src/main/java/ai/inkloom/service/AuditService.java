package ai.inkloom.service;

import ai.inkloom.dto.AuditLogDto;
import ai.inkloom.model.AuditLog;
import ai.inkloom.model.User;
import ai.inkloom.model.Workspace;
import ai.inkloom.repository.AuditLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public void log(Workspace workspace, User user, String action, String entityType, Long entityId, String details, String ip) {
        AuditLog log = new AuditLog(workspace, user, action, entityType, entityId, details, ip);
        auditLogRepository.save(log);
    }

    public List<AuditLogDto> getRecentLogs(Long workspaceId) {
        List<AuditLog> logs = (workspaceId != null) 
                ? auditLogRepository.findTop20ByWorkspaceIdOrderByCreatedAtDesc(workspaceId)
                : auditLogRepository.findAll();
        return logs.stream().map(AuditLogDto::new).collect(Collectors.toList());
    }
}
