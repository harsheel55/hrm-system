/*
 * User.cs - User Entity Model
 * 
 * Represents a user account in the system.
 * Contains authentication credentials, profile information, and audit fields.
 * Users are created by administrators only (no public registration).
 */

using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    /// <summary>
    /// User entity representing a user account in the system
    /// </summary>
    public class User
    {
        /// <summary>
        /// Unique identifier for the user (Primary Key)
        /// </summary>
        [Key]
        public Guid strUserGUID { get; set; }
        
        /// <summary>
        /// User's display name
        /// </summary>
        public string strUserName { get; set; } = string.Empty;
        
        /// <summary>
        /// User's email address (used for login and communication)
        /// Must be unique across the system
        /// </summary>
        public string strEmail { get; set; } = string.Empty;
        
        /// <summary>
        /// Hashed password (never store plain text passwords)
        /// Uses BCrypt hashing for security
        /// </summary>
        public string strPassword { get; set; } = string.Empty;
        
        /// <summary>
        /// User's phone number for contact purposes
        /// </summary>
        public string strPhoneNo { get; set; } = string.Empty;
        
        /// <summary>
        /// User's date of birth (optional)
        /// </summary>
        public DateTime? dDob { get; set; }
        
        /// <summary>
        /// Indicates if the user account is active
        /// Inactive users cannot log in
        /// Default: true
        /// </summary>
        public bool bolIsActive { get; set; } = true;
        
        /// <summary>
        /// Indicates if this user was created by the system (bootstrap/seed data)
        /// System-created users may have special protections
        /// Default: false
        /// </summary>
        public bool bolSystemCreated { get; set; } = false;
        
        /// <summary>
        /// Foreign key to UserRole table
        /// Determines the user's permissions and access level
        /// </summary>
        public Guid? strRoleGUID { get; set; }
        
        /// <summary>
        /// One-Time Password for password reset
        /// Temporary code sent via email for password recovery
        /// </summary>
        public string strOTP { get; set; } = string.Empty;
        
        /// <summary>
        /// Expiration time for the OTP
        /// OTP is only valid until this datetime
        /// </summary>
        public DateTime? dtOTPExpiry { get; set; }
        
        /// <summary>
        /// Refresh token for JWT token renewal
        /// Used to obtain new access tokens without re-login
        /// </summary>
        public string strRefreshToken { get; set; } = string.Empty;
        
        /// <summary>
        /// Expiration time for the refresh token
        /// Refresh token is only valid until this datetime
        /// </summary>
        public DateTime? dtRefreshTokenExpiry { get; set; }
        
        /// <summary>
        /// User's preferred language for UI localization
        /// Default: "en" (English)
        /// </summary>
        public string strPreferredLanguage { get; set; } = "en";

        /// <summary>
        /// Employee bank name for payroll transfers
        /// </summary>
        public string strBankName { get; set; } = string.Empty;

        /// <summary>
        /// Employee bank account number (full value stored)
        /// </summary>
        public string strBankAccountNo { get; set; } = string.Empty;

        /// <summary>
        /// Employee tax bracket used in payroll reporting
        /// </summary>
        public string strTaxBracket { get; set; } = string.Empty;
        
        /// <summary>
        /// Relative path to user's profile image
        /// Example: /uploads/profiles/guid_image.jpg
        /// </summary>
        public string strProfileImg { get; set; } = string.Empty;
        
        /// <summary>
        /// Timestamp of user's last successful login
        /// Used for security monitoring and analytics
        /// </summary>
        public DateTime? dtLastLogin { get; set; }
        
        /// <summary>
        /// GUID of the user who created this record
        /// For audit trail purposes
        /// </summary>
        public Guid? strCreatedByGUID { get; set; }
        
        /// <summary>
        /// Timestamp when this record was created
        /// Default: Current UTC time
        /// </summary>
        public DateTime dtCreatedOn { get; set; } = DateTime.UtcNow;
        
        /// <summary>
        /// GUID of the user who last updated this record
        /// For audit trail purposes
        /// </summary>
        public Guid? strUpdatedByGUID { get; set; }
        
        /// <summary>
        /// Timestamp when this record was last updated
        /// Default: Current UTC time
        /// </summary>
        public DateTime dtUpdatedOn { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Navigation property to UserRole - Lazy loading support
        /// Allows access to the user's assigned role details
        /// </summary>
        [ForeignKey("strRoleGUID")]
        public virtual UserRole? UserRole { get; set; }
    }
}
