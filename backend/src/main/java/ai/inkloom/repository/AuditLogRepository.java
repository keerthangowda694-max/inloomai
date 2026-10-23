package ai.inkloom.repository;

import ai.inkloom.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByWorkspaceIdOrderByCreatedAtDesc(Long workspaceId);
    List<AuditLog> findTop20ByWorkspaceIdOrderByCreatedAtDesc(Long workspaceId);
}
