package ai.inkloom.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalSubmissions;
    private long pendingReviews;
    private long openFindings;
    private long highSeverityIssues;
    private List<SubmissionDto.Response> recentSubmissions;
    private Map<String, Long> findingsByCategory;
    private List<AuditLogDto> recentAuditLogs;
    private String systemHealth;
    private boolean aiAvailable;

    public DashboardStatsDto() {}

    public long getTotalSubmissions() { return totalSubmissions; }
    public void setTotalSubmissions(long totalSubmissions) { this.totalSubmissions = totalSubmissions; }

    public long getPendingReviews() { return pendingReviews; }
    public void setPendingReviews(long pendingReviews) { this.pendingReviews = pendingReviews; }

    public long getOpenFindings() { return openFindings; }
    public void setOpenFindings(long openFindings) { this.openFindings = openFindings; }

    public long getHighSeverityIssues() { return highSeverityIssues; }
    public void setHighSeverityIssues(long highSeverityIssues) { this.highSeverityIssues = highSeverityIssues; }

    public List<SubmissionDto.Response> getRecentSubmissions() { return recentSubmissions; }
    public void setRecentSubmissions(List<SubmissionDto.Response> recentSubmissions) { this.recentSubmissions = recentSubmissions; }

    public Map<String, Long> getFindingsByCategory() { return findingsByCategory; }
    public void setFindingsByCategory(Map<String, Long> findingsByCategory) { this.findingsByCategory = findingsByCategory; }

    public List<AuditLogDto> getRecentAuditLogs() { return recentAuditLogs; }
    public void setRecentAuditLogs(List<AuditLogDto> recentAuditLogs) { this.recentAuditLogs = recentAuditLogs; }

    public String getSystemHealth() { return systemHealth; }
    public void setSystemHealth(String systemHealth) { this.systemHealth = systemHealth; }

    public boolean isAiAvailable() { return aiAvailable; }
    public void setAiAvailable(boolean aiAvailable) { this.aiAvailable = aiAvailable; }
}
