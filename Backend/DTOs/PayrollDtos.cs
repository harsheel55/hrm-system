using System;
using System.Collections.Generic;

namespace Backend.DTOs
{
    /// <summary>
    /// DTO for Payroll Employee - used in API responses
    /// </summary>
    public class PayrollEmployeeDto
    {
        public Guid id { get; set; }
        public Guid userId { get; set; }
        public string name { get; set; } = string.Empty;
        public string avatar { get; set; } = string.Empty;
        public string dept { get; set; } = string.Empty;
        public string role { get; set; } = string.Empty;
        public string payPeriod { get; set; } = string.Empty;
        public string empType { get; set; } = "full-time";

        // Earnings
        public decimal base_ { get; set; }
        public decimal hra { get; set; }
        public decimal transport { get; set; }
        public decimal medical { get; set; }
        public decimal bonus { get; set; }
        public decimal gross { get; set; }

        // Deductions
        public decimal provident { get; set; }
        public decimal incomeTax { get; set; }
        public decimal insurance { get; set; }
        public decimal totalDeductions { get; set; }
        public decimal net { get; set; }

        // Bank & Tax info
        public string bankLast4 { get; set; } = string.Empty;
        public string bankName { get; set; } = string.Empty;
        public string taxBracket { get; set; } = string.Empty;

        // YTD
        public decimal ytdGross { get; set; }
        public decimal ytdTax { get; set; }
    }

    /// <summary>
    /// DTO for Payroll Run - used in API responses
    /// </summary>
    public class PayrollRunDto
    {
        public Guid id { get; set; }
        public string runCode { get; set; } = string.Empty;
        public string period { get; set; } = string.Empty;
        public string status { get; set; } = "draft";
        public int employees { get; set; }
        public decimal gross { get; set; }
        public decimal deductions { get; set; }
        public decimal net { get; set; }
        public string initiatedBy { get; set; } = string.Empty;
        public string initiatedAt { get; set; } = string.Empty;
        public string? paidAt { get; set; }
        public List<PayrollStepDto> steps { get; set; } = new();
    }

    /// <summary>
    /// DTO for Payroll Step (part of run workflow)
    /// </summary>
    public class PayrollStepDto
    {
        public string label { get; set; } = string.Empty;
        public bool done { get; set; }
        public bool? skipped { get; set; }
    }

    /// <summary>
    /// DTO for Compliance Item
    /// </summary>
    public class PayrollComplianceDto
    {
        public Guid id { get; set; }
        public string title { get; set; } = string.Empty;
        public string authority { get; set; } = string.Empty;
        public string dueDate { get; set; } = string.Empty;
        public string status { get; set; } = "upcoming"; // filed, pending, overdue, upcoming
        public decimal? amount { get; set; }
        public string period { get; set; } = string.Empty;
        public string category { get; set; } = "Tax";
    }

    /// <summary>
    /// Request DTO for creating/updating payroll run
    /// </summary>
    public class CreatePayrollRunDto
    {
        public string strPayPeriod { get; set; } = string.Empty;
        public int intEmployeeCount { get; set; }
        public decimal decTotalGross { get; set; }
        public decimal decTotalDeductions { get; set; }
        public decimal decTotalNetPay { get; set; }
    }

    /// <summary>
    /// Request DTO for updating payroll run status
    /// </summary>
    public class UpdatePayrollRunStatusDto
    {
        public string strStatus { get; set; } = string.Empty;
        public List<PayrollStepDto>? steps { get; set; }
    }

    /// <summary>
    /// Request DTO for compliance item
    /// </summary>
    public class CreatePayrollComplianceDto
    {
        public string strTitle { get; set; } = string.Empty;
        public string strAuthority { get; set; } = string.Empty;
        public string strCategory { get; set; } = "Tax";
        public DateTime dtDueDate { get; set; }
        public string strStatus { get; set; } = "upcoming";
        public decimal? decAmount { get; set; }
        public string strPeriod { get; set; } = string.Empty;
        public string strDescription { get; set; } = string.Empty;
    }

    /// <summary>
    /// Request DTO for assigning or updating employee salary for a pay period
    /// </summary>
    public class UpsertPayrollEmployeeSalaryDto
    {
        public Guid strUserGUID { get; set; }
        public string strPayPeriod { get; set; } = string.Empty;
        public string strEmploymentType { get; set; } = "full-time";

        public decimal decBaseSalary { get; set; }
        public decimal decHRA { get; set; }
        public decimal decTransportAllowance { get; set; }
        public decimal decMedicalAllowance { get; set; }
        public decimal decPerformanceBonus { get; set; }

        public decimal decProvidentFund { get; set; }
        public decimal decIncomeTax { get; set; }
        public decimal decHealthInsurance { get; set; }

        public string strBankLast4 { get; set; } = string.Empty;
        public string strBankName { get; set; } = string.Empty;
        public string strTaxBracket { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for Payroll Analytics
    /// </summary>
    public class PayrollAnalyticsDto
    {
        public decimal totalGross { get; set; }
        public decimal totalDeductions { get; set; }
        public decimal totalNetPay { get; set; }
        public int compliancePending { get; set; }
        public List<MonthlyTrendDto> monthlyTrend { get; set; } = new();
        public List<DepartmentCostDto> departmentCosts { get; set; } = new();
    }

    /// <summary>
    /// DTO for monthly trend data
    /// </summary>
    public class MonthlyTrendDto
    {
        public string month { get; set; } = string.Empty;
        public decimal gross { get; set; }
    }

    /// <summary>
    /// DTO for department cost breakdown
    /// </summary>
    public class DepartmentCostDto
    {
        public string department { get; set; } = string.Empty;
        public decimal cost { get; set; }
        public int percentage { get; set; }
        public int staffCount { get; set; }
    }

    /// <summary>
    /// DTO for exported payroll file content
    /// </summary>
    public class PayrollExportDto
    {
        public string fileName { get; set; } = string.Empty;
        public string contentType { get; set; } = "text/csv";
        public string base64Content { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for bulk payslip dispatch result
    /// </summary>
    public class PayrollPayslipDispatchResultDto
    {
        public string payPeriod { get; set; } = string.Empty;
        public int totalEmployees { get; set; }
        public int employeesWithEmail { get; set; }
        public int sentCount { get; set; }
        public int failedCount { get; set; }
        public int skippedCount { get; set; }
        public bool runUpdated { get; set; }
        public bool requesterNotified { get; set; }
        public List<PayrollEmailDispatchItemDto> sentRecipients { get; set; } = new();
        public List<PayrollEmailDispatchItemDto> failedRecipients { get; set; } = new();
        public List<PayrollEmailDispatchItemDto> skippedRecipients { get; set; } = new();
    }

    public class PayrollEmailDispatchItemDto
    {
        public string name { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string reason { get; set; } = string.Empty;
    }
}
