namespace Backend.DTOs;

public sealed class RecruitmentJobDto
{
    public Guid id { get; set; }
    public string title { get; set; } = string.Empty;
    public string department { get; set; } = string.Empty;
    public string location { get; set; } = string.Empty;
    public string type { get; set; } = string.Empty;
    public string priority { get; set; } = string.Empty;
    public int applicants { get; set; }
    public int newApplicants { get; set; }
    public int daysOpen { get; set; }
    public string hiringManager { get; set; } = string.Empty;
    public string salary { get; set; } = string.Empty;
    public List<string> skills { get; set; } = new();
    public string description { get; set; } = string.Empty;
    public List<string> responsibilities { get; set; } = new();
    public string postedDate { get; set; } = string.Empty;
    public string closingDate { get; set; } = string.Empty;
    public Dictionary<string, int> pipeline { get; set; } = new();
}

public sealed class RecruitmentCandidateDto
{
    public Guid id { get; set; }
    public string name { get; set; } = string.Empty;
    public string avatar { get; set; } = string.Empty;
    public string role { get; set; } = string.Empty;
    public string appliedFor { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
    public string phone { get; set; } = string.Empty;
    public string location { get; set; } = string.Empty;
    public string stage { get; set; } = string.Empty;
    public int rating { get; set; }
    public string appliedDate { get; set; } = string.Empty;
    public string experience { get; set; } = string.Empty;
    public string source { get; set; } = string.Empty;
}

public sealed class CreateRecruitmentJobDto
{
    public string title { get; set; } = string.Empty;
    public string department { get; set; } = string.Empty;
    public string location { get; set; } = string.Empty;
    public string type { get; set; } = "Full-time";
    public string priority { get; set; } = "medium";
    public string hiringManager { get; set; } = string.Empty;
    public string salary { get; set; } = string.Empty;
    public List<string> skills { get; set; } = new();
    public string description { get; set; } = string.Empty;
    public List<string> responsibilities { get; set; } = new();
    public DateTime? closingDate { get; set; }
}

public sealed class UpdateCandidateStageDto
{
    public string stage { get; set; } = string.Empty;
}
