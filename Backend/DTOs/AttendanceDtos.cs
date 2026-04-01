using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public sealed class AttendanceEmployeeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string? CheckIn { get; set; }
    public string? CheckOut { get; set; }
    public string Status { get; set; } = "absent";
    public decimal HoursWorked { get; set; }
    public decimal Overtime { get; set; }
}

public sealed class AttendanceWeekDayDto
{
    public string Date { get; set; } = string.Empty;
    public string Day { get; set; } = string.Empty;
    public string Status { get; set; } = "absent";
    public string CheckIn { get; set; } = "-";
    public string CheckOut { get; set; } = "-";
    public decimal Hours { get; set; }
}

public sealed class AttendanceSummaryDto
{
    public int Present { get; set; }
    public int Absent { get; set; }
    public int Late { get; set; }
    public int OnLeave { get; set; }
    public int AttendanceRate { get; set; }
}

public sealed class AttendanceWeeklyBarDto
{
    public string Day { get; set; } = string.Empty;
    public int Present { get; set; }
    public int Late { get; set; }
    public int Absent { get; set; }
}

public sealed class DepartmentAttendanceDto
{
    public string Department { get; set; } = string.Empty;
    public int Rate { get; set; }
    public string Count { get; set; } = string.Empty;
}

public sealed class AttendanceClockDto
{
    public bool IsCheckedIn { get; set; }
    public string DateLabel { get; set; } = string.Empty;
    public string CurrentTime { get; set; } = string.Empty;
    public string CheckIn { get; set; } = "-";
    public string CheckOut { get; set; } = "-";
    public string Elapsed { get; set; } = "0h 0m";
    public string Status { get; set; } = "absent";
}

public sealed class AttendanceDashboardDto
{
    public AttendanceSummaryDto Summary { get; set; } = new();
    public AttendanceClockDto Clock { get; set; } = new();
    public List<AttendanceEmployeeDto> Employees { get; set; } = new();
    public List<AttendanceWeekDayDto> MyWeek { get; set; } = new();
    public List<AttendanceWeeklyBarDto> WeeklyBars { get; set; } = new();
    public List<DepartmentAttendanceDto> DepartmentAttendance { get; set; } = new();
}

public sealed class AttendanceQueryDto
{
    [MaxLength(100)]
    public string Search { get; set; } = string.Empty;

    [MaxLength(64)]
    public string Department { get; set; } = "all";
}
