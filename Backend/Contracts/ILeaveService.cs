using Backend.DTOs;

namespace Backend.Services;

public interface ILeaveService
{
    Task<LeaveDashboardDto> GetDashboardAsync(string email);
    Task<LeaveRequestDto> CreateRequestAsync(string email, CreateLeaveRequestDto dto);
    Task<IEnumerable<LeaveRequestDto>> GetAllRequestsAsync();
    Task<LeaveRequestDto> UpdateStatusAsync(Guid id, string status);
}
