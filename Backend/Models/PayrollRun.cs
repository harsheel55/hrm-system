using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

namespace Backend.Models
{
    /// <summary>
    /// PayrollRun represents a batch payroll processing run
    /// Tracks status, timing, and financial summaries
    /// </summary>
    public class PayrollRun
    {
        [Key]
        public Guid strPayrollRunGUID { get; set; } = Guid.NewGuid();

        /// <summary>
        /// Run identifier (e.g., "PR-2026-03")
        /// </summary>
        public string strRunID { get; set; } = string.Empty;

        /// <summary>
        /// Pay period (e.g., "March 2026")
        /// </summary>
        public string strPayPeriod { get; set; } = string.Empty;

        /// <summary>
        /// Run status: draft, processing, approved, paid, failed
        /// </summary>
        public string strStatus { get; set; } = "draft"; // draft, processing, approved, paid, failed

        /// <summary>
        /// Number of employees in this run
        /// </summary>
        public int intEmployeeCount { get; set; }

        /// <summary>
        /// Total gross payroll for this run
        /// </summary>
        public decimal decTotalGross { get; set; }

        /// <summary>
        /// Total deductions for this run
        /// </summary>
        public decimal decTotalDeductions { get; set; }

        /// <summary>
        /// Total net payroll (Gross - Deductions)
        /// </summary>
        public decimal decTotalNetPay { get; set; }

        /// <summary>
        /// User who initiated the payroll run
        /// </summary>
        [ForeignKey("InitiatedByUser")]
        public Guid? strInitiatedByUserGUID { get; set; }
        public User? InitiatedByUser { get; set; }

        public DateTime dtInitiatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? dtPaidAt { get; set; }

        /// <summary>
        /// JSON-serialized steps tracking (for workflow progress)
        /// Format: [{"label": "Import attendance", "done": true}, ...]
        /// </summary>
        public string strStepsJSON { get; set; } = "[]";

        public DateTime dtCreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? dtUpdatedAt { get; set; }
        public bool bitIsActive { get; set; } = true;
    }
}
