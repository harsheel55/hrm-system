using Backend.DTOs;

namespace Backend.Services;

public interface IRecruitmentService
{
    Task<List<RecruitmentJobDto>> GetJobsAsync();
    Task<List<RecruitmentCandidateDto>> GetCandidatesAsync();
    Task<RecruitmentJobDto> CreateJobAsync(CreateRecruitmentJobDto dto);
    Task<RecruitmentCandidateDto> UpdateCandidateStageAsync(Guid candidateId, string stage);
}
