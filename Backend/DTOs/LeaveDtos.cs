using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs;

public sealed class LeaveBalanceDto
{
    public string LeaveType { get; set; } = string.Empty;
    public int Total { get; set; }
    public int Used { get; set; }
    public int Remaining { get; set; }
}

public sealed class LeaveRequestDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string LeaveType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int Days { get; set; }
    public string Status { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public sealed class LeaveDashboardDto
{
    public List<LeaveBalanceDto> Balances { get; set; } = new();
    public List<LeaveRequestDto> Requests { get; set; } = new();
}

public sealed class CreateLeaveRequestDto
{
    [Required]
    [MaxLength(64)]
    public string LeaveType { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    [MaxLength(1000)]
    public string Reason { get; set; } = string.Empty;

    [MaxLength(128)]
    public string EmergencyContact { get; set; } = string.Empty;
}
