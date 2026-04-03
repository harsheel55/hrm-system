namespace Backend.Models;

public class RecruitmentCandidate
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid JobId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Stage { get; set; } = "applied";
    public int Rating { get; set; } = 3;
    public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
    public string Experience { get; set; } = string.Empty;
    public string Source { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public RecruitmentJob? Job { get; set; }
}
