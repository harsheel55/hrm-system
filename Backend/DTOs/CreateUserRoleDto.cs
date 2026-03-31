using System;

namespace Backend.DTOs
{
    public class CreateUserRoleDto
    {
        public string strRoleName { get; set; } = string.Empty;
        public string? strDescription { get; set; }
        public bool bolIsActive { get; set; } = true;
    }
}
