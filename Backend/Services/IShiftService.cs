using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.DTOs;

namespace Backend.Services
{
    public interface IShiftService
    {
        Task<List<ShiftDto>> GetAllShiftsAsync();
        Task<ShiftDto> CreateShiftAsync(CreateShiftDto dto);
        Task<ShiftPlannerViewDto> GetPlannerViewAsync(DateTime startDate, DateTime endDate);
        Task AssignShiftAsync(ShiftAssignmentDto dto);
        Task<int> CopyWeekAsync(DateTime targetStartDate);
    }
}
