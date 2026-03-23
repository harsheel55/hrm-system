using System;

namespace Backend.DTOs
{
    /// <summary>
    /// DTO for creating or updating a single user right entry.
    /// </summary>
    public class CreateUserRightDto
    {
        public Guid strUserRoleGUID { get; set; }
        public Guid strMenuGUID { get; set; }

        public bool bolCanView { get; set; }
        public bool bolCanEdit { get; set; }
        public bool bolCanSave { get; set; }
        public bool bolCanDelete { get; set; }
        public bool bolCanPrint { get; set; }
        public bool bolCanExport { get; set; }
        public bool bolCanImport { get; set; }
        public bool bolCanApprove { get; set; }
    }

    /// <summary>
    /// DTO returned from user rights endpoints.
    // /// </summary>
    public class UserRightResponseDto
    {
        public Guid strUserRightGUID { get; set; }
        public Guid strUserRoleGUID { get; set; }
        public Guid strMenuGUID { get; set; }

        public bool bolCanView { get; set; }
        public bool bolCanEdit { get; set; }
        public bool bolCanSave { get; set; }
        public bool bolCanDelete { get; set; }
        public bool bolCanPrint { get; set; }
        public bool bolCanExport { get; set; }
        public bool bolCanImport { get; set; }
        public bool bolCanApprove { get; set; }

        public Guid? strCreatedByGUID { get; set; }
        public DateTime dtCreatedOn { get; set; }
        public Guid? strUpdatedByGUID { get; set; }
        public DateTime? dtUpdatedOn { get; set; }
    }
}

