using System;

namespace Backend.DTOs
{
    public class UserResponseDto
    {
        public Guid strUserGUID { get; set; }
        public string strUserName { get; set; } = string.Empty;
        public string strEmail { get; set; } = string.Empty;
        public string strPhoneNo { get; set; } = string.Empty;
        public DateTime? dDob { get; set; }
        public bool bolIsActive { get; set; }
        public bool bolSystemCreated { get; set; }
        public Guid? strRoleGUID { get; set; }
        public string? strRoleName { get; set; }  // Added: Role name for frontend display
        public string strPreferredLanguage { get; set; } = string.Empty;
        public string strProfileImageUrl { get; set; } = string.Empty;  // Changed from strProfileImg
        public DateTime? dtLastLogin { get; set; }
        public DateTime dtCreatedDate { get; set; }  // Changed from dtCreatedOn
        public DateTime dtModifiedDate { get; set; }  // Changed from dtUpdatedOn
    }
}
