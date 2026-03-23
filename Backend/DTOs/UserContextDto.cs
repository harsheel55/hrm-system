using System;

namespace Backend.DTOs
{
    /// <summary>
    /// DTO representing the basic context of the currently logged-in user.
    /// Used by /api/auth/me endpoint.
    /// </summary>
    public class UserContextDto
    {
        public string strUserGUID { get; set; } = string.Empty;
        public string strName { get; set; } = string.Empty;
        public string strEmail { get; set; } = string.Empty;
        public string strPhoneNO { get; set; } = string.Empty;
        public string? strUserRoleGUID { get; set; }
        public string strUserRoleName { get; set; } = string.Empty;
    }
}

