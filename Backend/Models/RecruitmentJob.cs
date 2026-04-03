namespace Backend.Models;

public class RecruitmentJob
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string JobType { get; set; } = "Full-time";
    public string Priority { get; set; } = "medium";
    public string HiringManager { get; set; } = string.Empty;
    public string Salary { get; set; } = string.Empty;
    public string SkillsCsv { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ResponsibilitiesCsv { get; set; } = string.Empty;
    public DateTime PostedDate { get; set; } = DateTime.UtcNow;
    public DateTime ClosingDate { get; set; } = DateTime.UtcNow.AddDays(30);
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<RecruitmentCandidate> Candidates { get; set; } = new List<RecruitmentCandidate>();
}
