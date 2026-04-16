using System;
using Microsoft.AspNetCore.Http;

namespace Backend.DTOs
{
    public class UpdateUserDto
    {
        public string? strUserName { get; set; }
        public string? strEmail { get; set; }
        public string? strPhoneNo { get; set; }
        public DateTime? dDob { get; set; }
        public bool? bolIsActive { get; set; }
        public Guid? strRoleGUID { get; set; }
        public string? strPreferredLanguage { get; set; }
        public string? strBankName { get; set; }
        public string? strBankAccountNo { get; set; }
        public string? strTaxBracket { get; set; }
        public IFormFile? strProfileImage { get; set; }  // Optional profile image file for update
    }
}
