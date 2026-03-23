using System;

namespace Backend.DTOs
{
    public class LoginResponseDto
    {
        public bool bSuccess { get; set; }
        public string strMessage { get; set; } = string.Empty;
        public string strToken { get; set; } = string.Empty;
        public UserResponseDto? User { get; set; }
    }
}
