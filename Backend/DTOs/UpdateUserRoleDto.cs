using System;

namespace Backend.DTOs
{
    public class UpdateUserRoleDto
    {
        public string? strRoleName { get; set; }
        public string? strDesc { get; set; }
        public bool? bolIsActive { get; set; }
    }
}
