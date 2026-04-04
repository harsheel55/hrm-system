using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// PayrollCompliance represents tax and regulatory compliance obligations
    /// Tracks filing deadlines, amounts, and status
    /// </summary>
    public class PayrollCompliance
    {
        [Key]
        public Guid strComplianceGUID { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Title of the compliance obligation (e.g., "Federal Income Tax (FICA) Deposit")
        /// </summary>
        public string strTitle { get; set; } = string.Empty;

        /// <summary>
        /// Regulatory authority (e.g., "IRS", "CA EDD")
        /// </summary>
        public string strAuthority { get; set; } = string.Empty;

        /// <summary>
        /// Compliance category: Tax, Benefits, Reporting, Insurance
        /// </summary>
        public string strCategory { get; set; } = "Tax";

        /// <summary>
        /// Due date for filing/payment
        /// </summary>
        public DateTime dtDueDate { get; set; }

        /// <summary>
        /// Status: filed, pending, overdue, upcoming
        /// </summary>
        public string strStatus { get; set; } = "upcoming"; // filed, pending, overdue, upcoming

        /// <summary>
        /// Amount to be filed/paid (optional)
        /// </summary>
        public decimal? decAmount { get; set; }

        /// <summary>
        /// Compliance period (e.g., "Mar 2026", "Q1 2026", "FY 2025")
        /// </summary>
        public string strPeriod { get; set; } = string.Empty;

        /// <summary>
        /// Description or notes about the obligation
        /// </summary>
        public string strDescription { get; set; } = string.Empty;

        /// <summary>
        /// Filing reference or confirmation number
        /// </summary>
        public string strFilingReference { get; set; } = string.Empty;

        public DateTime dtCreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? dtUpdatedAt { get; set; }
        public DateTime? dtFiledAt { get; set; }
        public bool bitIsActive { get; set; } = true;
    }
}
