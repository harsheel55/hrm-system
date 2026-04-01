using Backend.DTOs;

namespace Backend.Services;

public interface IAttendanceService
{
    AttendanceDashboardDto GetDashboard(string email, AttendanceQueryDto query);
    AttendanceClockDto CheckIn(string email);
    AttendanceClockDto CheckOut(string email);
    AttendanceClockDto GetTodayClock(string email);
}
