using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace Backend.Services;

public sealed class AttendanceService : IAttendanceService
{
    private readonly AppDbContext _context;

    private static DateTime? AsUtc(DateTime? value)
    {
        return value.HasValue ? DateTime.SpecifyKind(value.Value, DateTimeKind.Utc) : null;
    }

    private static string FormatLocalTime(DateTime? value)
    {
        var utc = AsUtc(value);
        return utc?.ToLocalTime().ToString("h:mm tt") ?? "-";
    }

    public AttendanceService(AppDbContext context)
    {
        _context = context;
    }

    public AttendanceDashboardDto GetDashboard(string email, AttendanceQueryDto query)
    {
        var normalizedSearch = (query.Search ?? string.Empty).Trim();
        var normalizedDepartment = (query.Department ?? "all").Trim();
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        // Fetch user data
        var allUsers = _context.Users.Include(u => u.UserRole).ToList();
        var allAttendancesToday = _context.Attendances.Where(a => a.dtDate == today).ToList();

        var employees = allUsers.Select(u =>
        {
            var attendance = allAttendancesToday.FirstOrDefault(a => a.strUserGUID == u.strUserGUID);
            var department = u.UserRole?.strRoleName ?? "General";
            var checkInStr = FormatLocalTime(attendance?.dtCheckIn);
            var status = attendance?.strStatus?.ToLower() ?? "absent";
            if (checkInStr == "-") status = "absent";
            
            decimal hoursWorked = 0;
            if (attendance?.dtCheckIn != null && attendance.dtCheckOut != null)
            {
                hoursWorked = Math.Round((decimal)(attendance.dtCheckOut.Value - attendance.dtCheckIn.Value).TotalHours, 1);
            }
            else if (attendance?.dtCheckIn != null)
            {
                hoursWorked = Math.Round((decimal)(DateTime.UtcNow - attendance.dtCheckIn.Value).TotalHours, 1);
            }

            return new AttendanceEmployeeDto
            {
                Id = u.strUserName.GetHashCode(), // Mock ID for frontend format
                Name = u.strUserName,
                Avatar = string.IsNullOrWhiteSpace(u.strUserName) ? "U" : u.strUserName.Substring(0, 1).ToUpper(),
                Department = department,
                Role = u.UserRole?.strRoleName ?? "Employee",
                CheckIn = FormatLocalTime(attendance?.dtCheckIn),
                CheckOut = FormatLocalTime(attendance?.dtCheckOut),
                Status = status,
                HoursWorked = hoursWorked,
                Overtime = hoursWorked > 8 ? hoursWorked - 8 : 0,
                CheckInIso = AsUtc(attendance?.dtCheckIn),
                CheckOutIso = AsUtc(attendance?.dtCheckOut)
            };
        }).ToList();

        var filteredEmployees = employees
            .Where(e =>
                (string.Equals(normalizedDepartment, "all", StringComparison.OrdinalIgnoreCase) ||
                 string.Equals(e.Department, normalizedDepartment, StringComparison.OrdinalIgnoreCase)) &&
                (string.IsNullOrWhiteSpace(normalizedSearch) ||
                 e.Name.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase) ||
                 e.Department.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        var present = employees.Count(e => e.Status == "present" || e.Status == "late" || e.Status == "half-day");
        var absent = employees.Count(e => e.Status == "absent");
        var late = employees.Count(e => e.Status == "late");
        var onLeave = employees.Count(e => e.Status == "on-leave");

        var summary = new AttendanceSummaryDto
        {
            Present = present,
            Absent = absent,
            Late = late,
            OnLeave = onLeave,
            AttendanceRate = employees.Count == 0 ? 0 : (int)Math.Round((double)present * 100d / employees.Count)
        };

        var deptAttendance = employees.GroupBy(e => e.Department).Select(g =>
        {
            var deptTotal = g.Count();
            var deptPresent = g.Count(x => x.Status == "present" || x.Status == "late" || x.Status == "half-day");
            return new DepartmentAttendanceDto
            {
                Department = g.Key,
                Rate = deptTotal == 0 ? 0 : (int)Math.Round((double)deptPresent * 100d / deptTotal),
                Count = $"{deptPresent}/{deptTotal} present"
            };
        }).ToList();

        var currentUser = _context.Users.FirstOrDefault(u => u.strEmail == email);
        return new AttendanceDashboardDto
        {
            Summary = summary,
            Clock = GetTodayClock(email),
            Employees = filteredEmployees,
            MyWeek = BuildMyWeek(currentUser?.strUserGUID),
            WeeklyBars = BuildWeeklyBars(),
            DepartmentAttendance = deptAttendance,
            MonthlySummary = BuildMonthlySummary(currentUser?.strUserGUID)
        };
    }

    public AttendanceClockDto CheckIn(string email)
    {
        var user = _context.Users.FirstOrDefault(u => u.strEmail == email);
        if (user == null) throw new InvalidOperationException("User not found.");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var attendance = _context.Attendances.FirstOrDefault(a => a.strUserGUID == user.strUserGUID && a.dtDate == today);

        if (attendance != null && attendance.dtCheckIn != null)
        {
            if (attendance.dtCheckOut == null)
            {
                throw new InvalidOperationException("You are already checked in.");
            }
            throw new InvalidOperationException("You have already completed your shift today.");
        }

        if (attendance == null)
        {
            attendance = new Attendance
            {
                strUserGUID = user.strUserGUID,
                dtDate = today,
                dtCheckIn = DateTime.UtcNow,
                strStatus = DateTime.UtcNow.TimeOfDay > new TimeSpan(9, 15, 0) ? "Late" : "Present"
            };
            _context.Attendances.Add(attendance);
        }
        else
        {
            attendance.dtCheckIn = DateTime.UtcNow;
            attendance.strStatus = DateTime.UtcNow.TimeOfDay > new TimeSpan(9, 15, 0) ? "Late" : "Present";
        }

        _context.SaveChanges();
        return BuildClock(attendance);
    }

    public AttendanceClockDto CheckOut(string email)
    {
        var user = _context.Users.FirstOrDefault(u => u.strEmail == email);
        if (user == null) throw new InvalidOperationException("User not found.");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var attendance = _context.Attendances.FirstOrDefault(a => a.strUserGUID == user.strUserGUID && a.dtDate == today);

        if (attendance == null || attendance.dtCheckIn == null)
        {
            throw new InvalidOperationException("You must check in before checking out.");
        }

        if (attendance.dtCheckOut != null)
        {
            throw new InvalidOperationException("You have already checked out.");
        }

        attendance.dtCheckOut = DateTime.UtcNow;
        _context.SaveChanges();
        
        return BuildClock(attendance);
    }

    public AttendanceClockDto GetTodayClock(string email)
    {
        var user = _context.Users.FirstOrDefault(u => u.strEmail == email);
        if (user == null) return new AttendanceClockDto();

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var attendance = _context.Attendances.FirstOrDefault(a => a.strUserGUID == user.strUserGUID && a.dtDate == today);

        return BuildClock(attendance);
    }

    private AttendanceClockDto BuildClock(Attendance? attendance)
    {
        var checkIn = AsUtc(attendance?.dtCheckIn);
        var checkOut = AsUtc(attendance?.dtCheckOut);
        var isCheckedIn = checkIn != null && checkOut == null;

        var nowUtc = DateTime.UtcNow;
        var nowLocal = nowUtc.ToLocalTime();
        TimeSpan elapsed = TimeSpan.Zero;
        if (checkIn != null)
        {
            elapsed = checkOut != null ? checkOut.Value - checkIn.Value : nowUtc - checkIn.Value;
        }

        var status = attendance?.strStatus?.ToLower() ?? "absent";
        if (checkIn == null) status = "absent";
        else if (checkOut != null && elapsed.TotalHours < 4) status = "half-day";

        return new AttendanceClockDto
        {
            IsCheckedIn = isCheckedIn,
            DateLabel = nowLocal.ToString("ddd, MMM d"),
            CurrentTime = nowLocal.ToString("h:mm tt"),
            CheckIn = checkIn?.ToLocalTime().ToString("h:mm tt") ?? "-",
            CheckOut = checkOut?.ToLocalTime().ToString("h:mm tt") ?? "-",
            Elapsed = $"{Math.Max(0, (int)elapsed.TotalHours)}h {Math.Max(0, elapsed.Minutes)}m",
            Status = status,
            CheckInIso = checkIn,
            CheckOutIso = checkOut
        };
    }

    private List<AttendanceWeekDayDto> BuildMyWeek(Guid? userGuid)
    {
        var today = DateTime.UtcNow;
        var start = today.Date.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
        if (today.DayOfWeek == DayOfWeek.Sunday) start = today.Date.AddDays(-6);
        
        var dateOnlyStart = DateOnly.FromDateTime(start);
        var dateOnlyEnd = DateOnly.FromDateTime(start.AddDays(6));

        var weeklyRecords = new List<Attendance>();
        if (userGuid.HasValue)
        {
            weeklyRecords = _context.Attendances
                .Where(a => a.strUserGUID == userGuid.Value && a.dtDate >= dateOnlyStart && a.dtDate <= dateOnlyEnd)
                .ToList();
        }

        var items = new List<AttendanceWeekDayDto>();
        for (var i = 0; i < 7; i++)
        {
            var current = start.AddDays(i);
            var currentDateOnly = DateOnly.FromDateTime(current);
            var isToday = current.Date == today.Date;
            var isWeekend = current.DayOfWeek == DayOfWeek.Saturday || current.DayOfWeek == DayOfWeek.Sunday;

            var record = weeklyRecords.FirstOrDefault(r => r.dtDate == currentDateOnly);
            
            string status = isWeekend ? "weekend" : "absent";
            if (record != null && record.dtCheckIn != null) status = record.strStatus?.ToLower() ?? "present";
            
            decimal hours = 0;
            if (record != null && record.dtCheckIn != null)
            {
                var end = record.dtCheckOut ?? DateTime.UtcNow;
                hours = Math.Round((decimal)(end - record.dtCheckIn.Value).TotalHours, 1);
            }

            items.Add(new AttendanceWeekDayDto
            {
                Date = current.ToString("MMM dd"),
                Day = isToday ? "Today" : current.ToString("ddd"),
                Status = status,
                CheckIn = FormatLocalTime(record?.dtCheckIn),
                CheckOut = FormatLocalTime(record?.dtCheckOut),
                Hours = hours
            });
        }

        return items;
    }

    private List<AttendanceWeeklyBarDto> BuildWeeklyBars()
    {
        var today = DateTime.UtcNow.Date;
        var start = today.AddDays(-6); // Last 7 days including today
        var dateOnlyStart = DateOnly.FromDateTime(start);
        var dateOnlyEnd = DateOnly.FromDateTime(today);

        var records = _context.Attendances
            .Where(a => a.dtDate >= dateOnlyStart && a.dtDate <= dateOnlyEnd)
            .ToList();

        var bars = new List<AttendanceWeeklyBarDto>();
        for (var i = 0; i < 7; i++)
        {
            var current = start.AddDays(i);
            var currentDateOnly = DateOnly.FromDateTime(current);
            var dayRecords = records.Where(r => r.dtDate == currentDateOnly).ToList();

            bars.Add(new AttendanceWeeklyBarDto
            {
                Day = current.ToString("ddd").Substring(0, 1).ToUpper(),
                Present = dayRecords.Count(r => r.strStatus != null && (r.strStatus.ToLower() == "present" || r.strStatus.ToLower() == "half-day")),
                Late = dayRecords.Count(r => r.strStatus != null && r.strStatus.ToLower() == "late"),
                Absent = dayRecords.Count(r => r.strStatus != null && r.strStatus.ToLower() == "absent")
            });
        }

        return bars;
    }

    private AttendanceMonthlySummaryDto BuildMonthlySummary(Guid? userGuid)
    {
        if (userGuid == null) return new AttendanceMonthlySummaryDto();

        var today = DateTime.UtcNow;
        var monthStart = new DateOnly(today.Year, today.Month, 1);
        var currentDay = DateOnly.FromDateTime(today);
        
        var workingDays = 0;
        for (var day = monthStart; day <= currentDay; day = day.AddDays(1))
        {
            var dow = day.DayOfWeek;
            if (dow != DayOfWeek.Saturday && dow != DayOfWeek.Sunday) workingDays++;
        }

        var records = _context.Attendances
            .Where(a => a.strUserGUID == userGuid.Value && a.dtDate >= monthStart && a.dtDate <= currentDay)
            .ToList();

        var daysPresent = records.Count(r => r.dtCheckIn != null);
        var daysLate = records.Count(r => r.strStatus != null && r.strStatus.ToLower() == "late");
        
        decimal totalHours = 0;
        int overtimeDays = 0;
        decimal overtimeHours = 0;

        foreach (var r in records)
        {
            if (r.dtCheckIn != null)
            {
                var end = r.dtCheckOut ?? DateTime.UtcNow;
                var hours = (decimal)(end - r.dtCheckIn.Value).TotalHours;
                totalHours += hours;
                if (hours > 8m)
                {
                    overtimeDays++;
                    overtimeHours += (hours - 8m);
                }
            }
        }

        var latePercentage = workingDays == 0 ? 0 : Math.Round((decimal)daysLate * 100 / workingDays, 1);
        var avgHours = daysPresent == 0 ? 0 : Math.Round(totalHours / daysPresent, 1);

        return new AttendanceMonthlySummaryDto
        {
            DaysPresent = daysPresent,
            WorkingDays = workingDays,
            DaysLate = daysLate,
            LatePercentage = latePercentage,
            TotalHours = Math.Round(totalHours, 1),
            AvgHoursPerDay = avgHours,
            OvertimeHours = Math.Round(overtimeHours, 1),
            OvertimeDays = overtimeDays
        };
    }
}
