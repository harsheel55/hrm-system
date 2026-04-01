using Backend.DTOs;

namespace Backend.Services;

public sealed class AttendanceService : IAttendanceService
{
    private readonly object _lock = new();
    private readonly Dictionary<string, Dictionary<DateOnly, AttendanceDayRecord>> _userDailyRecords =
        new(StringComparer.OrdinalIgnoreCase);

    private static readonly List<AttendanceEmployeeSeed> Employees =
    [
        new() { Id = 1, Name = "Sarah Johnson", Avatar = "SJ", Department = "Engineering", Role = "Senior Dev", CheckIn = "09:02", CheckOut = null, Status = "present", HoursWorked = 5.8m, Overtime = 0m },
        new() { Id = 2, Name = "Michael Chen", Avatar = "MC", Department = "Design", Role = "UI Designer", CheckIn = "09:45", CheckOut = null, Status = "late", HoursWorked = 5.1m, Overtime = 0m },
        new() { Id = 3, Name = "Emily Rodriguez", Avatar = "ER", Department = "Marketing", Role = "Mktg Lead", CheckIn = null, CheckOut = null, Status = "absent", HoursWorked = 0m, Overtime = 0m },
        new() { Id = 4, Name = "James Kim", Avatar = "JK", Department = "Sales", Role = "Sales Rep", CheckIn = "08:55", CheckOut = null, Status = "present", HoursWorked = 6.0m, Overtime = 1.0m },
        new() { Id = 5, Name = "Aisha Patel", Avatar = "AP", Department = "HR", Role = "HR Manager", CheckIn = null, CheckOut = null, Status = "on-leave", HoursWorked = 0m, Overtime = 0m },
        new() { Id = 6, Name = "David Park", Avatar = "DP", Department = "Engineering", Role = "Backend Dev", CheckIn = "08:30", CheckOut = null, Status = "present", HoursWorked = 7.4m, Overtime = 1.4m },
        new() { Id = 7, Name = "Lisa Wang", Avatar = "LW", Department = "Finance", Role = "Analyst", CheckIn = "09:10", CheckOut = null, Status = "present", HoursWorked = 5.6m, Overtime = 0m },
        new() { Id = 8, Name = "Tom Harris", Avatar = "TH", Department = "Sales", Role = "Sales Lead", CheckIn = "10:15", CheckOut = null, Status = "late", HoursWorked = 4.0m, Overtime = 0m },
        new() { Id = 9, Name = "Nina Gupta", Avatar = "NG", Department = "Engineering", Role = "QA Engineer", CheckIn = "09:00", CheckOut = "13:30", Status = "half-day", HoursWorked = 4.5m, Overtime = 0m },
        new() { Id = 10, Name = "Carlos Diaz", Avatar = "CD", Department = "Marketing", Role = "Content Writer", CheckIn = "08:58", CheckOut = null, Status = "present", HoursWorked = 6.0m, Overtime = 0m }
    ];

    public AttendanceDashboardDto GetDashboard(string email, AttendanceQueryDto query)
    {
        lock (_lock)
        {
            EnsureUserSeed(email);

            var normalizedSearch = (query.Search ?? string.Empty).Trim();
            var normalizedDepartment = (query.Department ?? "all").Trim();

            var filteredEmployees = Employees
                .Where(e =>
                    (string.Equals(normalizedDepartment, "all", StringComparison.OrdinalIgnoreCase) ||
                     string.Equals(e.Department, normalizedDepartment, StringComparison.OrdinalIgnoreCase)) &&
                    (string.IsNullOrWhiteSpace(normalizedSearch) ||
                     e.Name.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase) ||
                     e.Department.Contains(normalizedSearch, StringComparison.OrdinalIgnoreCase)))
                .Select(MapEmployee)
                .ToList();

            var summary = BuildSummary(Employees);

            return new AttendanceDashboardDto
            {
                Summary = summary,
                Clock = BuildClock(email, DateTime.Now),
                Employees = filteredEmployees,
                MyWeek = BuildMyWeek(email, DateTime.Today),
                WeeklyBars = BuildWeeklyBars(summary),
                DepartmentAttendance = BuildDepartmentAttendance(Employees)
            };
        }
    }

    public AttendanceClockDto CheckIn(string email)
    {
        lock (_lock)
        {
            EnsureUserSeed(email);

            var now = DateTime.Now;
            var today = DateOnly.FromDateTime(now);
            var userData = _userDailyRecords[email];
            userData.TryGetValue(today, out var record);

            if (record is { CheckInAt: not null, CheckOutAt: null })
            {
                throw new InvalidOperationException("You are already checked in.");
            }

            record ??= new AttendanceDayRecord();
            record.CheckInAt = now;
            record.CheckOutAt = null;
            userData[today] = record;

            return BuildClock(email, now);
        }
    }

    public AttendanceClockDto CheckOut(string email)
    {
        lock (_lock)
        {
            EnsureUserSeed(email);

            var now = DateTime.Now;
            var today = DateOnly.FromDateTime(now);
            var userData = _userDailyRecords[email];

            if (!userData.TryGetValue(today, out var record) || record.CheckInAt is null)
            {
                throw new InvalidOperationException("You must check in before checking out.");
            }

            if (record.CheckOutAt is not null)
            {
                throw new InvalidOperationException("You have already checked out.");
            }

            record.CheckOutAt = now;
            userData[today] = record;

            return BuildClock(email, now);
        }
    }

    public AttendanceClockDto GetTodayClock(string email)
    {
        lock (_lock)
        {
            EnsureUserSeed(email);
            return BuildClock(email, DateTime.Now);
        }
    }

    private void EnsureUserSeed(string email)
    {
        if (_userDailyRecords.ContainsKey(email))
        {
            return;
        }

        var today = DateOnly.FromDateTime(DateTime.Today);
        var seededCheckIn = DateTime.Today.AddHours(9).AddMinutes(3);

        _userDailyRecords[email] = new Dictionary<DateOnly, AttendanceDayRecord>
        {
            [today] = new AttendanceDayRecord
            {
                CheckInAt = seededCheckIn,
                CheckOutAt = null
            }
        };
    }

    private AttendanceClockDto BuildClock(string email, DateTime now)
    {
        var today = DateOnly.FromDateTime(now);
        _userDailyRecords[email].TryGetValue(today, out var record);

        var checkIn = record?.CheckInAt;
        var checkOut = record?.CheckOutAt;
        var isCheckedIn = checkIn is not null && checkOut is null;

        TimeSpan elapsed;
        if (checkIn is null)
        {
            elapsed = TimeSpan.Zero;
        }
        else if (checkOut is null)
        {
            elapsed = now - checkIn.Value;
        }
        else
        {
            elapsed = checkOut.Value - checkIn.Value;
        }

        var status = checkIn is null ? "absent" : checkOut is null ? "present" : "half-day";

        return new AttendanceClockDto
        {
            IsCheckedIn = isCheckedIn,
            DateLabel = now.ToString("ddd, MMM d"),
            CurrentTime = now.ToString("h:mm tt"),
            CheckIn = checkIn?.ToString("HH:mm") ?? "-",
            CheckOut = checkOut?.ToString("HH:mm") ?? "-",
            Elapsed = $"{Math.Max(0, (int)elapsed.TotalHours)}h {Math.Max(0, elapsed.Minutes)}m",
            Status = status
        };
    }

    private static List<AttendanceWeekDayDto> BuildMyWeek(string email, DateTime today)
    {
        _ = email;

        var start = today.Date.AddDays(-(int)today.DayOfWeek + (int)DayOfWeek.Monday);
        if (today.DayOfWeek == DayOfWeek.Sunday)
        {
            start = today.Date.AddDays(-6);
        }

        var items = new List<AttendanceWeekDayDto>();
        for (var i = 0; i < 7; i++)
        {
            var current = start.AddDays(i);
            var isToday = current.Date == today.Date;
            var isWeekend = current.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday;

            items.Add(new AttendanceWeekDayDto
            {
                Date = current.ToString("MMM dd"),
                Day = isToday ? "Today" : current.ToString("ddd"),
                Status = isWeekend ? "absent" : "present",
                CheckIn = isWeekend ? "-" : "09:00",
                CheckOut = isWeekend ? "-" : (isToday ? "-" : "18:00"),
                Hours = isWeekend ? 0m : (isToday ? 5.8m : 9.0m)
            });
        }

        return items;
    }

    private static AttendanceSummaryDto BuildSummary(IEnumerable<AttendanceEmployeeSeed> employees)
    {
        var list = employees.ToList();
        var present = list.Count(e => string.Equals(e.Status, "present", StringComparison.OrdinalIgnoreCase));
        var absent = list.Count(e => string.Equals(e.Status, "absent", StringComparison.OrdinalIgnoreCase));
        var late = list.Count(e => string.Equals(e.Status, "late", StringComparison.OrdinalIgnoreCase));
        var onLeave = list.Count(e => string.Equals(e.Status, "on-leave", StringComparison.OrdinalIgnoreCase));

        var total = list.Count;
        var attendanceRate = total == 0 ? 0 : (int)Math.Round((double)present * 100d / total);

        return new AttendanceSummaryDto
        {
            Present = present,
            Absent = absent,
            Late = late,
            OnLeave = onLeave,
            AttendanceRate = attendanceRate
        };
    }

    private static List<DepartmentAttendanceDto> BuildDepartmentAttendance(IEnumerable<AttendanceEmployeeSeed> employees)
    {
        return employees
            .GroupBy(e => e.Department)
            .OrderBy(g => g.Key)
            .Select(group =>
            {
                var total = group.Count();
                var present = group.Count(x => string.Equals(x.Status, "present", StringComparison.OrdinalIgnoreCase));
                var rate = total == 0 ? 0 : (int)Math.Round((double)present * 100d / total);

                return new DepartmentAttendanceDto
                {
                    Department = group.Key,
                    Rate = rate,
                    Count = $"{present}/{total} present"
                };
            })
            .ToList();
    }

    private static List<AttendanceWeeklyBarDto> BuildWeeklyBars(AttendanceSummaryDto summary)
    {
        return
        [
            new AttendanceWeeklyBarDto { Day = "M", Present = 42, Late = 3, Absent = 3 },
            new AttendanceWeeklyBarDto { Day = "T", Present = 44, Late = 2, Absent = 2 },
            new AttendanceWeeklyBarDto { Day = "W", Present = 40, Late = 5, Absent = 3 },
            new AttendanceWeeklyBarDto { Day = "T", Present = 45, Late = 2, Absent = 1 },
            new AttendanceWeeklyBarDto { Day = "F", Present = 43, Late = 3, Absent = 2 },
            new AttendanceWeeklyBarDto { Day = "S", Present = 5, Late = 0, Absent = 43 },
            new AttendanceWeeklyBarDto { Day = "S", Present = summary.Present, Late = summary.Late, Absent = summary.Absent + summary.OnLeave }
        ];
    }

    private static AttendanceEmployeeDto MapEmployee(AttendanceEmployeeSeed employee)
    {
        return new AttendanceEmployeeDto
        {
            Id = employee.Id,
            Name = employee.Name,
            Avatar = employee.Avatar,
            Department = employee.Department,
            Role = employee.Role,
            CheckIn = employee.CheckIn,
            CheckOut = employee.CheckOut,
            Status = employee.Status,
            HoursWorked = employee.HoursWorked,
            Overtime = employee.Overtime
        };
    }

    private sealed class AttendanceEmployeeSeed
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

    private sealed class AttendanceDayRecord
    {
        public DateTime? CheckInAt { get; set; }
        public DateTime? CheckOutAt { get; set; }
    }
}
