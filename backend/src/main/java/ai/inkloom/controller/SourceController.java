package ai.inkloom.controller;

import ai.inkloom.dto.SourceDocumentDto;
import ai.inkloom.model.User;
import ai.inkloom.repository.UserRepository;
import ai.inkloom.service.SourceGovernanceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sources")
public class SourceController {

    private final SourceGovernanceService sourceService;
    private final UserRepository userRepository;

    public SourceController(SourceGovernanceService sourceService, UserRepository userRepository) {
        this.sourceService = sourceService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<SourceDocumentDto>> getSources(@RequestParam("workspaceId") Long workspaceId) {
        return ResponseEntity.ok(sourceService.getSources(workspaceId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SOURCE_OWNER')")
    public ResponseEntity<SourceDocumentDto> createSource(
            @Valid @RequestBody SourceDocumentDto dto,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(sourceService.createSource(dto, user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SOURCE_OWNER')")
    public ResponseEntity<SourceDocumentDto> updateSource(
            @PathVariable("id") Long id,
            @Valid @RequestBody SourceDocumentDto dto,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(sourceService.updateSource(id, dto, user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SOURCE_OWNER')")
    public ResponseEntity<Void> archiveSource(
            @PathVariable("id") Long id,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        sourceService.archiveSource(id, user);
        return ResponseEntity.noContent().build();
    }
}
