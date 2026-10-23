package ai.inkloom.service;

import ai.inkloom.dto.SourceDocumentDto;
import ai.inkloom.model.*;
import ai.inkloom.repository.SourceDocumentRepository;
import ai.inkloom.repository.WorkspaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SourceGovernanceService {

    private final SourceDocumentRepository sourceRepository;
    private final WorkspaceRepository workspaceRepository;
    private final AuditService auditService;

    public SourceGovernanceService(
            SourceDocumentRepository sourceRepository,
            WorkspaceRepository workspaceRepository,
            AuditService auditService) {
        this.sourceRepository = sourceRepository;
        this.workspaceRepository = workspaceRepository;
        this.auditService = auditService;
    }

    public List<SourceDocumentDto> getSources(Long workspaceId) {
        return sourceRepository.findByWorkspaceIdAndIsArchivedFalseOrderByPriorityDesc(workspaceId)
                .stream().map(SourceDocumentDto::new).collect(Collectors.toList());
    }

    @Transactional
    public SourceDocumentDto createSource(SourceDocumentDto dto, User user) {
        Workspace workspace = workspaceRepository.findById(dto.getWorkspaceId())
                .orElseThrow(() -> new IllegalArgumentException("Workspace not found: " + dto.getWorkspaceId()));

        SourceDocument source = new SourceDocument(
                workspace,
                dto.getTitle(),
                dto.getSection(),
                dto.getVersion(),
                dto.getOwnerName(),
                dto.getContentExcerpt(),
                dto.getFullText(),
                dto.getReviewDate(),
                dto.getExpiryDate(),
                dto.getPriority()
        );

        source = sourceRepository.save(source);
        auditService.log(workspace, user, "SOURCE_CREATED", "SourceDocument", source.getId(),
                "Created source '" + source.getTitle() + "' version " + source.getVersion(), null);

        return new SourceDocumentDto(source);
    }

    @Transactional
    public SourceDocumentDto updateSource(Long id, SourceDocumentDto dto, User user) {
        SourceDocument source = sourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Source not found: " + id));

        source.setTitle(dto.getTitle());
        source.setSection(dto.getSection());
        source.setVersion(dto.getVersion());
        source.setOwnerName(dto.getOwnerName());
        source.setContentExcerpt(dto.getContentExcerpt());
        source.setFullText(dto.getFullText());
        source.setReviewDate(dto.getReviewDate());
        source.setExpiryDate(dto.getExpiryDate());
        if (dto.getPriority() != null) source.setPriority(dto.getPriority());
        if (dto.getIsArchived() != null) source.setIsArchived(dto.getIsArchived());

        source = sourceRepository.save(source);
        auditService.log(source.getWorkspace(), user, "SOURCE_UPDATED", "SourceDocument", source.getId(),
                "Updated source '" + source.getTitle() + "' to version " + source.getVersion(), null);

        return new SourceDocumentDto(source);
    }

    @Transactional
    public void archiveSource(Long id, User user) {
        SourceDocument source = sourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Source not found: " + id));
        source.setIsArchived(true);
        sourceRepository.save(source);

        auditService.log(source.getWorkspace(), user, "SOURCE_ARCHIVED", "SourceDocument", source.getId(),
                "Archived source '" + source.getTitle() + "'", null);
    }
}
