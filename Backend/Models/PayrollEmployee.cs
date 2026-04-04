using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    /// <summary>
    /// PayrollEmployee represents an employee's payroll details for a specific period
    /// </summary>
    public class PayrollEmployee
    {
        [Key]
        public Guid strPayrollEmployeeGUID { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Foreign key to User
        /// </summary>
        [ForeignKey("User")]
        public Guid strUserGUID { get; set; }
        public User? User { get; set; }

        /// <summary>
        /// Pay period (e.g., "March 2026")
        /// </summary>
        public string strPayPeriod { get; set; } = string.Empty;

        /// <summary>
        /// Employee type: full-time, part-time, contract
        /// </summary>
        public string strEmploymentType { get; set; } = "full-time"; // full-time, part-time, contract

        /// <summary>
        /// Earnings Components
        /// </summary>
        public decimal decBaseSalary { get; set; }
        public decimal decHRA { get; set; }
        public decimal decTransportAllowance { get; set; }
        public decimal decMedicalAllowance { get; set; }
        public decimal decPerformanceBonus { get; set; }

        /// <summary>
        /// Gross Earnings = Sum of all earning components
        /// </summary>
        public decimal decGrossEarnings { get; set; }

        /// <summary>
        /// Deduction Components
        /// </summary>
        public decimal decProvidentFund { get; set; }
        public decimal decIncomeTax { get; set; }
        public decimal decHealthInsurance { get; set; }

        /// <summary>
        /// Total Deductions = Sum of all deduction components
        /// </summary>
        public decimal decTotalDeductions { get; set; }

        /// <summary>
        /// Net Pay = Gross - Total Deductions
        /// </summary>
        public decimal decNetPay { get; set; }

        /// <summary>
        /// Bank account last 4 digits (masked for security)
        /// </summary>
        public string strBankLast4 { get; set; } = string.Empty;

        /// <summary>
        /// Bank name
        /// </summary>
        public string strBankName { get; set; } = string.Empty;

        /// <summary>
        /// Tax bracket (e.g., "22%")
        /// </summary>
        public string strTaxBracket { get; set; } = string.Empty;

        /// <summary>
        /// Year-to-date gross earnings
        /// </summary>
        public decimal decYTDGross { get; set; }

        /// <summary>
        /// Year-to-date tax paid
        /// </summary>
        public decimal decYTDTax { get; set; }

        public DateTime dtCreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? dtUpdatedAt { get; set; }
        public bool bitIsActive { get; set; } = true;
    }
}
