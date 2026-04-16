/*
 * CreateUserDto.cs - Data Transfer Object for User Creation
 * 
 * Used when creating new user accounts via the API.
 * Contains validation rules for required fields and data formats.
 * Supports profile image upload during user creation.
 */

using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Backend.DTOs
{
    /// <summary>
    /// DTO for creating a new user account
    /// Used by administrators to add new users to the system
    /// </summary>
    public class CreateUserDto
    {
        /// <summary>
        /// User's display name
        /// Required field
        /// </summary>
        [Required(ErrorMessage = "User name is required")]
        public string strUserName { get; set; } = string.Empty;
        
        /// <summary>
        /// User's email address (used for login)
        /// Must be valid email format and unique in system
        /// Required field
        /// </summary>
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string strEmail { get; set; } = string.Empty;
        
        /// <summary>
        /// User's password (will be hashed before storage)
        /// Minimum 6 characters required
        /// Required field
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string strPassword { get; set; } = string.Empty;
        
        /// <summary>
        /// User's phone number (optional)
        /// </summary>
        public string strPhoneNo { get; set; } = string.Empty;
        
        /// <summary>
        /// User's date of birth (optional)
        /// </summary>
        public DateTime? dDob { get; set; }
        
        /// <summary>
        /// GUID of the role to assign to the user
        /// Determines user's permissions (optional - can be assigned later)
        /// </summary>
        public Guid? strRoleGUID { get; set; }
        
        /// <summary>
        /// User's preferred language for UI localization
        /// Default: "en" (English)
        /// </summary>
        public string strPreferredLanguage { get; set; } = "en";

        /// <summary>
        /// Employee bank name for payroll transfers (optional)
        /// </summary>
        public string strBankName { get; set; } = string.Empty;

        /// <summary>
        /// Employee bank account number (optional)
        /// </summary>
        public string strBankAccountNo { get; set; } = string.Empty;

        /// <summary>
        /// Employee tax bracket label (optional)
        /// </summary>
        public string strTaxBracket { get; set; } = string.Empty;
        
        /// <summary>
        /// Profile image file upload (optional)
        /// Accepted formats: JPG, PNG, GIF, WebP (max 5MB)
        /// </summary>
        public IFormFile? strProfileImage { get; set; }  // Optional profile image file when creating user
    }
}
