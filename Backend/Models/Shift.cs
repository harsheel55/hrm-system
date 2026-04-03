using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Shift
    {
        [Key]
        public Guid strShiftGUID { get; set; } = Guid.NewGuid();
        
        [Required]
        [MaxLength(100)]
        public string strName { get; set; } = string.Empty;
        
        [Required]
        public TimeSpan tStartTime { get; set; }
        
        [Required]
        public TimeSpan tEndTime { get; set; }
        
        [MaxLength(20)]
        public string strColor { get; set; } = "#3b82f6"; // Default blue (Hex)
        
        public bool bolIsActive { get; set; } = true;
        
        public DateTime dtCreatedOn { get; set; } = DateTime.UtcNow;
        
        public DateTime dtUpdatedOn { get; set; } = DateTime.UtcNow;
    }
}
