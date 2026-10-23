package ai.inkloom;

import ai.inkloom.model.*;
import ai.inkloom.service.DeterministicGovernanceEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class DeterministicGovernanceEngineTest {

    private DeterministicGovernanceEngine engine;
    private Workspace workspace;

    @BeforeEach
    void setUp() {
        engine = new DeterministicGovernanceEngine();
        workspace = new Workspace("Orbit Enterprise", "orbit-demo", "Testing workspace");
    }

    @Test
    void testDetectNumericalClaimMismatch() {
        SourceDocument specV3 = new SourceDocument(
                workspace,
                "Product Specification - Orbit Core Platform",
                "Section 2.1",
                "v3.0",
                "Elena Rostova",
                "Orbit Suite supports up to 500 users.",
                "Full text...",
                LocalDate.now().minusMonths(1),
                LocalDate.now().plusYears(1),
                10
        );

        ContentSubmission submission = new ContentSubmission(
                workspace,
                null,
                "Test Submission",
                ContentSubmission.ContentType.TEXT_PASTE,
                "Meet Orbit Suite. Supports up to 5,000 users with simple onboarding.",
                "Meet Orbit Suite. Supports up to 5,000 users with simple onboarding.",
                null
        );

        List<Finding> findings = engine.evaluate(submission, List.of(), List.of(specV3));

        assertFalse(findings.isEmpty(), "Should detect numerical claim mismatch");
        Finding mismatch = findings.stream()
                .filter(f -> f.getCategory() == Finding.Category.CLAIM_MISMATCH)
                .findFirst()
                .orElse(null);

        assertNotNull(mismatch, "CLAIM_MISMATCH finding must be generated");
        assertEquals(BrandRule.Severity.CRITICAL, mismatch.getSeverity());
        assertTrue(mismatch.getClaimExcerpt().contains("5,000 users"));
        assertEquals("Supports up to 500 users", mismatch.getSuggestedCorrection());
        assertEquals(Finding.EvidenceStatus.VERIFIED_EVIDENCE, mismatch.getEvidenceStatus());
    }

    @Test
    void testDetectProhibitedPhraseAndTerminology() {
        BrandRule prohibitedRule = new BrandRule(
                workspace,
                BrandRule.RuleType.PROHIBITED_PHRASE,
                "guarantee 100% uptime",
                "99.9% uptime per SLA",
                "SLA liability restriction",
                BrandRule.Severity.CRITICAL
        );

        BrandRule termRule = new BrandRule(
                workspace,
                BrandRule.RuleType.APPROVED_TERMINOLOGY,
                "Orbit App",
                "Orbit Suite",
                "Brand naming policy",
                BrandRule.Severity.WARNING
        );

        ContentSubmission submission = new ContentSubmission(
                workspace,
                null,
                "Test Submission",
                ContentSubmission.ContentType.TEXT_PASTE,
                "We guarantee 100% uptime when using Orbit App.",
                "We guarantee 100% uptime when using Orbit App.",
                null
        );

        List<Finding> findings = engine.evaluate(submission, List.of(prohibitedRule, termRule), List.of());

        assertEquals(2, findings.size());
        assertTrue(findings.stream().anyMatch(f -> f.getCategory() == Finding.Category.PROHIBITED && f.getSeverity() == BrandRule.Severity.CRITICAL));
        assertTrue(findings.stream().anyMatch(f -> f.getCategory() == Finding.Category.TERMINOLOGY && f.getSeverity() == BrandRule.Severity.WARNING));
    }
}
