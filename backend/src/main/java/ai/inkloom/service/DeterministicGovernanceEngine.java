package ai.inkloom.service;

import ai.inkloom.model.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class DeterministicGovernanceEngine {

    public List<Finding> evaluate(ContentSubmission submission,
                                 List<BrandRule> activeRules,
                                 List<SourceDocument> activeSources) {
        List<Finding> findings = new ArrayList<>();
        String text = submission.getExtractedText() != null ? submission.getExtractedText() : submission.getRawContent();
        if (text == null || text.trim().isEmpty()) {
            return findings;
        }

        // 1. Check Brand Rules (Prohibited Phrases & Terminology)
        for (BrandRule rule : activeRules) {
            String phrase = rule.getTargetPhrase();
            if (phrase == null || phrase.trim().isEmpty()) continue;

            Pattern pattern = Pattern.compile("(?i)\\b" + Pattern.quote(phrase.trim()) + "\\b");
            Matcher matcher = pattern.matcher(text);

            while (matcher.find()) {
                int start = matcher.start();
                int end = matcher.end();
                String matchedText = text.substring(start, end);

                Finding.Category category = (rule.getRuleType() == BrandRule.RuleType.PROHIBITED_PHRASE)
                        ? Finding.Category.PROHIBITED
                        : Finding.Category.TERMINOLOGY;

                String explanation = (rule.getRuleType() == BrandRule.RuleType.PROHIBITED_PHRASE)
                        ? "Prohibited phrasing detected: '" + matchedText + "'. Compliance note: " + (rule.getContextGuideline() != null ? rule.getContextGuideline() : "Violates brand communication standards.")
                        : "Approved terminology required: use '" + rule.getApprovedAlternative() + "' instead of '" + matchedText + "'.";

                Finding finding = new Finding(
                        submission,
                        rule,
                        null,
                        category,
                        rule.getSeverity(),
                        matchedText,
                        start,
                        end,
                        explanation,
                        rule.getContextGuideline(),
                        rule.getApprovedAlternative(),
                        Finding.EvidenceStatus.VERIFIED_EVIDENCE
                );
                findings.add(finding);
            }
        }

        // 2. Check Specific Numerical Claims against Approved Source Documents
        // Spec 1: Orbit Suite User Capacity (Authoritative: up to 500 users)
        for (SourceDocument source : activeSources) {
            // Check for capacity / user scale mismatches
            if (source.getTitle() != null && source.getTitle().toLowerCase().contains("spec")) {
                Pattern userConflictPattern = Pattern.compile("(?i)(supports?\\s+up\\s+to|capacity\\s+of|handles?|scaled?\\s+for)\\s+([0-9,]+)\\s+users?");
                Matcher matcher = userConflictPattern.matcher(text);

                while (matcher.find()) {
                    String fullMatch = matcher.group(0);
                    String numberStr = matcher.group(2).replace(",", "");
                    try {
                        long claimedUsers = Long.parseLong(numberStr);
                        if (claimedUsers > 500) {
                            Finding finding = new Finding(
                                    submission,
                                    null,
                                    source,
                                    Finding.Category.CLAIM_MISMATCH,
                                    BrandRule.Severity.CRITICAL,
                                    fullMatch,
                                    matcher.start(),
                                    matcher.end(),
                                    "Numerical claim mismatch: Document claims support for " + matcher.group(2) + " users, whereas authoritative " + source.getTitle() + " (" + source.getSection() + ") specifies a certified maximum of 500 users.",
                                    source.getContentExcerpt(),
                                    matcher.group(1) + " 500 users",
                                    source.isExpired() ? Finding.EvidenceStatus.EXPIRED_SOURCE : Finding.EvidenceStatus.VERIFIED_EVIDENCE
                            );
                            findings.add(finding);
                        }
                    } catch (NumberFormatException ignored) {}
                }
            }

            // Check for source expiration alerts
            if (source.isExpired()) {
                // If text references expired source title
                if (text.toLowerCase().contains(source.getTitle().toLowerCase())) {
                    Finding finding = new Finding(
                            submission,
                            null,
                            source,
                            Finding.Category.SOURCE_EXPIRED,
                            BrandRule.Severity.WARNING,
                            source.getTitle(),
                            0,
                            0,
                            "Referenced source document '" + source.getTitle() + "' expired on " + source.getExpiryDate() + ". Evidence must be re-verified by source owner (" + source.getOwnerName() + ").",
                            source.getContentExcerpt(),
                            "Update reference to latest active specification",
                            Finding.EvidenceStatus.EXPIRED_SOURCE
                    );
                    findings.add(finding);
                }
            }
        }

        // 3. Check for unsubstantiated superlative claims (Missing Evidence)
        Pattern missingEvidencePattern = Pattern.compile("(?i)\\b(industry fastest|proven to double sales|zero failure rate|flawless accuracy|100% bug-free)\\b");
        Matcher missingMatcher = missingEvidencePattern.matcher(text);
        while (missingMatcher.find()) {
            Finding finding = new Finding(
                    submission,
                    null,
                    null,
                    Finding.Category.MISSING_EVIDENCE,
                    BrandRule.Severity.WARNING,
                    missingMatcher.group(0),
                    missingMatcher.start(),
                    missingMatcher.end(),
                    "Unsubstantiated performance claim: '" + missingMatcher.group(0) + "' lacks an approved factual reference in the source repository.",
                    "No approved corporate source confirms this superlative claim.",
                    "Qualify statement with benchmark context or remove assertion",
                    Finding.EvidenceStatus.MISSING_EVIDENCE
            );
            findings.add(finding);
        }

        return findings;
    }
}
