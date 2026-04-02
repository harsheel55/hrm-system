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
    public async Task<ActionResult<ApiResponse<LeaveDashboardDto>>> GetDashboard()
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

        var dashboard = await leaveService.GetDashboardAsync(email);
        return Ok(new ApiResponse<LeaveDashboardDto>
        {
            statusCode = 200,
            message = "Leave dashboard fetched successfully",
            data = dashboard
        });
    }

    [HttpPost("requests")]
    public async Task<ActionResult<ApiResponse<LeaveRequestDto>>> CreateRequest([FromBody] CreateLeaveRequestDto dto)
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
            var request = await leaveService.CreateRequestAsync(email, dto);
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

    [HttpGet("requests/all")]
    public async Task<ActionResult<ApiResponse<IEnumerable<LeaveRequestDto>>>> GetAllRequests()
    {
        var requests = await leaveService.GetAllRequestsAsync();
        return Ok(new ApiResponse<IEnumerable<LeaveRequestDto>>
        {
            statusCode = 200,
            message = "All leave requests fetched successfully",
            data = requests
        });
    }

    [HttpPut("requests/{id}/approve")]
    public async Task<ActionResult<ApiResponse<LeaveRequestDto>>> ApproveRequest(Guid id)
    {
        try
        {
            var request = await leaveService.UpdateStatusAsync(id, "approved");
            return Ok(new ApiResponse<LeaveRequestDto>
            {
                statusCode = 200,
                message = "Leave approved successfully",
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

    [HttpPut("requests/{id}/reject")]
    public async Task<ActionResult<ApiResponse<LeaveRequestDto>>> RejectRequest(Guid id)
    {
        try
        {
            var request = await leaveService.UpdateStatusAsync(id, "rejected");
            return Ok(new ApiResponse<LeaveRequestDto>
            {
                statusCode = 200,
                message = "Leave rejected successfully",
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
