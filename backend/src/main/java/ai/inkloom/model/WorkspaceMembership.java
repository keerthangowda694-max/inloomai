package ai.inkloom.model;

import jakarta.persistence.*;

@Entity
@Table(name = "workspace_memberships",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "workspace_id"}))
public class WorkspaceMembership {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private User.Role roleInWorkspace;

    public WorkspaceMembership() {}

    public WorkspaceMembership(User user, Workspace workspace, User.Role roleInWorkspace) {
        this.user = user;
        this.workspace = workspace;
        this.roleInWorkspace = roleInWorkspace;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Workspace getWorkspace() { return workspace; }
    public void setWorkspace(Workspace workspace) { this.workspace = workspace; }

    public User.Role getRoleInWorkspace() { return roleInWorkspace; }
    public void setRoleInWorkspace(User.Role roleInWorkspace) { this.roleInWorkspace = roleInWorkspace; }
}
