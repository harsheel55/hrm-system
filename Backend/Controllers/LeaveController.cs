using System.Security.Claims;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class LeaveController(ILeaveService leaveService) : ControllerBase
{
    [HttpGet("dashboard")]
    public ActionResult<ApiResponse<LeaveDashboardDto>> GetDashboard()
    {
        var email = ResolveEmail();
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new ApiResponse<LeaveDashboardDto>
            {
                statusCode = 401,
                message = "Unauthorized",
                data = null
            });
        }

        var dashboard = leaveService.GetDashboard(email);
        return Ok(new ApiResponse<LeaveDashboardDto>
        {
            statusCode = 200,
            message = "Leave dashboard fetched successfully",
            data = dashboard
        });
    }

    [HttpPost("requests")]
    public ActionResult<ApiResponse<LeaveRequestDto>> CreateRequest([FromBody] CreateLeaveRequestDto dto)
    {
        var email = ResolveEmail();
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new ApiResponse<LeaveRequestDto>
            {
                statusCode = 401,
                message = "Unauthorized",
                data = null
            });
        }

        try
        {
            var request = leaveService.CreateRequest(email, dto);
            return Ok(new ApiResponse<LeaveRequestDto>
            {
                statusCode = 200,
                message = "Leave request submitted successfully",
                data = request
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<LeaveRequestDto>
            {
                statusCode = 400,
                message = ex.Message,
                data = null
            });
        }
    }

    private string ResolveEmail()
    {
        return User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    }
}
