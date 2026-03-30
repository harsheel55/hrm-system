using Backend.DTOs;

namespace Backend.Services;

public interface ILeaveService
{
    LeaveDashboardDto GetDashboard(string email);
    LeaveRequestDto CreateRequest(string email, CreateLeaveRequestDto dto);
}
