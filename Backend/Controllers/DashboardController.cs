using System.Security.Claims;
using Backend.Data;
using Backend.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class DashboardController(AppDbContext context) : ControllerBase
{
    [HttpGet("home-summary")]
    public async Task<ActionResult<ApiResponse<DashboardHomeSummaryDto>>> GetHomeSummary()
    {
        var email = ResolveEmail();
        if (string.IsNullOrWhiteSpace(email))
        {
            return Unauthorized(new ApiResponse<DashboardHomeSummaryDto>
            {
                statusCode = 401,
                message = "Unauthorized",
                data = null
            });
        }

        var user = await context.Users
            .AsNoTracking()
            .Include(u => u.UserRole)
            .FirstOrDefaultAsync(u => u.bolIsActive && u.strEmail == email);

        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var activeEmployees = await context.Users
            .AsNoTracking()
            .CountAsync(u => u.bolIsActive);

        var attendanceToday = await context.Attendances
            .AsNoTracking()
            .Where(a => a.dtDate == today)
            .Select(a => a.strStatus)
            .ToListAsync();

        var presentToday = attendanceToday.Count(s => s.Equals("present", StringComparison.OrdinalIgnoreCase));
        var onLeaveToday = attendanceToday.Count(s =>
            s.Equals("on leave", StringComparison.OrdinalIgnoreCase) ||
            s.Equals("onleave", StringComparison.OrdinalIgnoreCase));

        var pendingApprovals = await context.LeaveRecords
            .AsNoTracking()
            .CountAsync(l => l.Status.ToLower() == "pending");

        var myPendingLeave = await context.LeaveRecords
            .AsNoTracking()
            .CountAsync(l => l.Email == email && l.Status.ToLower() == "pending");

        var openPositions = await context.RecruitmentJobs
            .AsNoTracking()
            .CountAsync(j => j.IsActive);

        var candidatesInPipeline = await context.RecruitmentCandidates
            .AsNoTracking()
            .CountAsync(c => c.IsActive && c.Stage.ToLower() != "hired" && c.Stage.ToLower() != "rejected");

        var latestPayrollRun = await context.PayrollRuns
            .AsNoTracking()
            .Where(r => r.bitIsActive)
            .OrderByDescending(r => r.dtCreatedAt)
            .FirstOrDefaultAsync();

        var summary = new DashboardHomeSummaryDto
        {
            userName = user?.strUserName ?? email,
            roleName = user?.UserRole?.strRoleName ?? "Employee",
            activeEmployees = activeEmployees,
            presentToday = presentToday,
            onLeaveToday = onLeaveToday,
            pendingApprovals = pendingApprovals,
            myPendingLeave = myPendingLeave,
            openPositions = openPositions,
            candidatesInPipeline = candidatesInPipeline,
            latestPayrollPeriod = latestPayrollRun?.strPayPeriod ?? "",
            latestPayrollStatus = latestPayrollRun?.strStatus ?? "",
            latestPayrollGross = latestPayrollRun?.decTotalGross ?? 0,
            latestPayrollDeductions = latestPayrollRun?.decTotalDeductions ?? 0,
            latestPayrollNet = latestPayrollRun?.decTotalNetPay ?? 0
        };

        return Ok(new ApiResponse<DashboardHomeSummaryDto>
        {
            statusCode = 200,
            message = "Dashboard home summary fetched successfully",
            data = summary
        });
    }

    private string ResolveEmail()
    {
        return User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
    }
}