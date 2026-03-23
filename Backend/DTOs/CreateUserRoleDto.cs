using System;

namespace Backend.DTOs
{
    public class CreateUserRoleDto
    {
        public string strRoleName { get; set; } = string.Empty;
        public string strDesc { get; set; } = string.Empty;
    }
}
