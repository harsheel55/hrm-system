using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class EmployeeShift
    {
        [Key]
        public Guid strEmployeeShiftGUID { get; set; } = Guid.NewGuid();
        
        [Required]
        public Guid strUserGUID { get; set; }
        
        [Required]
        public Guid strShiftGUID { get; set; }
        
        [Required]
        public DateOnly dtDate { get; set; }
        
        [MaxLength(256)]
        public string strNotes { get; set; } = string.Empty;
        
        public DateTime dtCreatedOn { get; set; } = DateTime.UtcNow;
        
        public DateTime dtUpdatedOn { get; set; } = DateTime.UtcNow;

        [ForeignKey("strUserGUID")]
        public virtual User? User { get; set; }
        
        [ForeignKey("strShiftGUID")]
        public virtual Shift? Shift { get; set; }
    }
}
