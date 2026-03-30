using Backend.DTOs;

namespace Backend.Services;

public sealed class LeaveService : ILeaveService
{
    private static readonly Dictionary<string, int> LeaveQuota = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Annual Leave"] = 21,
        ["Sick Leave"] = 10,
        ["Personal"] = 5,
        ["Paternity"] = 90
    };

    private readonly List<LeaveRecord> _requests = new();
    private readonly object _lock = new();

    public LeaveDashboardDto GetDashboard(string email)
    {
        lock (_lock)
        {
            EnsureSeedData(email);

            var userRequests = _requests
                .Where(r => string.Equals(r.Email, email, StringComparison.OrdinalIgnoreCase))
                .OrderByDescending(r => r.CreatedAt)
                .ToList();

            var approvedByType = userRequests
                .Where(r => string.Equals(r.Status, "approved", StringComparison.OrdinalIgnoreCase))
                .GroupBy(r => r.LeaveType)
                .ToDictionary(g => g.Key, g => g.Sum(x => x.Days), StringComparer.OrdinalIgnoreCase);

            var balances = LeaveQuota
                .Select(quota =>
                {
                    var used = approvedByType.TryGetValue(quota.Key, out var sum) ? sum : 0;
                    var remaining = Math.Max(0, quota.Value - used);
                    return new LeaveBalanceDto
                    {
                        LeaveType = quota.Key,
                        Total = quota.Value,
                        Used = used,
                        Remaining = remaining
                    };
                })
                .ToList();

            return new LeaveDashboardDto
            {
                Balances = balances,
                Requests = userRequests.Select(MapRequest).ToList()
            };
        }
    }

    public LeaveRequestDto CreateRequest(string email, CreateLeaveRequestDto dto)
    {
        var start = dto.StartDate.Date;
        var end = dto.EndDate.Date;
        var normalizedType = NormalizeType(dto.LeaveType);

        if (end < start)
        {
            throw new InvalidOperationException("End date cannot be before start date.");
        }

        var days = (end - start).Days + 1;

        var request = new LeaveRecord
        {
            Id = Guid.NewGuid(),
            Email = email,
            LeaveType = normalizedType,
            StartDate = start,
            EndDate = end,
            Days = days,
            Status = "pending",
            Reason = dto.Reason.Trim(),
            EmergencyContact = dto.EmergencyContact.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        lock (_lock)
        {
            _requests.Add(request);
        }

        return MapRequest(request);
    }

    private void EnsureSeedData(string email)
    {
        var hasData = _requests.Any(r => string.Equals(r.Email, email, StringComparison.OrdinalIgnoreCase));
        if (hasData)
        {
            return;
        }

        _requests.AddRange(new[]
        {
            new LeaveRecord
            {
                Id = Guid.NewGuid(),
                Email = email,
                LeaveType = "Annual Leave",
                StartDate = DateTime.UtcNow.Date.AddDays(14),
                EndDate = DateTime.UtcNow.Date.AddDays(16),
                Days = 3,
                Status = "pending",
                Reason = "Family vacation",
                EmergencyContact = string.Empty,
                CreatedAt = DateTime.UtcNow.AddDays(-2)
            },
            new LeaveRecord
            {
                Id = Guid.NewGuid(),
                Email = email,
                LeaveType = "Sick Leave",
                StartDate = DateTime.UtcNow.Date.AddDays(-10),
                EndDate = DateTime.UtcNow.Date.AddDays(-10),
                Days = 1,
                Status = "approved",
                Reason = "Medical appointment",
                EmergencyContact = string.Empty,
                CreatedAt = DateTime.UtcNow.AddDays(-10)
            },
            new LeaveRecord
            {
                Id = Guid.NewGuid(),
                Email = email,
                LeaveType = "Personal",
                StartDate = DateTime.UtcNow.Date.AddDays(-25),
                EndDate = DateTime.UtcNow.Date.AddDays(-25),
                Days = 1,
                Status = "approved",
                Reason = "Personal work",
                EmergencyContact = string.Empty,
                CreatedAt = DateTime.UtcNow.AddDays(-25)
            }
        });
    }

    private static string NormalizeType(string leaveType)
    {
        var trimmed = leaveType.Trim();
        return LeaveQuota.Keys.FirstOrDefault(t => string.Equals(t, trimmed, StringComparison.OrdinalIgnoreCase)) ?? trimmed;
    }

    private static LeaveRequestDto MapRequest(LeaveRecord record)
    {
        return new LeaveRequestDto
        {
            Id = record.Id,
            LeaveType = record.LeaveType,
            StartDate = record.StartDate,
            EndDate = record.EndDate,
            Days = record.Days,
            Status = record.Status,
            Reason = record.Reason,
            CreatedAt = record.CreatedAt
        };
    }

    private sealed class LeaveRecord
    {
        public Guid Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public string LeaveType { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int Days { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string EmergencyContact { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}
