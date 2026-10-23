package ai.inkloom.controller;

import ai.inkloom.dto.AuthDto;
import ai.inkloom.dto.WorkspaceDto;
import ai.inkloom.model.User;
import ai.inkloom.model.WorkspaceMembership;
import ai.inkloom.repository.UserRepository;
import ai.inkloom.repository.WorkspaceMembershipRepository;
import ai.inkloom.security.JwtTokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final WorkspaceMembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            UserRepository userRepository,
            WorkspaceMembershipRepository membershipRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@Valid @RequestBody AuthDto.LoginRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + req.getEmail()));

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole().name(), user.getId());

        List<WorkspaceMembership> memberships = membershipRepository.findByUserId(user.getId());
        WorkspaceDto defaultWs = null;
        if (!memberships.isEmpty()) {
            WorkspaceMembership m = memberships.get(0);
            defaultWs = new WorkspaceDto(
                    m.getWorkspace().getId(),
                    m.getWorkspace().getName(),
                    m.getWorkspace().getSlug(),
                    m.getWorkspace().getDescription(),
                    m.getRoleInWorkspace().name()
            );
        }

        AuthDto.UserDto userDto = new AuthDto.UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole().name());
        return ResponseEntity.ok(new AuthDto.AuthResponse(token, userDto, defaultWs));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthDto.RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered: " + req.getEmail());
        }

        User user = new User(
                req.getEmail(),
                passwordEncoder.encode(req.getPassword()),
                req.getFullName(),
                req.getRole() != null ? req.getRole() : User.Role.CREATOR
        );
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully.");
    }

    @GetMapping("/me")
    public ResponseEntity<AuthDto.UserDto> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(new AuthDto.UserDto(user.getId(), user.getEmail(), user.getFullName(), user.getRole().name()));
    }
}
