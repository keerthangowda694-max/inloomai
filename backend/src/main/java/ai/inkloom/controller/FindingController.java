package ai.inkloom.controller;

import ai.inkloom.dto.FindingDto;
import ai.inkloom.model.Finding;
import ai.inkloom.repository.FindingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class FindingController {

    private final FindingRepository findingRepository;

    public FindingController(FindingRepository findingRepository) {
        this.findingRepository = findingRepository;
    }

    @GetMapping("/submissions/{id}/findings")
    public ResponseEntity<List<FindingDto>> getFindingsBySubmission(@PathVariable("id") Long submissionId) {
        List<Finding> findings = findingRepository.findBySubmissionIdOrderByIdAsc(submissionId);
        return ResponseEntity.ok(findings.stream().map(FindingDto::new).collect(Collectors.toList()));
    }

    @GetMapping("/findings")
    public ResponseEntity<List<FindingDto>> getAllFindings(@RequestParam("workspaceId") Long workspaceId) {
        List<Finding> findings = findingRepository.findByWorkspaceId(workspaceId);
        return ResponseEntity.ok(findings.stream().map(FindingDto::new).collect(Collectors.toList()));
    }

    @GetMapping("/findings/{id}")
    public ResponseEntity<FindingDto> getFindingById(@PathVariable("id") Long id) {
        Finding finding = findingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Finding not found: " + id));
        return ResponseEntity.ok(new FindingDto(finding));
    }
}
