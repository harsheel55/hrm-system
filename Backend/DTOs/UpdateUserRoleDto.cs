using System;

namespace Backend.DTOs
{
    public class UpdateUserRoleDto
    {
        public string? strRoleName { get; set; }
        public string? strDescription { get; set; }
        public bool bolIsActive { get; set; }
    }
}
