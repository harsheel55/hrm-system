using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Stores per-role permissions for individual menus (user rights).
    /// Mirrors Pristine's mstUserRights structure but uses Backend naming.
    /// </summary>
    public class UserRight
    {
        // Primary key
        [Key]
        public Guid strUserRightGUID { get; set; } = Guid.NewGuid();

        // Foreign keys
        public Guid strUserRoleGUID { get; set; }
        public Guid strMenuGUID { get; set; }

        // Permission flags
        public bool bolCanView { get; set; }
        public bool bolCanEdit { get; set; }
        public bool bolCanSave { get; set; }
        public bool bolCanDelete { get; set; }
        public bool bolCanPrint { get; set; }
        public bool bolCanExport { get; set; }
        public bool bolCanImport { get; set; }
        public bool bolCanApprove { get; set; }

        // Audit fields
        public DateTime dtCreatedOn { get; set; } = DateTime.UtcNow;
        public Guid? strCreatedByGUID { get; set; }
        public DateTime? dtUpdatedOn { get; set; }
        public Guid? strUpdatedByGUID { get; set; }
    }
}

