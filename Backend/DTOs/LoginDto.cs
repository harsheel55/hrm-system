/*
 * LoginDto.cs - Data Transfer Object for User Login
 * 
 * Used for authenticating users via the login endpoint.
 * Contains email and password credentials.
 */

using System;

namespace Backend.DTOs
{
    /// <summary>
    /// DTO for user login/authentication
    /// Contains credentials for user authentication
    /// </summary>
    public class LoginDto
    {
        /// <summary>
        /// User's email address
        /// Used as username for login
        /// </summary>
        public string strEmail { get; set; } = string.Empty;
        
        /// <summary>
        /// User's password (plain text, will be compared with hashed version)
        /// </summary>
        public string strPassword { get; set; } = string.Empty;
    }
}
