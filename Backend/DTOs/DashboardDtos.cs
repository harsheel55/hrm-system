namespace Backend.DTOs;

public sealed class DashboardHomeSummaryDto
{
    public string userName { get; set; } = string.Empty;
    public string roleName { get; set; } = string.Empty;

    public int activeEmployees { get; set; }
    public int presentToday { get; set; }
    public int onLeaveToday { get; set; }
    public int pendingApprovals { get; set; }
    public int myPendingLeave { get; set; }

    public int openPositions { get; set; }
    public int candidatesInPipeline { get; set; }

    public string latestPayrollPeriod { get; set; } = string.Empty;
    public string latestPayrollStatus { get; set; } = string.Empty;
    public decimal latestPayrollGross { get; set; }
    public decimal latestPayrollDeductions { get; set; }
    public decimal latestPayrollNet { get; set; }
}