package ai.inkloom.dto;

public class WorkspaceDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String userRole;

    public WorkspaceDto() {}

    public WorkspaceDto(Long id, String name, String slug, String description, String userRole) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.userRole = userRole;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
}
