package ai.inkloom.controller;

import ai.inkloom.dto.BrandRuleDto;
import ai.inkloom.model.User;
import ai.inkloom.repository.UserRepository;
import ai.inkloom.service.BrandRuleService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rules")
public class BrandRuleController {

    private final BrandRuleService brandRuleService;
    private final UserRepository userRepository;

    public BrandRuleController(BrandRuleService brandRuleService, UserRepository userRepository) {
        this.brandRuleService = brandRuleService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<BrandRuleDto>> getRules(@RequestParam("workspaceId") Long workspaceId) {
        return ResponseEntity.ok(brandRuleService.getRules(workspaceId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SOURCE_OWNER')")
    public ResponseEntity<BrandRuleDto> createRule(
            @Valid @RequestBody BrandRuleDto dto,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(brandRuleService.createRule(dto, user));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SOURCE_OWNER')")
    public ResponseEntity<BrandRuleDto> updateRule(
            @PathVariable("id") Long id,
            @Valid @RequestBody BrandRuleDto dto,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(brandRuleService.updateRule(id, dto, user));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SOURCE_OWNER')")
    public ResponseEntity<Void> deleteRule(
            @PathVariable("id") Long id,
            Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        brandRuleService.deleteRule(id, user);
        return ResponseEntity.noContent().build();
    }
}
