package ai.inkloom.service;

import ai.inkloom.dto.SubmissionDto;
import ai.inkloom.model.*;
import ai.inkloom.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class DataInitializerService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializerService.class);

    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMembershipRepository membershipRepository;
    private final SourceDocumentRepository sourceRepository;
    private final BrandRuleRepository brandRuleRepository;
    private final SubmissionAnalysisService submissionAnalysisService;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public DataInitializerService(
            UserRepository userRepository,
            WorkspaceRepository workspaceRepository,
            WorkspaceMembershipRepository membershipRepository,
            SourceDocumentRepository sourceRepository,
            BrandRuleRepository brandRuleRepository,
            SubmissionAnalysisService submissionAnalysisService,
            PasswordEncoder passwordEncoder,
            AuditService auditService) {
        this.userRepository = userRepository;
        this.workspaceRepository = workspaceRepository;
        this.membershipRepository = membershipRepository;
        this.sourceRepository = sourceRepository;
        this.brandRuleRepository = brandRuleRepository;
        this.submissionAnalysisService = submissionAnalysisService;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (workspaceRepository.count() > 0) {
            log.info("Inkloom database already populated with initial workspace data.");
            return;
        }

        log.info("Initializing Inkloom AI default Orbit Demo workspace and seed data...");

        // 1. Create Workspace
        Workspace workspace = new Workspace(
                "Orbit Enterprise (Fictional Demo)",
                "orbit-demo",
                "Official brand governance workspace for Orbit Suite products and editorial guidelines."
        );
        workspace = workspaceRepository.save(workspace);

        // 2. Create Seed Users
        User adminUser = new User("admin@inkloom.ai", passwordEncoder.encode("Admin@123"), "Astra System Admin", User.Role.ADMIN);
        User reviewerUser = new User("reviewer@inkloom.ai", passwordEncoder.encode("Reviewer@123"), "Elena Rostova (Lead Reviewer)", User.Role.REVIEWER);
        User creatorUser = new User("creator@inkloom.ai", passwordEncoder.encode("Creator@123"), "Devon Vance (Content Creator)", User.Role.CREATOR);
        User ownerUser = new User("owner@inkloom.ai", passwordEncoder.encode("Owner@123"), "Marcus Sterling (Brand Owner)", User.Role.SOURCE_OWNER);

        adminUser = userRepository.save(adminUser);
        reviewerUser = userRepository.save(reviewerUser);
        creatorUser = userRepository.save(creatorUser);
        ownerUser = userRepository.save(ownerUser);

        // Memberships
        membershipRepository.save(new WorkspaceMembership(adminUser, workspace, User.Role.ADMIN));
        membershipRepository.save(new WorkspaceMembership(reviewerUser, workspace, User.Role.REVIEWER));
        membershipRepository.save(new WorkspaceMembership(creatorUser, workspace, User.Role.CREATOR));
        membershipRepository.save(new WorkspaceMembership(ownerUser, workspace, User.Role.SOURCE_OWNER));

        // 3. Create Approved Sources
        // Critical requirement: Product Spec v3, Section 2.1: "Orbit Suite supports up to 500 users."
        SourceDocument specV3 = new SourceDocument(
                workspace,
                "Product Specification - Orbit Core Platform",
                "Section 2.1 (Scalability & Concurrency)",
                "v3.0.0",
                "Elena Rostova, Chief Product Officer",
                "Orbit Suite supports up to 500 users in standard high-availability deployment.",
                "Authoritative Engineering Architecture Specification v3.0. Section 2.1: The multi-tenant cluster is benchmarked to guarantee zero degraded latency up to 500 concurrent seats. Exceeding 500 seats requires dedicated enterprise sharding.",
                LocalDate.now().minusMonths(2),
                LocalDate.now().plusYears(1),
                10
        );

        SourceDocument securityDoc = new SourceDocument(
                workspace,
                "Security & Compliance Whitepaper",
                "Section 4.3 (Encryption & Transport)",
                "v2.4.1",
                "Marcus Vance, CISO",
                "Orbit Suite encrypts all data at rest using AES-256 and enforces TLS 1.3 for all transport sessions.",
                "Full security audit conducted in Q1 2026. All database volumes are encrypted with AES-256 keys rotated bi-annually.",
                LocalDate.now().minusMonths(3),
                LocalDate.now().plusMonths(9),
                8
        );

        SourceDocument slaDoc = new SourceDocument(
                workspace,
                "Global Customer SLA Guarantee",
                "Section 1.0 (Service Availability)",
                "v1.2.0",
                "DevOps Governance Council",
                "Orbit Cloud enterprise SLA guarantees 99.9% uptime per calendar month. Zero provider can claim 100% absolute guarantee.",
                "Standard SLA schedule: 99.9% availability excludes scheduled Sunday 02:00 UTC maintenance windows.",
                LocalDate.now().minusMonths(5),
                LocalDate.now().plusMonths(7),
                9
        );

        // Expired source example for verification
        SourceDocument legacySpec = new SourceDocument(
                workspace,
                "Legacy Orbit Beta Specification",
                "Section 1.0",
                "v0.9-BETA",
                "Legacy Systems Team",
                "Legacy beta supports up to 50 test users only.",
                "Historical archived document from early beta program.",
                LocalDate.now().minusYears(2),
                LocalDate.now().minusMonths(6), // EXPIRED
                1
        );

        sourceRepository.saveAll(List.of(specV3, securityDoc, slaDoc, legacySpec));

        // 4. Create Brand Rules
        BrandRule rule1 = new BrandRule(
                workspace,
                BrandRule.RuleType.APPROVED_TERMINOLOGY,
                "Orbit App",
                "Orbit Suite",
                "Official brand naming policy: Always refer to the complete product as 'Orbit Suite', not 'Orbit App' or 'Orbit Tool'.",
                BrandRule.Severity.WARNING
        );

        BrandRule rule2 = new BrandRule(
                workspace,
                BrandRule.RuleType.PROHIBITED_PHRASE,
                "guarantee 100% uptime",
                "99.9% uptime per SLA",
                "Legal compliance violation: Promising 100% uptime exposes the organization to catastrophic SLA liability. Use '99.9% uptime per SLA guarantee'.",
                BrandRule.Severity.CRITICAL
        );

        BrandRule rule3 = new BrandRule(
                workspace,
                BrandRule.RuleType.PROHIBITED_PHRASE,
                "instant magic",
                "automated intelligent validation",
                "Tone violation: Inkloom and Orbit communication must convey rigorous engineering precision, not exaggerated or deceptive claims.",
                BrandRule.Severity.WARNING
        );

        brandRuleRepository.saveAll(List.of(rule1, rule2, rule3));

        // 5. Create Initial Fictional Orbit Demo Submission and Run Pipeline
        SubmissionDto.CreateRequest demoReq = new SubmissionDto.CreateRequest();
        demoReq.setWorkspaceId(workspace.getId());
        demoReq.setTitle("Orbit Suite Q4 Product Announcement (Fictional Demo)");
        demoReq.setContentType(ContentSubmission.ContentType.TEXT_PASTE);
        demoReq.setRawContent(
                "Meet Orbit Suite. Supports up to 5,000 users with simple onboarding. " +
                "Our platform offers a guarantee 100% uptime for any organization. " +
                "Try the new Orbit App today for instant magic."
        );

        submissionAnalysisService.createAndAnalyze(demoReq, creatorUser, null);

        auditService.log(workspace, adminUser, "WORKSPACE_INITIALIZED", "Workspace", workspace.getId(),
                "Fictional Orbit demo workspace initialized with approved sources, brand rules, and demo submission.", "127.0.0.1");

        log.info("Inkloom AI initialization complete. Ready to serve at http://localhost:8080");
    }
}
