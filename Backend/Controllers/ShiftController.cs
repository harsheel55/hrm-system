using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public sealed class ShiftController(IShiftService shiftService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<ShiftDto>>>> GetShifts()
    {
        var shifts = await shiftService.GetAllShiftsAsync();
        return Ok(new ApiResponse<List<ShiftDto>>
        {
            statusCode = 200,
            message = "Shifts fetched successfully",
            data = shifts
        });
    }

    [HttpPost]
    [Authorize(Roles = "Super Admin,HR")]
    public async Task<ActionResult<ApiResponse<ShiftDto>>> CreateShift(CreateShiftDto dto)
    {
        var result = await shiftService.CreateShiftAsync(dto);
        return Ok(new ApiResponse<ShiftDto>
        {
            statusCode = 200,
            message = "Shift created successfully",
            data = result
        });
    }

    [HttpGet("planner")]
    [Authorize(Roles = "Super Admin,HR")]
    public async Task<ActionResult<ApiResponse<ShiftPlannerViewDto>>> GetPlannerView([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        var result = await shiftService.GetPlannerViewAsync(startDate, endDate);
        return Ok(new ApiResponse<ShiftPlannerViewDto>
        {
            statusCode = 200,
            message = "Planner view fetched successfully",
            data = result
        });
    }

    [HttpPost("assign")]
    [Authorize(Roles = "Super Admin,HR")]
    public async Task<ActionResult<ApiResponse<object>>> AssignShift(ShiftAssignmentDto dto)
    {
        try
        {
            await shiftService.AssignShiftAsync(dto);
            return Ok(new ApiResponse<object>
            {
                statusCode = 200,
                message = "Shift assigned successfully",
                data = null
            });
        }
        catch (ArgumentException ex)
        {
             return BadRequest(new ApiResponse<object>
            {
                statusCode = 400,
                message = ex.Message,
                data = null
            });
        }
    }

    [HttpPost("copy-week")]
    [Authorize(Roles = "Super Admin,HR")]
    public async Task<ActionResult<ApiResponse<int>>> CopyWeek([FromQuery] DateTime targetStartDate)
    {
        var count = await shiftService.CopyWeekAsync(targetStartDate);
        return Ok(new ApiResponse<int>
        {
            statusCode = 200,
            message = $"Successfully copied {count} assignments from last week.",
            data = count
        });
    }
}
