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
        public string strPreferredLanguage { get; set; } = string.Empty;
        public string strProfileImg { get; set; } = string.Empty;
        public DateTime? dtLastLogin { get; set; }
        public DateTime dtCreatedOn { get; set; }
        public DateTime dtUpdatedOn { get; set; }
    }
}
