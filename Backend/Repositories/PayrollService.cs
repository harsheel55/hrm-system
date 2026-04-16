using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class PayrollService : IPayrollService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public PayrollService(AppDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
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

        public async Task<PayrollEmployeeDto> UpsertPayrollEmployeeSalaryAsync(UpsertPayrollEmployeeSalaryDto dto)
        {
            var userExists = await _context.Users.AnyAsync(u => u.strUserGUID == dto.strUserGUID && u.bolIsActive);
            if (!userExists)
            {
                throw new Exception("Employee user not found");
            }

            var gross = dto.decBaseSalary + dto.decHRA + dto.decTransportAllowance + dto.decMedicalAllowance + dto.decPerformanceBonus;
            var deductions = dto.decProvidentFund + dto.decIncomeTax + dto.decHealthInsurance;
            var net = gross - deductions;

            var existing = await _context.PayrollEmployees
                .Include(pe => pe.User)
                .FirstOrDefaultAsync(pe =>
                    pe.strUserGUID == dto.strUserGUID &&
                    pe.strPayPeriod == dto.strPayPeriod &&
                    pe.bitIsActive);

            if (existing == null)
            {
                existing = new PayrollEmployee
                {
                    strUserGUID = dto.strUserGUID,
                    strPayPeriod = dto.strPayPeriod,
                    strEmploymentType = dto.strEmploymentType,
                    decBaseSalary = dto.decBaseSalary,
                    decHRA = dto.decHRA,
                    decTransportAllowance = dto.decTransportAllowance,
                    decMedicalAllowance = dto.decMedicalAllowance,
                    decPerformanceBonus = dto.decPerformanceBonus,
                    decGrossEarnings = gross,
                    decProvidentFund = dto.decProvidentFund,
                    decIncomeTax = dto.decIncomeTax,
                    decHealthInsurance = dto.decHealthInsurance,
                    decTotalDeductions = deductions,
                    decNetPay = net,
                    strBankLast4 = dto.strBankLast4,
                    strBankName = dto.strBankName,
                    strTaxBracket = dto.strTaxBracket,
                    decYTDGross = gross,
                    decYTDTax = dto.decIncomeTax,
                    dtCreatedAt = DateTime.UtcNow,
                    bitIsActive = true
                };

                _context.PayrollEmployees.Add(existing);
            }
            else
            {
                existing.strEmploymentType = dto.strEmploymentType;
                existing.decBaseSalary = dto.decBaseSalary;
                existing.decHRA = dto.decHRA;
                existing.decTransportAllowance = dto.decTransportAllowance;
                existing.decMedicalAllowance = dto.decMedicalAllowance;
                existing.decPerformanceBonus = dto.decPerformanceBonus;
                existing.decGrossEarnings = gross;
                existing.decProvidentFund = dto.decProvidentFund;
                existing.decIncomeTax = dto.decIncomeTax;
                existing.decHealthInsurance = dto.decHealthInsurance;
                existing.decTotalDeductions = deductions;
                existing.decNetPay = net;
                existing.strBankLast4 = dto.strBankLast4;
                existing.strBankName = dto.strBankName;
                existing.strTaxBracket = dto.strTaxBracket;
                existing.decYTDGross = existing.decYTDGross + gross;
                existing.decYTDTax = existing.decYTDTax + dto.decIncomeTax;
                existing.dtUpdatedAt = DateTime.UtcNow;
                _context.PayrollEmployees.Update(existing);
            }

            await _context.SaveChangesAsync();

            var saved = await _context.PayrollEmployees
                .Include(pe => pe.User)
                .FirstOrDefaultAsync(pe => pe.strPayrollEmployeeGUID == existing.strPayrollEmployeeGUID)
                ?? throw new Exception("Failed to save employee salary");

            return MapPayrollEmployeeDto(saved);
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

        public async Task<PayrollRunDto> InitiateBankTransferAsync(Guid runId)
        {
            var run = await _context.PayrollRuns
                .FirstOrDefaultAsync(pr => pr.strPayrollRunGUID == runId && pr.bitIsActive)
                ?? throw new Exception("Payroll run not found");

            var steps = JsonSerializer.Deserialize<List<PayrollStepDto>>(run.strStepsJSON) ?? new();
            var bankStep = steps.FirstOrDefault(s => s.label.Equals("Bank transfer", StringComparison.OrdinalIgnoreCase));
            if (bankStep != null)
            {
                bankStep.done = true;
            }

            var payslipStep = steps.FirstOrDefault(s => s.label.Equals("Payslip dispatch", StringComparison.OrdinalIgnoreCase));
            if (payslipStep != null)
            {
                payslipStep.done = true;
            }

            run.strStatus = "paid";
            run.dtPaidAt = DateTime.UtcNow;
            run.dtUpdatedAt = DateTime.UtcNow;
            run.strStepsJSON = JsonSerializer.Serialize(steps);

            _context.PayrollRuns.Update(run);
            await _context.SaveChangesAsync();

            return await GetPayrollRunAsync(runId) ?? throw new Exception("Failed to update payroll run");
        }

        public async Task<PayrollPayslipDispatchResultDto> SendAllPayslipsAsync(string payPeriod, string? requestedByEmail = null)
        {
            var normalizedPayPeriod = string.IsNullOrWhiteSpace(payPeriod) ? "March 2026" : payPeriod.Trim();

            var employees = await _context.PayrollEmployees
                .Where(pe => pe.bitIsActive && pe.strPayPeriod == normalizedPayPeriod)
                .Include(pe => pe.User)
                .ToListAsync();

            var employeesWithEmail = employees
                .Where(pe => !string.IsNullOrWhiteSpace(pe.User?.strEmail))
                .ToList();

            var skippedRecipients = employees
                .Where(pe => string.IsNullOrWhiteSpace(pe.User?.strEmail))
                .Select(pe => new PayrollEmailDispatchItemDto
                {
                    name = pe.User?.strUserName ?? "Employee",
                    email = string.Empty,
                    reason = "Missing employee email"
                })
                .ToList();

            var sentRecipients = new List<PayrollEmailDispatchItemDto>();
            var failedRecipients = new List<PayrollEmailDispatchItemDto>();

            var sentCount = 0;
            var failedCount = 0;

            foreach (var employee in employeesWithEmail)
            {
                var userName = employee.User?.strUserName ?? "Employee";
                var email = employee.User?.strEmail?.Trim() ?? string.Empty;
                if (string.IsNullOrWhiteSpace(email))
                {
                    continue;
                }

                var subject = $"Payslip for {normalizedPayPeriod}";
                var body = BuildPayslipEmailBody(employee, normalizedPayPeriod, userName);
                var isSent = await _emailService.SendEmailAsync(email, subject, body, true);

                if (isSent)
                {
                    sentCount += 1;
                    sentRecipients.Add(new PayrollEmailDispatchItemDto
                    {
                        name = userName,
                        email = email,
                        reason = "Payslip delivered to SMTP provider"
                    });
                }
                else
                {
                    failedCount += 1;
                    failedRecipients.Add(new PayrollEmailDispatchItemDto
                    {
                        name = userName,
                        email = email,
                        reason = "SMTP send failed"
                    });
                }
            }

            var runUpdated = false;
            var latestRun = await _context.PayrollRuns
                .Where(pr => pr.bitIsActive && pr.strPayPeriod == normalizedPayPeriod)
                .OrderByDescending(pr => pr.dtCreatedAt)
                .FirstOrDefaultAsync();

            if (latestRun != null)
            {
                var steps = JsonSerializer.Deserialize<List<PayrollStepDto>>(latestRun.strStepsJSON) ?? new();
                var payslipStep = steps.FirstOrDefault(s => s.label.Equals("Payslip dispatch", StringComparison.OrdinalIgnoreCase));
                if (payslipStep != null)
                {
                    payslipStep.done = sentCount > 0;
                    latestRun.strStepsJSON = JsonSerializer.Serialize(steps);
                    latestRun.dtUpdatedAt = DateTime.UtcNow;
                    _context.PayrollRuns.Update(latestRun);
                    await _context.SaveChangesAsync();
                    runUpdated = true;
                }
            }

            var requesterNotified = false;
            if (!string.IsNullOrWhiteSpace(requestedByEmail))
            {
                var summarySubject = $"Payslip dispatch summary - {normalizedPayPeriod}";
                var summaryBody = BuildPayslipDispatchSummaryEmailBody(
                    normalizedPayPeriod,
                    employees.Count,
                    sentCount,
                    failedCount,
                    skippedRecipients.Count,
                    sentRecipients,
                    failedRecipients,
                    skippedRecipients);

                requesterNotified = await _emailService.SendEmailAsync(requestedByEmail.Trim(), summarySubject, summaryBody, true);
            }

            var result = new PayrollPayslipDispatchResultDto
            {
                payPeriod = normalizedPayPeriod,
                totalEmployees = employees.Count,
                employeesWithEmail = employeesWithEmail.Count,
                sentCount = sentCount,
                failedCount = failedCount,
                skippedCount = skippedRecipients.Count,
                runUpdated = runUpdated,
                requesterNotified = requesterNotified,
                sentRecipients = sentRecipients,
                failedRecipients = failedRecipients,
                skippedRecipients = skippedRecipients
            };

            return result;
        }

        public async Task<PayrollExportDto> ExportPayrollDataAsync(string section, string payPeriod)
        {
            var normalizedSection = string.IsNullOrWhiteSpace(section) ? "employees" : section.Trim().ToLowerInvariant();
            var csv = normalizedSection switch
            {
                "runs" => await BuildRunsCsvAsync(),
                "compliance" => await BuildComplianceCsvAsync(),
                _ => await BuildEmployeesCsvAsync(payPeriod)
            };

            var bytes = Encoding.UTF8.GetBytes(csv);
            return new PayrollExportDto
            {
                fileName = $"payroll-{normalizedSection}-{DateTime.UtcNow:yyyyMMddHHmmss}.csv",
                contentType = "text/csv",
                base64Content = Convert.ToBase64String(bytes)
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
            var userBankLast4 = string.IsNullOrWhiteSpace(pe.User?.strBankAccountNo)
                ? string.Empty
                : pe.User!.strBankAccountNo.Trim().Length >= 4
                    ? pe.User.strBankAccountNo.Trim()[^4..]
                    : pe.User.strBankAccountNo.Trim();

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
                bankLast4 = !string.IsNullOrWhiteSpace(userBankLast4) ? userBankLast4 : pe.strBankLast4,
                bankName = !string.IsNullOrWhiteSpace(pe.User?.strBankName) ? pe.User!.strBankName : pe.strBankName,
                taxBracket = !string.IsNullOrWhiteSpace(pe.User?.strTaxBracket) ? pe.User!.strTaxBracket : pe.strTaxBracket,
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
                runCode = pr.strRunID,
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

        private async Task<string> BuildEmployeesCsvAsync(string payPeriod)
        {
            var employees = await _context.PayrollEmployees
                .Where(pe => pe.bitIsActive && pe.strPayPeriod == payPeriod)
                .Include(pe => pe.User)
                .ToListAsync();

            var sb = new StringBuilder();
            sb.AppendLine("Employee,Department,Role,Period,Gross,Deductions,Net,Bank,Tax Bracket");
            foreach (var employee in employees)
            {
                var name = employee.User?.strUserName ?? "Unknown";
                sb.AppendLine(string.Join(",",
                    CsvEscape(name),
                    CsvEscape("Engineering"),
                    CsvEscape("Employee"),
                    CsvEscape(employee.strPayPeriod),
                    employee.decGrossEarnings,
                    employee.decTotalDeductions,
                    employee.decNetPay,
                    CsvEscape($"{employee.strBankName} (****{employee.strBankLast4})"),
                    CsvEscape(employee.strTaxBracket)));
            }

            return sb.ToString();
        }

        private async Task<string> BuildRunsCsvAsync()
        {
            var runs = await _context.PayrollRuns
                .Where(pr => pr.bitIsActive)
                .OrderByDescending(pr => pr.dtCreatedAt)
                .ToListAsync();

            var sb = new StringBuilder();
            sb.AppendLine("Run ID,Period,Status,Employees,Gross,Deductions,Net,Initiated At,Paid At");
            foreach (var run in runs)
            {
                sb.AppendLine(string.Join(",",
                    CsvEscape(run.strRunID),
                    CsvEscape(run.strPayPeriod),
                    CsvEscape(run.strStatus),
                    run.intEmployeeCount,
                    run.decTotalGross,
                    run.decTotalDeductions,
                    run.decTotalNetPay,
                    CsvEscape(run.dtInitiatedAt.ToString("yyyy-MM-dd HH:mm:ss")),
                    CsvEscape(run.dtPaidAt?.ToString("yyyy-MM-dd") ?? string.Empty)));
            }

            return sb.ToString();
        }

        private async Task<string> BuildComplianceCsvAsync()
        {
            var compliance = await _context.PayrollCompliances
                .Where(pc => pc.bitIsActive)
                .OrderBy(pc => pc.dtDueDate)
                .ToListAsync();

            var sb = new StringBuilder();
            sb.AppendLine("Title,Authority,Category,Period,Due Date,Status,Amount");
            foreach (var item in compliance)
            {
                sb.AppendLine(string.Join(",",
                    CsvEscape(item.strTitle),
                    CsvEscape(item.strAuthority),
                    CsvEscape(item.strCategory),
                    CsvEscape(item.strPeriod),
                    CsvEscape(item.dtDueDate.ToString("yyyy-MM-dd")),
                    CsvEscape(item.strStatus),
                    item.decAmount?.ToString() ?? string.Empty));
            }

            return sb.ToString();
        }

        private static string BuildPayslipEmailBody(PayrollEmployee employee, string payPeriod, string userName)
        {
            var bankLast4 = string.IsNullOrWhiteSpace(employee.strBankLast4) ? "N/A" : employee.strBankLast4;
            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937; }}
        .wrap {{ max-width: 640px; margin: 0 auto; padding: 20px; }}
        .card {{ border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; }}
        .title {{ margin: 0 0 8px; font-size: 20px; font-weight: 700; }}
        .muted {{ color: #6b7280; font-size: 13px; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 12px; }}
        td {{ padding: 8px; border-bottom: 1px solid #f3f4f6; font-size: 14px; }}
        td:last-child {{ text-align: right; font-weight: 600; }}
        .net td {{ font-weight: 700; border-top: 2px solid #e5e7eb; }}
    </style>
</head>
<body>
    <div class='wrap'>
        <div class='card'>
            <h1 class='title'>Payslip - {payPeriod}</h1>
            <p class='muted'>Hello {userName}, your salary has been processed for {payPeriod}.</p>
            <p class='muted'>Bank account: ****{bankLast4}</p>
            <table>
                <tr><td>Gross Earnings</td><td>${employee.decGrossEarnings:N2}</td></tr>
                <tr><td>Total Deductions</td><td>${employee.decTotalDeductions:N2}</td></tr>
                <tr class='net'><td>Net Pay</td><td>${employee.decNetPay:N2}</td></tr>
            </table>
        </div>
    </div>
</body>
</html>";
        }

        private static string BuildPayslipDispatchSummaryEmailBody(
            string payPeriod,
            int totalEmployees,
            int sentCount,
            int failedCount,
            int skippedCount,
            List<PayrollEmailDispatchItemDto> sentRecipients,
            List<PayrollEmailDispatchItemDto> failedRecipients,
            List<PayrollEmailDispatchItemDto> skippedRecipients)
        {
            string BuildRecipientRows(List<PayrollEmailDispatchItemDto> recipients)
            {
                if (recipients.Count == 0)
                {
                    return "<tr><td colspan='3'>None</td></tr>";
                }

                return string.Join(string.Empty, recipients.Select(r =>
                    $"<tr><td>{System.Net.WebUtility.HtmlEncode(r.name)}</td><td>{System.Net.WebUtility.HtmlEncode(r.email)}</td><td>{System.Net.WebUtility.HtmlEncode(r.reason)}</td></tr>"));
            }

            return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.5; color: #1f2937; }}
        .wrap {{ max-width: 800px; margin: 0 auto; padding: 20px; }}
        .card {{ border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; }}
        .title {{ margin: 0 0 8px; font-size: 20px; font-weight: 700; }}
        .muted {{ color: #6b7280; font-size: 13px; }}
        table {{ width: 100%; border-collapse: collapse; margin-top: 8px; }}
        th, td {{ border: 1px solid #e5e7eb; padding: 8px; text-align: left; font-size: 13px; }}
        th {{ background: #f9fafb; }}
    </style>
</head>
<body>
    <div class='wrap'>
        <div class='card'>
            <h1 class='title'>Payslip Dispatch Summary</h1>
            <p class='muted'>Pay period: {payPeriod}</p>
            <p><strong>Total employees:</strong> {totalEmployees}</p>
            <p><strong>Sent:</strong> {sentCount} | <strong>Failed:</strong> {failedCount} | <strong>Skipped:</strong> {skippedCount}</p>
        </div>

        <div class='card'>
            <h2 style='margin:0 0 8px;'>Sent Recipients</h2>
            <table>
                <thead><tr><th>Name</th><th>Email</th><th>Status</th></tr></thead>
                <tbody>{BuildRecipientRows(sentRecipients)}</tbody>
            </table>
        </div>

        <div class='card'>
            <h2 style='margin:0 0 8px;'>Failed Recipients</h2>
            <table>
                <thead><tr><th>Name</th><th>Email</th><th>Reason</th></tr></thead>
                <tbody>{BuildRecipientRows(failedRecipients)}</tbody>
            </table>
        </div>

        <div class='card'>
            <h2 style='margin:0 0 8px;'>Skipped Recipients</h2>
            <table>
                <thead><tr><th>Name</th><th>Email</th><th>Reason</th></tr></thead>
                <tbody>{BuildRecipientRows(skippedRecipients)}</tbody>
            </table>
        </div>
    </div>
</body>
</html>";
        }

        private static string CsvEscape(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            if (value.Contains(',') || value.Contains('"') || value.Contains('\n'))
            {
                return $"\"{value.Replace("\"", "\"\"")}\"";
            }

            return value;
        }

        #endregion
    }
}
