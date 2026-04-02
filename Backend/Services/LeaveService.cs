using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public sealed class LeaveService(AppDbContext context) : ILeaveService
{
    private static readonly Dictionary<string, int> LeaveQuota = new(StringComparer.OrdinalIgnoreCase)
    {
        ["Annual Leave"] = 21,
        ["Sick Leave"] = 10,
        ["Personal"] = 5,
        ["Paternity"] = 90
    };

    public async Task<LeaveDashboardDto> GetDashboardAsync(string email)
    {
        var userRequests = await context.LeaveRecords
            .Where(r => r.Email == email)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

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

    public async Task<LeaveRequestDto> CreateRequestAsync(string email, CreateLeaveRequestDto dto)
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
            Reason = dto.Reason?.Trim() ?? string.Empty,
            EmergencyContact = dto.EmergencyContact?.Trim() ?? string.Empty,
            CreatedAt = DateTime.UtcNow
        };

        await context.LeaveRecords.AddAsync(request);
        await context.SaveChangesAsync();

        return MapRequest(request);
    }

    public async Task<IEnumerable<LeaveRequestDto>> GetAllRequestsAsync()
    {
        var requests = await context.LeaveRecords
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return requests.Select(MapRequest).ToList();
    }

    public async Task<LeaveRequestDto> UpdateStatusAsync(Guid id, string status)
    {
        var request = await context.LeaveRecords.FirstOrDefaultAsync(r => r.Id == id);
        if (request == null)
        {
            throw new InvalidOperationException("Leave request not found");
        }

        request.Status = status;
        request.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();

        return MapRequest(request);
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
            Email = record.Email,
            LeaveType = record.LeaveType,
            StartDate = record.StartDate,
            EndDate = record.EndDate,
            Days = record.Days,
            Status = record.Status,
            Reason = record.Reason,
            CreatedAt = record.CreatedAt
        };
    }
}
