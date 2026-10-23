package ai.inkloom.repository;

import ai.inkloom.model.BrandRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BrandRuleRepository extends JpaRepository<BrandRule, Long> {
    List<BrandRule> findByWorkspaceIdAndIsActiveTrue(Long workspaceId);
    List<BrandRule> findByWorkspaceId(Long workspaceId);
}
