package ai.inkloom.controller;

import ai.inkloom.dto.WorkspaceDto;
import ai.inkloom.model.User;
import ai.inkloom.model.Workspace;
import ai.inkloom.model.WorkspaceMembership;
import ai.inkloom.repository.UserRepository;
import ai.inkloom.repository.WorkspaceMembershipRepository;
import ai.inkloom.repository.WorkspaceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workspaces")
public class WorkspaceController {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMembershipRepository membershipRepository;
    private final UserRepository userRepository;

    public WorkspaceController(
            WorkspaceRepository workspaceRepository,
            WorkspaceMembershipRepository membershipRepository,
            UserRepository userRepository) {
        this.workspaceRepository = workspaceRepository;
        this.membershipRepository = membershipRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<WorkspaceDto>> getUserWorkspaces(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<WorkspaceMembership> memberships = membershipRepository.findByUserId(user.getId());
        List<WorkspaceDto> list = memberships.stream().map(m -> new WorkspaceDto(
                m.getWorkspace().getId(),
                m.getWorkspace().getName(),
                m.getWorkspace().getSlug(),
                m.getWorkspace().getDescription(),
                m.getRoleInWorkspace().name()
        )).collect(Collectors.toList());

        // If user has no specific membership yet, provide first workspace
        if (list.isEmpty()) {
            List<Workspace> all = workspaceRepository.findAll();
            if (!all.isEmpty()) {
                Workspace first = all.get(0);
                list.add(new WorkspaceDto(first.getId(), first.getName(), first.getSlug(), first.getDescription(), user.getRole().name()));
            }
        }

        return ResponseEntity.ok(list);
    }
}
