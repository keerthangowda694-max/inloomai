package ai.inkloom.repository;

import ai.inkloom.model.BrandRule;
import ai.inkloom.model.Finding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FindingRepository extends JpaRepository<Finding, Long> {
    List<Finding> findBySubmissionIdOrderByIdAsc(Long submissionId);

    @Query("SELECT f FROM Finding f JOIN f.submission s WHERE s.workspace.id = :workspaceId ORDER BY f.createdAt DESC")
    List<Finding> findByWorkspaceId(@Param("workspaceId") Long workspaceId);

    @Query("SELECT COUNT(f) FROM Finding f JOIN f.submission s WHERE s.workspace.id = :workspaceId AND f.status = 'PENDING'")
    long countPendingFindingsByWorkspaceId(@Param("workspaceId") Long workspaceId);

    @Query("SELECT COUNT(f) FROM Finding f JOIN f.submission s WHERE s.workspace.id = :workspaceId AND f.severity = :severity AND f.status = 'PENDING'")
    long countPendingByWorkspaceIdAndSeverity(@Param("workspaceId") Long workspaceId, @Param("severity") BrandRule.Severity severity);

    @Query("SELECT f.category, COUNT(f) FROM Finding f JOIN f.submission s WHERE s.workspace.id = :workspaceId GROUP BY f.category")
    List<Object[]> countFindingsByCategory(@Param("workspaceId") Long workspaceId);
}
