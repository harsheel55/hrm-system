using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services
{
    /// <summary>
    /// Authentication Service - Handles user login and password management
    /// 
    /// FEATURES:
    /// - Login: Authenticate user with email/password, return JWT token
    /// - Forgot Password: Generate OTP and store for password reset
    /// - Reset Password: Validate OTP and set new password
    /// - Change Password: Logged-in user changes their password
    /// 
    /// NOTE: User creation is handled by UserService (only Super Admin can create users)
    /// </summary>
    public class AuthService : IAuthService
    {
        // Database context for direct OTP operations
        private readonly AppDbContext _context;

        // Configuration access for JWT settings (issuer, audience, key, expiry)
        private readonly IConfiguration _configuration;

        // User service reference for user lookups and password operations
        private readonly IUserService _userService;

        /// <summary>
        /// Constructor: Receives dependencies for authentication operations
        /// </summary>
        public AuthService(AppDbContext context, IConfiguration configuration, IUserService userService)
        {
            _context = context;
            _configuration = configuration;
            _userService = userService;
        }

        #region LOGIN

        /// <summary>
        /// STEP 1: Authenticate a user by email and password
        /// 
        /// FLOW:
        /// 1. Find user by email
        /// 2. Verify password matches stored hash
        /// 3. Check if account is active
        /// 4. Generate JWT token
        /// 5. Update last login time
        /// 6. Return token and user info
        /// 
        /// Example: LoginAsync(new LoginDto { strEmail = "admin@example.com", strPassword = "ChangeMe123!" })
        /// </summary>
        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            try
            {
                // STEP 1a: Find user by email
                var user = await _userService.GetUserByEmailAsync(loginDto.strEmail);
                if (user == null)
                {
                    // Email not found - use generic message for security
                    return new LoginResponseDto
                    {
                        bSuccess = false,
                        strMessage = "Invalid email or password"
                    };
                }

                // STEP 1b: Verify password matches stored hash
                var passwordValid = await _userService.VerifyPasswordAsync(loginDto.strEmail, loginDto.strPassword);

                if (!passwordValid)
                {
                    // Password doesn't match
                    return new LoginResponseDto
                    {
                        bSuccess = false,
                        strMessage = "Invalid email or password"
                    };
                }

                // STEP 1c: Check if user account is active
                if (!user.bolIsActive)
                {
                    return new LoginResponseDto
                    {
                        bSuccess = false,
                        strMessage = "User account is not active"
                    };
                }

                // STEP 1d: Update last login time in database
                var dbUser = await _context.Users.FindAsync(user.strUserGUID);
                if (dbUser != null)
                {
                    dbUser.dtLastLogin = DateTime.UtcNow;
                    // Issue/rotate refresh token on successful login
                    dbUser.strRefreshToken = GenerateRefreshToken();
                    dbUser.dtRefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
                    await _context.SaveChangesAsync();
                }

                // STEP 1e: Generate JWT token
                var token = GenerateJwtToken(user.strUserGUID, user.strEmail, user.strRoleGUID);

                // STEP 1f: Return success response with token
                return new LoginResponseDto
                {
                    bSuccess = true,
                    strMessage = "Login successful",
                    strToken = token,
                    User = user
                };
            }
            catch (Exception ex)
            {
                return new LoginResponseDto
                {
                    bSuccess = false,
                    strMessage = $"Login failed: {ex.Message}"
                };
            }
        }

        #endregion

        #region FORGOT PASSWORD

        /// <summary>
        /// STEP 2: Forgot Password - Generate OTP for password reset
        /// 
        /// FLOW:
        /// 1. Find user by email
        /// 2. Generate 6-digit OTP
        /// 3. Store OTP and expiry in database
        /// 4. In production: Send OTP via email
        /// 5. Return success (with OTP in dev mode for testing)
        /// 
        /// Example: ForgotPasswordAsync(new ForgotPasswordDto { strEmail = "user@example.com" })
        /// </summary>
        public async Task<PasswordResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                // STEP 2a: Find user by email
                var user = await _context.Users.FirstOrDefaultAsync(
                    u => u.strEmail.ToLower() == forgotPasswordDto.strEmail.ToLower());

                if (user == null)
                {
                    // SECURITY: Don't reveal if email exists
                    // Always return success message to prevent email enumeration
                    return new PasswordResponseDto
                    {
                        bSuccess = true,
                        strMessage = "If the email exists, an OTP has been sent"
                    };
                }

                // STEP 2b: Check if account is active
                if (!user.bolIsActive)
                {
                    return new PasswordResponseDto
                    {
                        bSuccess = false,
                        strMessage = "User account is not active"
                    };
                }

                // STEP 2c: Generate 6-digit OTP
                var otp = GenerateOTP();
                var otpExpiry = DateTime.UtcNow.AddMinutes(15); // OTP valid for 15 minutes

                // STEP 2d: Store OTP and expiry in database
                user.strOTP = otp;
                user.dtOTPExpiry = otpExpiry;
                user.dtUpdatedOn = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // STEP 2e: TODO - Send OTP via email in production
                // For now, return OTP in response (DEVELOPMENT ONLY - remove in production!)
                // await _emailService.SendOtpEmailAsync(user.strEmail, otp);

                return new PasswordResponseDto
                {
                    bSuccess = true,
                    strMessage = "OTP has been sent to your email address",
                    // DEV ONLY: Remove these lines in production!
                    strOTP = otp,
                    dtOTPExpiry = otpExpiry
                };
            }
            catch (Exception ex)
            {
                return new PasswordResponseDto
                {
                    bSuccess = false,
                    strMessage = $"Failed to process forgot password request: {ex.Message}"
                };
            }
        }

        #endregion

        #region RESET PASSWORD

        /// <summary>
        /// STEP 3: Reset Password using OTP
        /// 
        /// FLOW:
        /// 1. Find user by email
        /// 2. Validate OTP matches stored OTP
        /// 3. Check OTP hasn't expired
        /// 4. Hash and store new password
        /// 5. Clear OTP from database
        /// 6. Return success
        /// 
        /// Example: ResetPasswordAsync(new ResetPasswordDto { strEmail = "user@example.com", strOTP = "123456", strNewPassword = "NewPass!" })
        /// </summary>
        public async Task<PasswordResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            try
            {
                // STEP 3a: Find user by email
                var user = await _context.Users.FirstOrDefaultAsync(
                    u => u.strEmail.ToLower() == resetPasswordDto.strEmail.ToLower());

                if (user == null)
                {
                    return new PasswordResponseDto
                    {
                        bSuccess = false,
                        strMessage = "Invalid email or OTP"
                    };
                }

                // STEP 3b: Validate OTP matches
                if (string.IsNullOrEmpty(user.strOTP) || user.strOTP != resetPasswordDto.strOTP)
                {
                    return new PasswordResponseDto
                    {
                        bSuccess = false,
                        strMessage = "Invalid OTP"
                    };
                }

                // STEP 3c: Check OTP hasn't expired
                if (user.dtOTPExpiry == null || user.dtOTPExpiry < DateTime.UtcNow)
                {
                    // Clear expired OTP
                    user.strOTP = string.Empty;
                    user.dtOTPExpiry = null;
                    await _context.SaveChangesAsync();

                    return new PasswordResponseDto
                    {
                        bSuccess = false,
                        strMessage = "OTP has expired. Please request a new one"
                    };
                }

                // STEP 3d: Hash and store new password
                user.strPassword = HashPassword(resetPasswordDto.strNewPassword);

                // STEP 3e: Clear OTP (one-time use)
                user.strOTP = string.Empty;
                user.dtOTPExpiry = null;
                user.dtUpdatedOn = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return new PasswordResponseDto
                {
                    bSuccess = true,
                    strMessage = "Password has been reset successfully. You can now login with your new password"
                };
            }
            catch (Exception ex)
            {
                return new PasswordResponseDto
                {
                    bSuccess = false,
                    strMessage = $"Failed to reset password: {ex.Message}"
                };
            }
        }

        #endregion

        #region CHANGE PASSWORD

        /// <summary>
        /// STEP 4: Change Password for logged-in user
        /// 
        /// FLOW:
        /// 1. Find user by userId (from JWT token)
        /// 2. Verify current password
        /// 3. Hash and store new password
        /// 4. Return success
        /// 
        /// Example: ChangePasswordAsync(userId, new ChangePasswordDto { strCurrentPassword = "Old!", strNewPassword = "New!" })
        /// </summary>
        public async Task<PasswordResponseDto> ChangePasswordAsync(Guid userId, ChangePasswordDto changePasswordDto)
        {
            try
            {
                // STEP 4a: Find user by userId
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                {
                    return new PasswordResponseDto
                    {
                        bSuccess = false,
                        strMessage = "User not found"
                    };
                }

                // STEP 4b: Verify current password
                var currentPasswordHash = HashPassword(changePasswordDto.strCurrentPassword);
                if (user.strPassword != currentPasswordHash)
                {
                    return new PasswordResponseDto
                    {
                        bSuccess = false,
                        strMessage = "Current password is incorrect"
                    };
                }

                // STEP 4c: Check new password is different from current
                var newPasswordHash = HashPassword(changePasswordDto.strNewPassword);
                if (user.strPassword == newPasswordHash)
                {
                    return new PasswordResponseDto
                    {
                        bSuccess = false,
                        strMessage = "New password must be different from current password"
                    };
                }

                // STEP 4d: Update password
                user.strPassword = newPasswordHash;
                user.dtUpdatedOn = DateTime.UtcNow;
                user.strUpdatedByGUID = userId;

                await _context.SaveChangesAsync();

                return new PasswordResponseDto
                {
                    bSuccess = true,
                    strMessage = "Password changed successfully"
                };
            }
            catch (Exception ex)
            {
                return new PasswordResponseDto
                {
                    bSuccess = false,
                    strMessage = $"Failed to change password: {ex.Message}"
                };
            }
        }

        #endregion

        #region JWT TOKEN GENERATION

        /// <summary>
        /// STEP 5: Generate JWT Token for authenticated session
        /// 
        /// Token contains:
        /// - userId: The unique ID of authenticated user
        /// - email: The email address of user
        /// - roleId: The role GUID for permission checking
        /// 
        /// Token is signed using HMAC-SHA256 algorithm
        /// Expiry is configurable in appsettings.json (default: 30 minutes)
        /// </summary>
        public string GenerateJwtToken(Guid userId, string email, Guid? roleId)
        {
            // Get JWT settings from configuration
            var jwtSettings = _configuration.GetSection("Jwt");

            // DEBUG: Print key info (REMOVE IN PRODUCTION)
            var keyValue = jwtSettings["Key"] ?? "";
            Console.WriteLine($"=== TOKEN GENERATION DEBUG ===");
            Console.WriteLine($"Key Length: {keyValue.Length} chars");
            Console.WriteLine($"Key First 10: {(keyValue.Length > 10 ? keyValue.Substring(0, 10) : keyValue)}...");
            Console.WriteLine($"==============================");

            // Create signing key from secret
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create claims (data inside token)
            // Use standard JWT claims: 'sub' for subject (userId), 'email', and custom 'roleId'
            var claims = new List<System.Security.Claims.Claim>
            {
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.NameIdentifier, userId.ToString()),
                new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Email, email),
                new System.Security.Claims.Claim("email", email),
                new System.Security.Claims.Claim("roleId", roleId?.ToString() ?? "")
            };

            // Create the token
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    double.Parse(jwtSettings["AccessTokenExpiryMinutes"] ?? "30")),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);
            Console.WriteLine($"[GenerateJwtToken] Token length: {tokenString.Length}");
            Console.WriteLine($"[GenerateJwtToken] Token starts: {tokenString.Substring(0, Math.Min(50, tokenString.Length))}");
            Console.WriteLine($"[GenerateJwtToken] Token ends with (last 10): ...{tokenString.Substring(Math.Max(0, tokenString.Length - 10))}");
            // Check for spaces
            if (tokenString.Contains(" "))
            {
                Console.WriteLine($"[GenerateJwtToken] ⚠️  TOKEN CONTAINS SPACES!");
            }
            return tokenString;
        }

        /// <summary>
        /// Validate and rotate refresh token, returning a new access token.
        /// </summary>
        public async Task<(bool ok, string message, string? accessToken, User? user)> RefreshTokenAsync(string refreshToken)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.strRefreshToken == refreshToken);
                if (user == null)
                {
                    return (false, "Invalid refresh token", null, null);
                }

                if (user.dtRefreshTokenExpiry == null || user.dtRefreshTokenExpiry < DateTime.UtcNow)
                {
                    return (false, "Refresh token expired", null, null);
                }

                // Rotate refresh token
                user.strRefreshToken = GenerateRefreshToken();
                user.dtRefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
                await _context.SaveChangesAsync();

                var accessToken = GenerateJwtToken(user.strUserGUID, user.strEmail, user.strRoleGUID);
                return (true, "Token refreshed", accessToken, user);
            }
            catch (Exception ex)
            {
                return (false, $"Failed to refresh token: {ex.Message}", null, null);
            }
        }

        #endregion

        #region HELPER METHODS

        /// <summary>
        /// Generate 6-digit numeric OTP
        /// Uses cryptographically secure random number generator
        /// </summary>
        private static string GenerateOTP()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            var number = BitConverter.ToUInt32(bytes, 0) % 1000000;
            return number.ToString("D6"); // Pad with leading zeros if needed
        }

        /// <summary>
        /// Generate secure refresh token string.
        /// </summary>
        private static string GenerateRefreshToken()
        {
            using var rng = RandomNumberGenerator.Create();
            var bytes = new byte[32];
            rng.GetBytes(bytes);
            // Base64Url without padding
            return Convert.ToBase64String(bytes)
                .Replace('+', '-')
                .Replace('/', '_')
                .TrimEnd('=');
        }

        /// <summary>
        /// Hash password using SHA-256 algorithm
        /// Converts password string to fixed-length hash
        /// </summary>
        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            var builder = new StringBuilder();
            foreach (var b in bytes)
            {
                builder.Append(b.ToString("x2"));
            }
            return builder.ToString();
        }

        #endregion
    }
}
