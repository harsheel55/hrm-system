using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.DTOs;
using Backend.Models;

namespace Backend.Services
{
    /// <summary>
    /// Interface for Authentication Service
    /// Handles login, password management (forgot/reset/change), and JWT token generation
    /// NOTE: User creation is handled by IUserService (only Super Admin can create users)
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Authenticate user with email and password
        /// Returns JWT token on successful login
        /// </summary>
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);

        /// <summary>
        /// Initiate forgot password flow
        /// Generates OTP and sends to user's email
        /// </summary>
        Task<PasswordResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);

        /// <summary>
        /// Reset password using OTP received via email
        /// Validates OTP and sets new password
        /// </summary>
        Task<PasswordResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);

        /// <summary>
        /// Change password for logged-in user
        /// Requires current password verification
        /// </summary>
        Task<PasswordResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordDto changePasswordDto);

        /// <summary>
        /// Generate JWT token for authenticated session
        /// Token contains userId, email, and roleId claims
        /// </summary>
        string GenerateJwtToken(Guid userId, string email, Guid? roleId);

        /// <summary>
        /// Validate and rotate refresh token, returning a new access token.
        /// </summary>
        Task<(bool ok, string message, string? accessToken, User? user)> RefreshTokenAsync(string refreshToken);
    }
}
