using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Attendance
    {
        [Key]
        public Guid strAttendanceGUID { get; set; }

        [Required]
        public Guid strUserGUID { get; set; }

        [Required]
        public DateOnly dtDate { get; set; }

        public DateTime? dtCheckIn { get; set; }

        public DateTime? dtCheckOut { get; set; }

        [MaxLength(20)]
        public string strStatus { get; set; } = "Absent";

        [MaxLength(256)]
        public string? strRemarks { get; set; }

        public DateTime dtCreatedOn { get; set; } = DateTime.UtcNow;

        public DateTime dtUpdatedOn { get; set; } = DateTime.UtcNow;

        [ForeignKey("strUserGUID")]
        public virtual User? User { get; set; }
    }
}
