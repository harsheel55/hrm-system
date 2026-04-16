using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PayrollController : ControllerBase
    {
        private readonly IPayrollService _payrollService;
        private readonly ILogger<PayrollController> _logger;

        public PayrollController(IPayrollService payrollService, ILogger<PayrollController> logger)
        {
            _payrollService = payrollService;
            _logger = logger;
        }

        /// <summary>
        /// Get all payroll employees for a specific pay period
        /// </summary>
        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees([FromQuery] string payPeriod = "March 2026")
        {
            try
            {
                var employees = await _payrollService.GetPayrollEmployeesAsync(payPeriod);
                return Ok(new ApiResponse<List<PayrollEmployeeDto>>
                {
                    statusCode = 200,
                    message = "Payroll employees fetched successfully",
                    data = employees
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payroll employees");
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to fetch payroll employees",
                    data = null
                });
            }
        }

        /// <summary>
        /// Get all payroll runs
        /// </summary>
        [HttpGet("runs")]
        public async Task<IActionResult> GetPayrollRuns()
        {
            try
            {
                var runs = await _payrollService.GetPayrollRunsAsync();
                return Ok(new ApiResponse<List<PayrollRunDto>>
                {
                    statusCode = 200,
                    message = "Payroll runs fetched successfully",
                    data = runs
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payroll runs");
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to fetch payroll runs",
                    data = null
                });
            }
        }

        /// <summary>
        /// Get a specific payroll run
        /// </summary>
        [HttpGet("runs/{runId}")]
        public async Task<IActionResult> GetPayrollRun(Guid runId)
        {
            try
            {
                var run = await _payrollService.GetPayrollRunAsync(runId);
                if (run == null)
                    return NotFound(new ApiResponse<object>
                    {
                        statusCode = 404,
                        message = "Payroll run not found",
                        data = null
                    });

                return Ok(new ApiResponse<PayrollRunDto>
                {
                    statusCode = 200,
                    message = "Payroll run fetched successfully",
                    data = run
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payroll run {RunId}", runId);
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to fetch payroll run",
                    data = null
                });
            }
        }

        /// <summary>
        /// Create a new payroll run
        /// Requires HR or Admin role
        /// </summary>
        [HttpPost("runs")]
        [Authorize(Roles = "Super Admin,Administrator,Admin,HR")]
        public async Task<IActionResult> CreatePayrollRun([FromBody] CreatePayrollRunDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.strPayPeriod))
                    return BadRequest(new ApiResponse<object>
                    {
                        statusCode = 400,
                        message = "Pay period is required",
                        data = null
                    });

                var run = await _payrollService.CreatePayrollRunAsync(dto);
                return CreatedAtAction(nameof(GetPayrollRun), new { runId = run.id }, new ApiResponse<PayrollRunDto>
                {
                    statusCode = 201,
                    message = "Payroll run created successfully",
                    data = run
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating payroll run");
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to create payroll run",
                    data = null
                });
            }
        }

        /// <summary>
        /// Update payroll run status
        /// Requires HR or Admin role
        /// </summary>
        [HttpPut("runs/{runId}")]
        [Authorize(Roles = "Super Admin,Administrator,Admin,HR")]
        public async Task<IActionResult> UpdatePayrollRunStatus(Guid runId, [FromBody] UpdatePayrollRunStatusDto dto)
        {
            try
            {
                var run = await _payrollService.UpdatePayrollRunStatusAsync(runId, dto);
                return Ok(new ApiResponse<PayrollRunDto>
                {
                    statusCode = 200,
                    message = "Payroll run updated successfully",
                    data = run
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating payroll run {RunId}", runId);
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to update payroll run",
                    data = null
                });
            }
        }

        /// <summary>
        /// Assign or update salary for an employee in a pay period
        /// Requires HR or Admin role
        /// </summary>
        [HttpPost("employees/salary")]
        [Authorize(Roles = "Super Admin,Administrator,Admin,HR")]
        public async Task<IActionResult> UpsertEmployeeSalary([FromBody] UpsertPayrollEmployeeSalaryDto dto)
        {
            try
            {
                if (dto.strUserGUID == Guid.Empty)
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        statusCode = 400,
                        message = "User ID is required",
                        data = null
                    });
                }

                if (string.IsNullOrWhiteSpace(dto.strPayPeriod))
                {
                    return BadRequest(new ApiResponse<object>
                    {
                        statusCode = 400,
                        message = "Pay period is required",
                        data = null
                    });
                }

                var salary = await _payrollService.UpsertPayrollEmployeeSalaryAsync(dto);
                return Ok(new ApiResponse<PayrollEmployeeDto>
                {
                    statusCode = 200,
                    message = "Employee salary saved successfully",
                    data = salary
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error upserting employee salary for user {UserId}", dto.strUserGUID);
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to save employee salary",
                    data = null
                });
            }
        }

        /// <summary>
        /// Initiate bank transfer for an approved payroll run
        /// Requires HR or Admin role
        /// </summary>
        [HttpPost("runs/{runId}/bank-transfer")]
        [Authorize(Roles = "Super Admin,Administrator,Admin,HR")]
        public async Task<IActionResult> InitiateBankTransfer(Guid runId)
        {
            try
            {
                var run = await _payrollService.InitiateBankTransferAsync(runId);
                return Ok(new ApiResponse<PayrollRunDto>
                {
                    statusCode = 200,
                    message = "Bank transfer initiated successfully",
                    data = run
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error initiating bank transfer for run {RunId}", runId);
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to initiate bank transfer",
                    data = null
                });
            }
        }

        /// <summary>
        /// Send payslips to all employees for a pay period
        /// Requires HR or Admin role
        /// </summary>
        [HttpPost("payslips/send-all")]
        [Authorize(Roles = "Super Admin,Administrator,Admin,HR")]
        public async Task<IActionResult> SendAllPayslips([FromQuery] string payPeriod = "March 2026")
        {
            try
            {
                var requestedByEmail = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue(ClaimTypes.Name);
                var result = await _payrollService.SendAllPayslipsAsync(payPeriod, requestedByEmail);
                return Ok(new ApiResponse<PayrollPayslipDispatchResultDto>
                {
                    statusCode = 200,
                    message = "Payslip dispatch completed",
                    data = result
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending all payslips for pay period {PayPeriod}", payPeriod);
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to send payslips",
                    data = null
                });
            }
        }

        /// <summary>
        /// Get all compliance items
        /// </summary>
        [HttpGet("compliance")]
        public async Task<IActionResult> GetComplianceItems()
        {
            try
            {
                var compliance = await _payrollService.GetComplianceItemsAsync();
                return Ok(new ApiResponse<List<PayrollComplianceDto>>
                {
                    statusCode = 200,
                    message = "Compliance items fetched successfully",
                    data = compliance
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching compliance items");
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to fetch compliance items",
                    data = null
                });
            }
        }

        /// <summary>
        /// Create a new compliance item
        /// Requires HR or Admin role
        /// </summary>
        [HttpPost("compliance")]
        [Authorize(Roles = "Super Admin,Administrator,Admin,HR")]
        public async Task<IActionResult> CreateComplianceItem([FromBody] CreatePayrollComplianceDto dto)
        {
            try
            {
                var compliance = await _payrollService.CreateComplianceItemAsync(dto);
                return CreatedAtAction(nameof(GetComplianceItems), new ApiResponse<PayrollComplianceDto>
                {
                    statusCode = 201,
                    message = "Compliance item created successfully",
                    data = compliance
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating compliance item");
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to create compliance item",
                    data = null
                });
            }
        }

        /// <summary>
        /// Update compliance item status
        /// Requires HR or Admin role
        /// </summary>
        [HttpPut("compliance/{complianceId}/status")]
        [Authorize(Roles = "Super Admin,Administrator,Admin,HR")]
        public async Task<IActionResult> UpdateComplianceStatus(Guid complianceId, [FromBody] UpdateStatusDto dto)
        {
            try
            {
                var compliance = await _payrollService.UpdateComplianceStatusAsync(complianceId, dto.status);
                return Ok(new ApiResponse<PayrollComplianceDto>
                {
                    statusCode = 200,
                    message = "Compliance status updated successfully",
                    data = compliance
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating compliance status for {ComplianceId}", complianceId);
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to update compliance status",
                    data = null
                });
            }
        }

        /// <summary>
        /// Get payroll analytics
        /// </summary>
        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics()
        {
            try
            {
                var analytics = await _payrollService.GetAnalyticsAsync();
                return Ok(new ApiResponse<PayrollAnalyticsDto>
                {
                    statusCode = 200,
                    message = "Payroll analytics fetched successfully",
                    data = analytics
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching payroll analytics");
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to fetch payroll analytics",
                    data = null
                });
            }
        }

        /// <summary>
        /// Export payroll section as CSV
        /// </summary>
        [HttpGet("export")]
        public async Task<IActionResult> ExportPayroll([FromQuery] string section = "employees", [FromQuery] string payPeriod = "March 2026")
        {
            try
            {
                var file = await _payrollService.ExportPayrollDataAsync(section, payPeriod);
                return Ok(new ApiResponse<PayrollExportDto>
                {
                    statusCode = 200,
                    message = "Payroll export generated successfully",
                    data = file
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error exporting payroll data");
                return StatusCode(500, new ApiResponse<object>
                {
                    statusCode = 500,
                    message = "Failed to export payroll data",
                    data = null
                });
            }
        }
    }

    /// <summary>
    /// Helper DTO for status updates
    /// </summary>
    public class UpdateStatusDto
    {
        public string status { get; set; } = string.Empty;
    }
}
