using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    /// <summary>
    /// DTO used by /api/auth/create-admin to bootstrap the first Admin user.
    /// </summary>
    public class CreateAdminDto
    {
        [Required]
        [MaxLength(256)]
        public string strUserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(256)]
        public string strEmail { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string strPassword { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? strPhoneNo { get; set; }
    }
}

