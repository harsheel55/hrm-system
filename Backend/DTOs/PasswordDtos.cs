using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs
{
    /// <summary>
    /// DTO for Forgot Password request
    /// User provides email to receive OTP for password reset
    /// Example: { "strEmail": "user@example.com" }
    /// </summary>
    public class ForgotPasswordDto
    {
        /// <summary>
        /// Email address of the user who forgot their password
        /// OTP will be sent to this email address
        /// </summary>
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string strEmail { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for Reset Password request (using OTP from Forgot Password)
    /// User provides email, OTP, and new password
    /// Example: { "strEmail": "user@example.com", "strOTP": "123456", "strNewPassword": "NewPass123!" }
    /// </summary>
    public class ResetPasswordDto
    {
        /// <summary>
        /// Email address of the user resetting password
        /// Must match the email used in forgot password request
        /// </summary>
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string strEmail { get; set; } = string.Empty;

        /// <summary>
        /// One-Time Password (OTP) received via email
        /// 6-digit code sent during forgot password request
        /// </summary>
        [Required(ErrorMessage = "OTP is required")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be 6 digits")]
        public string strOTP { get; set; } = string.Empty;

        /// <summary>
        /// New password to set for the account
        /// Should meet password strength requirements
        /// </summary>
        [Required(ErrorMessage = "New password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string strNewPassword { get; set; } = string.Empty;

        /// <summary>
        /// Confirm new password - must match strNewPassword
        /// Used for validation to prevent typos
        /// </summary>
        [Required(ErrorMessage = "Confirm password is required")]
        [Compare("strNewPassword", ErrorMessage = "Passwords do not match")]
        public string strConfirmPassword { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for Change Password request (for logged-in users)
    /// User provides current password and new password
    /// Example: { "strCurrentPassword": "OldPass123!", "strNewPassword": "NewPass123!" }
    /// </summary>
    public class ChangePasswordDto
    {
        /// <summary>
        /// Current/old password for verification
        /// User must know current password to change it
        /// </summary>
        [Required(ErrorMessage = "Current password is required")]
        public string strCurrentPassword { get; set; } = string.Empty;

        /// <summary>
        /// New password to set for the account
        /// Should meet password strength requirements
        /// </summary>
        [Required(ErrorMessage = "New password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string strNewPassword { get; set; } = string.Empty;

        /// <summary>
        /// Confirm new password - must match strNewPassword
        /// Used for validation to prevent typos
        /// </summary>
        [Required(ErrorMessage = "Confirm password is required")]
        [Compare("strNewPassword", ErrorMessage = "Passwords do not match")]
        public string strConfirmPassword { get; set; } = string.Empty;
    }

    /// <summary>
    /// Generic response DTO for password operations
    /// Used for forgot password, reset password, and change password responses
    /// </summary>
    public class PasswordResponseDto
    {
        /// <summary>
        /// Indicates whether the operation was successful
        /// true = success, false = failure
        /// </summary>
        public bool bSuccess { get; set; }

        /// <summary>
        /// Human-readable message describing the result
        /// Examples: "OTP sent to email", "Password changed successfully", "Invalid OTP"
        /// </summary>
        public string strMessage { get; set; } = string.Empty;

        /// <summary>
        /// OTP value (only included in development/testing mode)
        /// In production, this should NEVER be returned - OTP goes via email only
        /// </summary>
        public string? strOTP { get; set; }

        /// <summary>
        /// OTP expiry time (only included for reference)
        /// Shows when the OTP will expire
        /// </summary>
        public DateTime? dtOTPExpiry { get; set; }
    }
}
