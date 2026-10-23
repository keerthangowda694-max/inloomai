package ai.inkloom.controller;

import ai.inkloom.dto.DashboardStatsDto;
import ai.inkloom.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats(@RequestParam("workspaceId") Long workspaceId) {
        return ResponseEntity.ok(dashboardService.getStats(workspaceId));
    }
}
