using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class RecruitmentController(IRecruitmentService recruitmentService) : ControllerBase
{
    [HttpGet("jobs")]
    public async Task<ActionResult<ApiResponse<List<RecruitmentJobDto>>>> GetJobs()
    {
        var jobs = await recruitmentService.GetJobsAsync();
        return Ok(new ApiResponse<List<RecruitmentJobDto>>
        {
            statusCode = 200,
            message = "Recruitment jobs fetched successfully",
            data = jobs
        });
    }

    [HttpGet("candidates")]
    public async Task<ActionResult<ApiResponse<List<RecruitmentCandidateDto>>>> GetCandidates()
    {
        var candidates = await recruitmentService.GetCandidatesAsync();
        return Ok(new ApiResponse<List<RecruitmentCandidateDto>>
        {
            statusCode = 200,
            message = "Recruitment candidates fetched successfully",
            data = candidates
        });
    }

    [HttpPost("jobs")]
    [Authorize(Roles = "Super Admin,Administrator,Admin,HR")]
    public async Task<ActionResult<ApiResponse<RecruitmentJobDto>>> CreateJob([FromBody] CreateRecruitmentJobDto dto)
    {
        try
        {
            var job = await recruitmentService.CreateJobAsync(dto);
            return Ok(new ApiResponse<RecruitmentJobDto>
            {
                statusCode = 200,
                message = "Recruitment job created successfully",
                data = job
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<RecruitmentJobDto>
            {
                statusCode = 400,
                message = ex.Message,
                data = null
            });
        }
    }

    [HttpPut("candidates/{id:guid}/stage")]
    [Authorize(Roles = "Super Admin,Administrator,Admin,HR")]
    public async Task<ActionResult<ApiResponse<RecruitmentCandidateDto>>> UpdateCandidateStage(Guid id, [FromBody] UpdateCandidateStageDto dto)
    {
        try
        {
            var candidate = await recruitmentService.UpdateCandidateStageAsync(id, dto.stage);
            return Ok(new ApiResponse<RecruitmentCandidateDto>
            {
                statusCode = 200,
                message = "Candidate stage updated successfully",
                data = candidate
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<RecruitmentCandidateDto>
            {
                statusCode = 400,
                message = ex.Message,
                data = null
            });
        }
    }
}
