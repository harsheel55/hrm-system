using System.Security.Claims;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class AttendanceController(IAttendanceService attendanceService) : ControllerBase
{
    [HttpGet("dashboard")]
    public ActionResult<ApiResponse<AttendanceDashboardDto>> GetDashboard([FromQuery] AttendanceQueryDto query)
    {
        var email = ResolveEmail();
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new ApiResponse<AttendanceDashboardDto>
            {
                statusCode = 401,
                message = "Unauthorized",
                data = null
            });
        }

        var dashboard = attendanceService.GetDashboard(email, query);
        return Ok(new ApiResponse<AttendanceDashboardDto>
        {
            statusCode = 200,
            message = "Attendance dashboard fetched successfully",
            data = dashboard
        });
    }

    [HttpGet("me/today")]
    public ActionResult<ApiResponse<AttendanceClockDto>> GetTodayClock()
    {
        var email = ResolveEmail();
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new ApiResponse<AttendanceClockDto>
            {
                statusCode = 401,
                message = "Unauthorized",
                data = null
            });
        }

        var clock = attendanceService.GetTodayClock(email);
        return Ok(new ApiResponse<AttendanceClockDto>
        {
            statusCode = 200,
            message = "Today's attendance fetched successfully",
            data = clock
        });
    }

    [HttpPost("check-in")]
    public ActionResult<ApiResponse<AttendanceClockDto>> CheckIn()
    {
        var email = ResolveEmail();
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new ApiResponse<AttendanceClockDto>
            {
                statusCode = 401,
                message = "Unauthorized",
                data = null
            });
        }

        try
        {
            var result = attendanceService.CheckIn(email);
            return Ok(new ApiResponse<AttendanceClockDto>
            {
                statusCode = 200,
                message = "Checked in successfully",
                data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<AttendanceClockDto>
            {
                statusCode = 400,
                message = ex.Message,
                data = null
            });
        }
    }

    [HttpPost("check-out")]
    public ActionResult<ApiResponse<AttendanceClockDto>> CheckOut()
    {
        var email = ResolveEmail();
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new ApiResponse<AttendanceClockDto>
            {
                statusCode = 401,
                message = "Unauthorized",
                data = null
            });
        }

        try
        {
            var result = attendanceService.CheckOut(email);
            return Ok(new ApiResponse<AttendanceClockDto>
            {
                statusCode = 200,
                message = "Checked out successfully",
                data = result
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponse<AttendanceClockDto>
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
