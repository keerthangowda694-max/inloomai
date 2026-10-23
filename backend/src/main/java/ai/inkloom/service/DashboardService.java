package ai.inkloom.service;

import ai.inkloom.dto.DashboardStatsDto;
import ai.inkloom.dto.SubmissionDto;
import ai.inkloom.model.BrandRule;
import ai.inkloom.repository.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final ContentSubmissionRepository submissionRepository;
    private final FindingRepository findingRepository;
    private final AuditService auditService;
    private final AiValidationService aiValidationService;

    public DashboardService(
            ContentSubmissionRepository submissionRepository,
            FindingRepository findingRepository,
            AuditService auditService,
            AiValidationService aiValidationService) {
        this.submissionRepository = submissionRepository;
        this.findingRepository = findingRepository;
        this.auditService = auditService;
        this.aiValidationService = aiValidationService;
    }

    public DashboardStatsDto getStats(Long workspaceId) {
        DashboardStatsDto dto = new DashboardStatsDto();

        long total = submissionRepository.countByWorkspaceId(workspaceId);
        long pending = findingRepository.countPendingFindingsByWorkspaceId(workspaceId);
        long critical = findingRepository.countPendingByWorkspaceIdAndSeverity(workspaceId, BrandRule.Severity.CRITICAL);

        dto.setTotalSubmissions(total);
        dto.setPendingReviews(pending);
        dto.setOpenFindings(pending);
        dto.setHighSeverityIssues(critical);

        List<SubmissionDto.Response> recent = submissionRepository.findTop10ByWorkspaceIdOrderByCreatedAtDesc(workspaceId)
                .stream().map(SubmissionDto.Response::new).collect(Collectors.toList());
        dto.setRecentSubmissions(recent);

        Map<String, Long> catMap = new HashMap<>();
        List<Object[]> catCounts = findingRepository.countFindingsByCategory(workspaceId);
        for (Object[] row : catCounts) {
            catMap.put(row[0].toString(), (Long) row[1]);
        }
        dto.setFindingsByCategory(catMap);

        dto.setRecentAuditLogs(auditService.getRecentLogs(workspaceId));
        dto.setAiAvailable(aiValidationService.isAiConfigured());
        dto.setSystemHealth(aiValidationService.isAiConfigured()
                ? "Operational - Hybrid Deterministic & AI Validation Active"
                : "Operational - High-Precision Deterministic Engine Active");

        return dto;
    }
}
