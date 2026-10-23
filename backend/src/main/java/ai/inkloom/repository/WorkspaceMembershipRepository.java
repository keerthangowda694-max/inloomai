package ai.inkloom.repository;

import ai.inkloom.model.WorkspaceMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkspaceMembershipRepository extends JpaRepository<WorkspaceMembership, Long> {
    List<WorkspaceMembership> findByUserId(Long userId);
    List<WorkspaceMembership> findByWorkspaceId(Long workspaceId);
    Optional<WorkspaceMembership> findByUserIdAndWorkspaceId(Long userId, Long workspaceId);
}
