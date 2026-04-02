using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("LeaveRecords")]
public sealed class LeaveRecord
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(256)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(64)]
    public string LeaveType { get; set; } = string.Empty;

    [Required]
    public DateTime StartDate { get; set; }

    [Required]
    public DateTime EndDate { get; set; }

    [Required]
    public int Days { get; set; }

    [Required]
    [MaxLength(32)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Reason { get; set; } = string.Empty;

    [MaxLength(128)]
    public string EmergencyContact { get; set; } = string.Empty;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }
}
