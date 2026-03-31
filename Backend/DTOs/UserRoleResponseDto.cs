using System;

namespace Backend.DTOs
{
    public class UserRoleResponseDto
    {
        public Guid strUserRoleGUID { get; set; }
        public string strRoleName { get; set; } = string.Empty;
        public string? strDescription { get; set; }
        public bool bolIsActive { get; set; }
        public bool bolSystemCreated { get; set; }
        public string dtCreatedDate { get; set; } = string.Empty;
        public string dtModifiedDate { get; set; } = string.Empty;
    }
}
