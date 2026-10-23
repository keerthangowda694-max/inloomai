package ai.inkloom.repository;

import ai.inkloom.model.ContentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentSubmissionRepository extends JpaRepository<ContentSubmission, Long> {
    List<ContentSubmission> findByWorkspaceIdOrderByCreatedAtDesc(Long workspaceId);
    List<ContentSubmission> findTop10ByWorkspaceIdOrderByCreatedAtDesc(Long workspaceId);
    long countByWorkspaceId(Long workspaceId);
    long countByWorkspaceIdAndStatus(Long workspaceId, ContentSubmission.Status status);
}
