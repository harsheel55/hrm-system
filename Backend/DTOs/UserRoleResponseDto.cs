using System;

namespace Backend.DTOs
{
    public class UserRoleResponseDto
    {
        public Guid strUserRoleGUID { get; set; }
        public string strRoleName { get; set; } = string.Empty;
        public string strDesc { get; set; } = string.Empty;
        public bool bolIsActive { get; set; }
        public bool bolSystemCreated { get; set; }
        public DateTime dtCreatedOn { get; set; }
        public DateTime dtUpdatedOn { get; set; }
    }
}
