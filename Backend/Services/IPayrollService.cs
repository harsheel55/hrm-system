using Backend.DTOs;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services
{
    public interface IPayrollService
    {
        Task<List<PayrollEmployeeDto>> GetPayrollEmployeesAsync(string payPeriod);
        Task<List<PayrollRunDto>> GetPayrollRunsAsync();
        Task<PayrollRunDto?> GetPayrollRunAsync(Guid runId);
        Task<PayrollRunDto> CreatePayrollRunAsync(CreatePayrollRunDto dto);
        Task<PayrollRunDto> UpdatePayrollRunStatusAsync(Guid runId, UpdatePayrollRunStatusDto dto);
        Task<List<PayrollComplianceDto>> GetComplianceItemsAsync();
        Task<PayrollComplianceDto> CreateComplianceItemAsync(CreatePayrollComplianceDto dto);
        Task<PayrollComplianceDto> UpdateComplianceStatusAsync(Guid complianceId, string status);
        Task<PayrollAnalyticsDto> GetAnalyticsAsync();
        Task SeedPayrollDataIfEmptyAsync();
    }
}
