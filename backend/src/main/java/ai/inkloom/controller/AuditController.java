package ai.inkloom.controller;

import ai.inkloom.dto.AuditLogDto;
import ai.inkloom.service.AuditService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<List<AuditLogDto>> getAuditLogs(@RequestParam("workspaceId") Long workspaceId) {
        return ResponseEntity.ok(auditService.getRecentLogs(workspaceId));
    }
}
