package ai.inkloom.repository;

import ai.inkloom.model.SourceDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SourceDocumentRepository extends JpaRepository<SourceDocument, Long> {
    List<SourceDocument> findByWorkspaceIdAndIsArchivedFalseOrderByPriorityDesc(Long workspaceId);
    List<SourceDocument> findByWorkspaceId(Long workspaceId);
}
