package ai.inkloom.service;

import ai.inkloom.dto.BrandRuleDto;
import ai.inkloom.model.*;
import ai.inkloom.repository.BrandRuleRepository;
import ai.inkloom.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandRuleService {

    private final BrandRuleRepository brandRuleRepository;
    private final WorkspaceRepository workspaceRepository;
    private final AuditService auditService;

    public BrandRuleService(
            BrandRuleRepository brandRuleRepository,
            WorkspaceRepository workspaceRepository,
            AuditService auditService) {
        this.brandRuleRepository = brandRuleRepository;
        this.workspaceRepository = workspaceRepository;
        this.auditService = auditService;
    }

    public List<BrandRuleDto> getRules(Long workspaceId) {
        return brandRuleRepository.findByWorkspaceId(workspaceId)
                .stream().map(BrandRuleDto::new).collect(Collectors.toList());
    }

    @Transactional
    public BrandRuleDto createRule(BrandRuleDto dto, User user) {
        Workspace workspace = workspaceRepository.findById(dto.getWorkspaceId())
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found: " + dto.getWorkspaceId()));

        BrandRule rule = new BrandRule(
                workspace,
                dto.getRuleType(),
                dto.getTargetPhrase(),
                dto.getApprovedAlternative(),
                dto.getContextGuideline(),
                dto.getSeverity()
        );

        rule = brandRuleRepository.save(rule);
        auditService.log(workspace, user, "RULE_CREATED", "BrandRule", rule.getId(),
                "Created rule for target phrase '" + rule.getTargetPhrase() + "'", null);

        return new BrandRuleDto(rule);
    }

    @Transactional
    public BrandRuleDto updateRule(Long id, BrandRuleDto dto, User user) {
        BrandRule rule = brandRuleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rule not found: " + id));

        rule.setRuleType(dto.getRuleType());
        rule.setTargetPhrase(dto.getTargetPhrase());
        rule.setApprovedAlternative(dto.getApprovedAlternative());
        rule.setContextGuideline(dto.getContextGuideline());
        rule.setSeverity(dto.getSeverity());
        if (dto.getIsActive() != null) rule.setIsActive(dto.getIsActive());

        rule = brandRuleRepository.save(rule);
        auditService.log(rule.getWorkspace(), user, "RULE_UPDATED", "BrandRule", rule.getId(),
                "Updated rule '" + rule.getTargetPhrase() + "'", null);

        return new BrandRuleDto(rule);
    }

    @Transactional
    public void deleteRule(Long id, User user) {
        BrandRule rule = brandRuleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Rule not found: " + id));

        brandRuleRepository.delete(rule);
        auditService.log(rule.getWorkspace(), user, "RULE_DELETED", "BrandRule", id,
                "Deleted rule '" + rule.getTargetPhrase() + "'", null);
    }
}
