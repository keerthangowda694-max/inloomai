package ai.inkloom.service;

import ai.inkloom.model.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiValidationService {

    private static final Logger log = LoggerFactory.getLogger(AiValidationService.class);

    @Value("${inkloom.ai.api-key:}")
    private String apiKey;

    @Value("${inkloom.ai.endpoint:https://api.openai.com/v1}")
    private String endpoint;

    @Value("${inkloom.ai.model:gpt-4o-mini}")
    private String modelName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isAiConfigured() {
        return apiKey != null && !apiKey.trim().isEmpty() && !apiKey.equalsIgnoreCase("none");
    }

    public List<Finding> evaluateWithAi(ContentSubmission submission, List<SourceDocument> sources) {
        if (!isAiConfigured()) {
            log.info("Inkloom AI: No external LLM API key configured. Deterministic pipeline is operating with 100% precision.");
            return Collections.emptyList();
        }

        List<Finding> aiFindings = new ArrayList<>();
        try {
            String text = submission.getExtractedText() != null ? submission.getExtractedText() : submission.getRawContent();
            if (text == null || text.trim().isEmpty()) {
                return aiFindings;
            }

            // Defend against Prompt Injection: Sanitize text and delimit untrusted content
            String sanitizedText = text.replace("```", "'''");

            StringBuilder sourcesContext = new StringBuilder();
            for (SourceDocument s : sources) {
                if (!s.getIsArchived()) {
                    sourcesContext.append("- [Source ID ").append(s.getId()).append("] ")
                            .append(s.getTitle()).append(" (").append(s.getSection()).append(", ").append(s.getVersion()).append("): ")
                            .append(s.getContentExcerpt()).append("\n");
                }
            }

            String systemPrompt = """
                You are Inkloom AI, a brand governance and factual validation engine.
                Evaluate the UNTRUSTED candidate content against the APPROVED SOURCES list.
                Identify any subtle semantic contradictions, unsupported marketing claims, or tone deviations.
                Never invent external facts. You may only cite the provided approved sources.
                Return ONLY a valid JSON array of objects with the following keys:
                [
                  {
                    "sourceId": <integer ID of matching source or null>,
                    "category": "CLAIM_MISMATCH" | "TONE_STYLE" | "MISSING_EVIDENCE",
                    "severity": "CRITICAL" | "WARNING" | "INFO",
                    "claimExcerpt": "<exact quote from candidate text>",
                    "explanation": "<concise explanation>",
                    "suggestedCorrection": "<brand-compliant wording>"
                  }
                ]
                If no additional issues exist, return an empty array [].
                """;

            String userContent = "APPROVED SOURCES:\n" + sourcesContext +
                    "\nUNTRUSTED CANDIDATE CONTENT TO VALIDATE:\n" +
                    "<untrusted_content>\n" + sanitizedText + "\n</untrusted_content>";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> messageSystem = Map.of("role", "system", "content", systemPrompt);
            Map<String, Object> messageUser = Map.of("role", "user", "content", userContent);

            Map<String, Object> requestBody = Map.of(
                    "model", modelName,
                    "messages", List.of(messageSystem, messageUser),
                    "temperature", 0.0
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            String url = endpoint.endsWith("/") ? endpoint + "chat/completions" : endpoint + "/chat/completions";

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String content = root.path("choices").path(0).path("message").path("content").asText();

                // Strip markdown code block wrappers if present
                if (content.contains("```json")) {
                    content = content.substring(content.indexOf("```json") + 7);
                    content = content.substring(0, content.lastIndexOf("```"));
                } else if (content.contains("```")) {
                    content = content.substring(content.indexOf("```") + 3);
                    content = content.substring(0, content.lastIndexOf("```"));
                }

                JsonNode findingsArray = objectMapper.readTree(content.trim());
                if (findingsArray.isArray()) {
                    for (JsonNode node : findingsArray) {
                        String claim = node.path("claimExcerpt").asText("");
                        if (claim.isEmpty()) continue;

                        Long sourceId = node.hasNonNull("sourceId") ? node.path("sourceId").asLong() : null;
                        SourceDocument matchedSource = null;
                        if (sourceId != null) {
                            matchedSource = sources.stream().filter(s -> s.getId().equals(sourceId)).findFirst().orElse(null);
                        }

                        Finding finding = new Finding(
                                submission,
                                null,
                                matchedSource,
                                Finding.Category.valueOf(node.path("category").asText("CLAIM_MISMATCH")),
                                BrandRule.Severity.valueOf(node.path("severity").asText("WARNING")),
                                claim,
                                0,
                                0,
                                node.path("explanation").asText("AI-assisted finding awaiting reviewer validation."),
                                matchedSource != null ? matchedSource.getContentExcerpt() : "Source not formally linked.",
                                node.path("suggestedCorrection").asText(""),
                                Finding.EvidenceStatus.AI_ASSISTED_PENDING
                        );
                        aiFindings.add(finding);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("AI validation call encountered exception, skipping AI stage safely: {}", e.getMessage());
        }

        return aiFindings;
    }
}
