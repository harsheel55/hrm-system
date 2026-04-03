using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public sealed class RecruitmentService(AppDbContext context) : IRecruitmentService
{
    private static readonly string[] PipelineStages = ["applied", "screening", "interview", "offer", "hired", "rejected"];

    public async Task<List<RecruitmentJobDto>> GetJobsAsync()
    {
        await SeedIfEmptyAsync();

        var jobs = await context.Set<RecruitmentJob>()
            .Include(j => j.Candidates)
            .Where(j => j.IsActive)
            .OrderByDescending(j => j.PostedDate)
            .ToListAsync();

        return jobs.Select(MapJob).ToList();
    }

    public async Task<List<RecruitmentCandidateDto>> GetCandidatesAsync()
    {
        await SeedIfEmptyAsync();

        var candidates = await context.Set<RecruitmentCandidate>()
            .Include(c => c.Job)
            .Where(c => c.IsActive)
            .OrderByDescending(c => c.AppliedDate)
            .ToListAsync();

        return candidates.Select(MapCandidate).ToList();
    }

    public async Task<RecruitmentJobDto> CreateJobAsync(CreateRecruitmentJobDto dto)
    {
        var now = DateTime.UtcNow;
        var job = new RecruitmentJob
        {
            Id = Guid.NewGuid(),
            Title = dto.title.Trim(),
            Department = dto.department.Trim(),
            Location = dto.location.Trim(),
            JobType = dto.type.Trim(),
            Priority = dto.priority.Trim().ToLowerInvariant(),
            HiringManager = string.IsNullOrWhiteSpace(dto.hiringManager) ? "HR Team" : dto.hiringManager.Trim(),
            Salary = dto.salary.Trim(),
            SkillsCsv = string.Join(',', dto.skills.Where(s => !string.IsNullOrWhiteSpace(s)).Select(s => s.Trim())),
            Description = dto.description.Trim(),
            ResponsibilitiesCsv = string.Join('|', dto.responsibilities.Where(r => !string.IsNullOrWhiteSpace(r)).Select(r => r.Trim())),
            PostedDate = now,
            ClosingDate = dto.closingDate?.ToUniversalTime() ?? now.AddDays(30),
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now
        };

        await context.Set<RecruitmentJob>().AddAsync(job);
        await context.SaveChangesAsync();

        var withCandidates = await context.Set<RecruitmentJob>()
            .Include(j => j.Candidates)
            .FirstAsync(j => j.Id == job.Id);

        return MapJob(withCandidates);
    }

    public async Task<RecruitmentCandidateDto> UpdateCandidateStageAsync(Guid candidateId, string stage)
    {
        var normalizedStage = stage.Trim().ToLowerInvariant();
        if (!PipelineStages.Contains(normalizedStage))
        {
            throw new InvalidOperationException("Invalid recruitment stage.");
        }

        var candidate = await context.Set<RecruitmentCandidate>()
            .Include(c => c.Job)
            .FirstOrDefaultAsync(c => c.Id == candidateId && c.IsActive);

        if (candidate is null)
        {
            throw new InvalidOperationException("Candidate not found.");
        }

        candidate.Stage = normalizedStage;
        candidate.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return MapCandidate(candidate);
    }

    private static RecruitmentJobDto MapJob(RecruitmentJob job)
    {
        var nowDate = DateTime.UtcNow.Date;
        var daysOpen = Math.Max(1, (nowDate - job.PostedDate.Date).Days);
        var candidates = job.Candidates.Where(c => c.IsActive).ToList();

        var pipeline = PipelineStages.ToDictionary(
            stage => stage,
            stage => candidates.Count(c => string.Equals(c.Stage, stage, StringComparison.OrdinalIgnoreCase))
        );

        var newApplicants = candidates.Count(c => (DateTime.UtcNow - c.AppliedDate).TotalDays <= 7);

        return new RecruitmentJobDto
        {
            id = job.Id,
            title = job.Title,
            department = job.Department,
            location = job.Location,
            type = job.JobType,
            priority = job.Priority,
            applicants = candidates.Count,
            newApplicants = newApplicants,
            daysOpen = daysOpen,
            hiringManager = job.HiringManager,
            salary = job.Salary,
            skills = SplitCsv(job.SkillsCsv),
            description = job.Description,
            responsibilities = SplitPipe(job.ResponsibilitiesCsv),
            postedDate = job.PostedDate.ToString("MMM dd, yyyy"),
            closingDate = job.ClosingDate.ToString("MMM dd, yyyy"),
            pipeline = pipeline
        };
    }

    private static RecruitmentCandidateDto MapCandidate(RecruitmentCandidate candidate)
    {
        var words = candidate.Name.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var avatar = words.Length >= 2
            ? (words[0][0].ToString() + words[1][0].ToString()).ToUpperInvariant()
            : candidate.Name[..Math.Min(2, candidate.Name.Length)].ToUpperInvariant();

        return new RecruitmentCandidateDto
        {
            id = candidate.Id,
            name = candidate.Name,
            avatar = avatar,
            role = candidate.Job?.Title ?? "Candidate",
            appliedFor = candidate.Job?.Title ?? "Unknown",
            email = candidate.Email,
            phone = candidate.Phone,
            location = candidate.Location,
            stage = candidate.Stage,
            rating = candidate.Rating,
            appliedDate = candidate.AppliedDate.ToString("MMM dd"),
            experience = candidate.Experience,
            source = candidate.Source
        };
    }

    private static List<string> SplitCsv(string value)
    {
        return value.Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(v => v.Trim())
            .Where(v => v.Length > 0)
            .ToList();
    }

    private static List<string> SplitPipe(string value)
    {
        return value.Split('|', StringSplitOptions.RemoveEmptyEntries)
            .Select(v => v.Trim())
            .Where(v => v.Length > 0)
            .ToList();
    }

    private async Task SeedIfEmptyAsync()
    {
        if (await context.Set<RecruitmentJob>().AnyAsync())
        {
            return;
        }

        var now = DateTime.UtcNow;
        var jobs = new List<RecruitmentJob>
        {
            new()
            {
                Id = Guid.Parse("a1111111-1111-1111-1111-111111111111"),
                Title = "Senior Frontend Engineer",
                Department = "Engineering",
                Location = "Remote",
                JobType = "Full-time",
                Priority = "high",
                HiringManager = "Sarah J.",
                Salary = "$120,000 - $150,000 / yr",
                SkillsCsv = "React,TypeScript,GraphQL,CSS,Testing",
                Description = "Build modern UI experiences across our HR platform.",
                ResponsibilitiesCsv = "Lead frontend architecture|Review code|Mentor engineers|Work with design",
                PostedDate = now.AddDays(-12),
                ClosingDate = now.AddDays(18)
            },
            new()
            {
                Id = Guid.Parse("a2222222-2222-2222-2222-222222222222"),
                Title = "Product Designer",
                Department = "Design",
                Location = "NYC",
                JobType = "Full-time",
                Priority = "high",
                HiringManager = "Michael C.",
                Salary = "$95,000 - $120,000 / yr",
                SkillsCsv = "Figma,User Research,Design Systems,Prototyping",
                Description = "Design intuitive product flows for web and mobile.",
                ResponsibilitiesCsv = "Run discovery|Create prototypes|Collaborate with PM and engineers",
                PostedDate = now.AddDays(-8),
                ClosingDate = now.AddDays(22)
            },
            new()
            {
                Id = Guid.Parse("a3333333-3333-3333-3333-333333333333"),
                Title = "Sales Development Rep",
                Department = "Sales",
                Location = "Remote",
                JobType = "Full-time",
                Priority = "medium",
                HiringManager = "James K.",
                Salary = "$55,000 - $70,000 + commission",
                SkillsCsv = "Prospecting,Salesforce,HubSpot,Cold Calling",
                Description = "Build and qualify top-of-funnel pipeline.",
                ResponsibilitiesCsv = "Prospect accounts|Qualify leads|Book demos",
                PostedDate = now.AddDays(-20),
                ClosingDate = now.AddDays(10)
            }
        };

        var candidates = new List<RecruitmentCandidate>
        {
            new()
            {
                Id = Guid.Parse("b1111111-1111-1111-1111-111111111111"),
                JobId = jobs[0].Id,
                Name = "Lena Fischer",
                Email = "lena@email.com",
                Phone = "+1 212 555 0101",
                Location = "Berlin, DE",
                Stage = "interview",
                Rating = 5,
                AppliedDate = now.AddDays(-10),
                Experience = "6 years",
                Source = "LinkedIn"
            },
            new()
            {
                Id = Guid.Parse("b2222222-2222-2222-2222-222222222222"),
                JobId = jobs[1].Id,
                Name = "Carlos Romero",
                Email = "carlos@email.com",
                Phone = "+1 212 555 0102",
                Location = "Madrid, ES",
                Stage = "offer",
                Rating = 5,
                AppliedDate = now.AddDays(-14),
                Experience = "5 years",
                Source = "Referral"
            },
            new()
            {
                Id = Guid.Parse("b3333333-3333-3333-3333-333333333333"),
                JobId = jobs[2].Id,
                Name = "Daniel Okafor",
                Email = "daniel@email.com",
                Phone = "+1 212 555 0109",
                Location = "Lagos, NG",
                Stage = "screening",
                Rating = 4,
                AppliedDate = now.AddDays(-6),
                Experience = "3 years",
                Source = "Indeed"
            }
        };

        await context.Set<RecruitmentJob>().AddRangeAsync(jobs);
        await context.Set<RecruitmentCandidate>().AddRangeAsync(candidates);
        await context.SaveChangesAsync();
    }
}
