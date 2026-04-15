using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class PayrollService : IPayrollService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public PayrollService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<List<PayrollEmployeeDto>> GetPayrollEmployeesAsync(string payPeriod)
        {
            var employees = await _context.PayrollEmployees
                .Where(pe => pe.strPayPeriod == payPeriod && pe.bitIsActive)
                .Include(pe => pe.User)
                .ToListAsync();

            return employees.Select(MapPayrollEmployeeDto).ToList();
        }

        public async Task<List<PayrollRunDto>> GetPayrollRunsAsync()
        {
            var runs = await _context.PayrollRuns
                .Where(pr => pr.bitIsActive)
                .OrderByDescending(pr => pr.dtCreatedAt)
                .Include(pr => pr.InitiatedByUser)
                .ToListAsync();

            return runs.Select(MapPayrollRunDto).ToList();
        }

        public async Task<PayrollRunDto?> GetPayrollRunAsync(Guid runId)
        {
            var run = await _context.PayrollRuns
                .Where(pr => pr.strPayrollRunGUID == runId && pr.bitIsActive)
                .Include(pr => pr.InitiatedByUser)
                .FirstOrDefaultAsync();

            return run != null ? MapPayrollRunDto(run) : null;
        }

        public async Task<PayrollRunDto> CreatePayrollRunAsync(CreatePayrollRunDto dto)
        {
            var run = new PayrollRun
            {
                strRunID = GenerateRunID(),
                strPayPeriod = dto.strPayPeriod,
                strStatus = "draft",
                intEmployeeCount = dto.intEmployeeCount,
                decTotalGross = dto.decTotalGross,
                decTotalDeductions = dto.decTotalDeductions,
                decTotalNetPay = dto.decTotalNetPay,
                strStepsJSON = JsonSerializer.Serialize(GetDefaultPayrollSteps()),
                dtInitiatedAt = DateTime.UtcNow
            };

            _context.PayrollRuns.Add(run);
            await _context.SaveChangesAsync();

            return await GetPayrollRunAsync(run.strPayrollRunGUID) ?? throw new Exception("Failed to create payroll run");
        }

        public async Task<PayrollRunDto> UpdatePayrollRunStatusAsync(Guid runId, UpdatePayrollRunStatusDto dto)
        {
            var run = await _context.PayrollRuns.FirstOrDefaultAsync(pr => pr.strPayrollRunGUID == runId && pr.bitIsActive)
                ?? throw new Exception("Payroll run not found");

            run.strStatus = dto.strStatus;
            if (dto.steps != null)
            {
                run.strStepsJSON = JsonSerializer.Serialize(dto.steps);
            }

            if (dto.strStatus == "paid")
            {
                run.dtPaidAt = DateTime.UtcNow;
            }

            run.dtUpdatedAt = DateTime.UtcNow;
            _context.PayrollRuns.Update(run);
            await _context.SaveChangesAsync();

            return await GetPayrollRunAsync(runId) ?? throw new Exception("Failed to update payroll run");
        }

        public async Task<List<PayrollComplianceDto>> GetComplianceItemsAsync()
        {
            var items = await _context.PayrollCompliances
                .Where(pc => pc.bitIsActive)
                .OrderBy(pc => pc.dtDueDate)
                .ToListAsync();

            return items.Select(MapComplianceDto).ToList();
        }

        public async Task<PayrollComplianceDto> CreateComplianceItemAsync(CreatePayrollComplianceDto dto)
        {
            var compliance = new PayrollCompliance
            {
                strTitle = dto.strTitle,
                strAuthority = dto.strAuthority,
                strCategory = dto.strCategory,
                dtDueDate = dto.dtDueDate,
                strStatus = dto.strStatus,
                decAmount = dto.decAmount,
                strPeriod = dto.strPeriod,
                strDescription = dto.strDescription,
                dtCreatedAt = DateTime.UtcNow
            };

            _context.PayrollCompliances.Add(compliance);
            await _context.SaveChangesAsync();

            return MapComplianceDto(compliance);
        }

        public async Task<PayrollComplianceDto> UpdateComplianceStatusAsync(Guid complianceId, string status)
        {
            var compliance = await _context.PayrollCompliances
                .FirstOrDefaultAsync(pc => pc.strComplianceGUID == complianceId && pc.bitIsActive)
                ?? throw new Exception("Compliance item not found");

            compliance.strStatus = status;
            if (status == "filed")
            {
                compliance.dtFiledAt = DateTime.UtcNow;
            }

            compliance.dtUpdatedAt = DateTime.UtcNow;
            _context.PayrollCompliances.Update(compliance);
            await _context.SaveChangesAsync();

            return MapComplianceDto(compliance);
        }

        public async Task<PayrollAnalyticsDto> GetAnalyticsAsync()
        {
            var currentPeriod = "March 2026";
            var employees = await _context.PayrollEmployees
                .Where(pe => pe.strPayPeriod == currentPeriod && pe.bitIsActive)
                .ToListAsync();

            var totalGross = employees.Sum(e => e.decGrossEarnings);
            var totalDeductions = employees.Sum(e => e.decTotalDeductions);
            var totalNet = employees.Sum(e => e.decNetPay);

            var compliance = await _context.PayrollCompliances
                .Where(pc => pc.bitIsActive && (pc.strStatus == "pending" || pc.strStatus == "overdue"))
                .ToListAsync();

            return new PayrollAnalyticsDto
            {
                totalGross = totalGross,
                totalDeductions = totalDeductions,
                totalNetPay = totalNet,
                compliancePending = compliance.Count,
                monthlyTrend = GetMonthlyTrend(),
                departmentCosts = await GetDepartmentCosts()
            };
        }

        public async Task SeedPayrollDataIfEmptyAsync()
        {
            if (await _context.PayrollEmployees.AnyAsync())
                return;

            var users = await _context.Users.ToListAsync();
            var currentPeriod = "March 2026";

            var payrollEmployees = new List<PayrollEmployee>
            {
                new PayrollEmployee
                {
                    strUserGUID = users.FirstOrDefault()?.strUserGUID ?? Guid.NewGuid(),
                    strPayPeriod = currentPeriod,
                    strEmploymentType = "full-time",
                    decBaseSalary = 10000, decHRA = 4000, decTransportAllowance = 400, decMedicalAllowance = 600, decPerformanceBonus = 1500,
                    decGrossEarnings = 16500,
                    decProvidentFund = 1200, decIncomeTax = 1950, decHealthInsurance = 350,
                    decTotalDeductions = 3500, decNetPay = 13000,
                    strBankLast4 = "4421", strBankName = "Chase Bank", strTaxBracket = "22%",
                    decYTDGross = 49500, decYTDTax = 5850
                },
                new PayrollEmployee
                {
                    strUserGUID = users.Skip(1).FirstOrDefault()?.strUserGUID ?? Guid.NewGuid(),
                    strPayPeriod = currentPeriod,
                    strEmploymentType = "full-time",
                    decBaseSalary = 9500, decHRA = 3800, decTransportAllowance = 400, decMedicalAllowance = 600, decPerformanceBonus = 3000,
                    decGrossEarnings = 17300,
                    decProvidentFund = 1140, decIncomeTax = 2340, decHealthInsurance = 350,
                    decTotalDeductions = 3830, decNetPay = 13470,
                    strBankLast4 = "7782", strBankName = "Citibank", strTaxBracket = "24%",
                    decYTDGross = 51900, decYTDTax = 7020
                },
                new PayrollEmployee
                {
                    strUserGUID = users.Skip(2).FirstOrDefault()?.strUserGUID ?? Guid.NewGuid(),
                    strPayPeriod = currentPeriod,
                    strEmploymentType = "full-time",
                    decBaseSalary = 11000, decHRA = 4400, decTransportAllowance = 400, decMedicalAllowance = 600, decPerformanceBonus = 0,
                    decGrossEarnings = 16400,
                    decProvidentFund = 1320, decIncomeTax = 2200, decHealthInsurance = 350,
                    decTotalDeductions = 3870, decNetPay = 12530,
                    strBankLast4 = "1193", strBankName = "Bank of America", strTaxBracket = "22%",
                    decYTDGross = 49200, decYTDTax = 6600
                },
            };

            _context.PayrollEmployees.AddRange(payrollEmployees);

            var payrollRun = new PayrollRun
            {
                strRunID = "PR-2026-03",
                strPayPeriod = currentPeriod,
                strStatus = "approved",
                intEmployeeCount = payrollEmployees.Count,
                decTotalGross = payrollEmployees.Sum(p => p.decGrossEarnings),
                decTotalDeductions = payrollEmployees.Sum(p => p.decTotalDeductions),
                decTotalNetPay = payrollEmployees.Sum(p => p.decNetPay),
                strStepsJSON = JsonSerializer.Serialize(GetDefaultPayrollSteps()),
                dtInitiatedAt = DateTime.UtcNow
            };

            _context.PayrollRuns.Add(payrollRun);

            var complianceItems = new List<PayrollCompliance>
            {
                new PayrollCompliance
                {
                    strTitle = "Federal Income Tax (FICA) Deposit",
                    strAuthority = "IRS",
                    strCategory = "Tax",
                    dtDueDate = DateTime.Parse("2026-03-31"),
                    strStatus = "pending",
                    decAmount = 14820,
                    strPeriod = "Mar 2026"
                },
                new PayrollCompliance
                {
                    strTitle = "401(k) Employer Contribution Remittance",
                    strAuthority = "Plan Administrator",
                    strCategory = "Benefits",
                    dtDueDate = DateTime.Parse("2026-03-31"),
                    strStatus = "pending",
                    decAmount = 8640,
                    strPeriod = "Mar 2026"
                },
                new PayrollCompliance
                {
                    strTitle = "Workers Comp Premium Audit",
                    strAuthority = "Insurance Co.",
                    strCategory = "Insurance",
                    dtDueDate = DateTime.Parse("2026-03-15"),
                    strStatus = "overdue"
                },
            };

            _context.PayrollCompliances.AddRange(complianceItems);
            await _context.SaveChangesAsync();
        }

        #region Helper Methods

        private PayrollEmployeeDto MapPayrollEmployeeDto(PayrollEmployee pe)
        {
            return new PayrollEmployeeDto
            {
                id = pe.strPayrollEmployeeGUID,
                userId = pe.strUserGUID,
                name = pe.User?.strUserName ?? "Unknown",
                avatar = GetInitials(pe.User?.strUserName ?? ""),
                dept = "Engineering", // Default department, can be extended with user property
                role = "Employee", // Default role, can be extended based on UserRole
                payPeriod = pe.strPayPeriod,
                empType = pe.strEmploymentType,
                base_ = pe.decBaseSalary,
                hra = pe.decHRA,
                transport = pe.decTransportAllowance,
                medical = pe.decMedicalAllowance,
                bonus = pe.decPerformanceBonus,
                gross = pe.decGrossEarnings,
                provident = pe.decProvidentFund,
                incomeTax = pe.decIncomeTax,
                insurance = pe.decHealthInsurance,
                totalDeductions = pe.decTotalDeductions,
                net = pe.decNetPay,
                bankLast4 = pe.strBankLast4,
                bankName = pe.strBankName,
                taxBracket = pe.strTaxBracket,
                ytdGross = pe.decYTDGross,
                ytdTax = pe.decYTDTax
            };
        }

        private PayrollRunDto MapPayrollRunDto(PayrollRun pr)
        {
            var steps = JsonSerializer.Deserialize<List<PayrollStepDto>>(pr.strStepsJSON) ?? new();

            return new PayrollRunDto
            {
                id = pr.strPayrollRunGUID,
                period = pr.strPayPeriod,
                status = pr.strStatus,
                employees = pr.intEmployeeCount,
                gross = pr.decTotalGross,
                deductions = pr.decTotalDeductions,
                net = pr.decTotalNetPay,
                initiatedBy = pr.InitiatedByUser?.strUserName ?? "System",
                initiatedAt = pr.dtInitiatedAt.ToString("MMM dd, yyyy · h:mm tt"),
                paidAt = pr.dtPaidAt != null ? pr.dtPaidAt.Value.ToString("MMM dd, yyyy") : null,
                steps = steps
            };
        }

        private PayrollComplianceDto MapComplianceDto(PayrollCompliance pc)
        {
            return new PayrollComplianceDto
            {
                id = pc.strComplianceGUID,
                title = pc.strTitle,
                authority = pc.strAuthority,
                dueDate = pc.dtDueDate.ToString("MMM dd, yyyy"),
                status = pc.strStatus,
                amount = pc.decAmount,
                period = pc.strPeriod,
                category = pc.strCategory
            };
        }

        private List<PayrollStepDto> GetDefaultPayrollSteps()
        {
            return new List<PayrollStepDto>
            {
                new PayrollStepDto { label = "Import attendance & overtime data", done = true },
                new PayrollStepDto { label = "Validate salary structures", done = true },
                new PayrollStepDto { label = "Apply tax & deductions", done = true },
                new PayrollStepDto { label = "Manager approval", done = true },
                new PayrollStepDto { label = "Bank transfer", done = false },
                new PayrollStepDto { label = "Payslip dispatch", done = false }
            };
        }

        private string GenerateRunID()
        {
            var month = DateTime.Now.Month.ToString("D2");
            var year = DateTime.Now.Year;
            return $"PR-{year}-{month}";
        }

        private string GetInitials(string name)
        {
            if (string.IsNullOrEmpty(name)) return "U";
            var parts = name.Split(' ');
            return parts.Length >= 2 ? (parts[0][0].ToString() + parts[1][0].ToString()).ToUpper() : name.Substring(0, Math.Min(2, name.Length)).ToUpper();
        }

        private List<MonthlyTrendDto> GetMonthlyTrend()
        {
            return new List<MonthlyTrendDto>
            {
                new() { month = "Oct", gross = 108200 },
                new() { month = "Nov", gross = 111400 },
                new() { month = "Dec", gross = 119800 },
                new() { month = "Jan", gross = 115400 },
                new() { month = "Feb", gross = 124300 },
                new() { month = "Mar", gross = 128700 },
            };
        }

        private async Task<List<DepartmentCostDto>> GetDepartmentCosts()
        {
            var users = await _context.Users.Where(u => u.bolIsActive).ToListAsync();

            var deptGrouped = users
                .GroupBy(u => "Engineering") // Placeholder since User doesn't have department field
                .Select(g => new DepartmentCostDto
                {
                    department = g.Key,
                    staffCount = g.Count(),
                    cost = g.Count() * 10000m,
                    percentage = users.Count > 0 ? (g.Count() * 100) / users.Count : 0
                })
                .ToList();

            return deptGrouped;
        }

        #endregion
    }
}
