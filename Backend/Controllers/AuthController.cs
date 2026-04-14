using System.IdentityModel.Tokens.Jwt;
using System.Collections.Concurrent;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(
    AppDbContext dbContext,
    IConfiguration configuration,
    IEmailService emailService) : ControllerBase
{
    private static readonly ConcurrentDictionary<string, (string Otp, DateTime ExpiryUtc)> LoginOtpStore = new();

    // POST api/auth/user/login
    // Authenticates a user created via User Management (Users table) and returns their role
    [HttpPost("user/login")]
    public async Task<IActionResult> UserLogin([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var user = await dbContext.Users
            .Include(u => u.UserRole)
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.strEmail == normalizedEmail, cancellationToken);

        if (user is null || !user.bolIsActive)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        // Verify SHA-256 hashed password (same algorithm used in UserService)
        bool passwordValid = VerifySha256Password(request.Password, user.strPassword);
        if (!passwordValid)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var roleName = user.UserRole?.strRoleName ?? "User";
        var token = GenerateToken(configuration, user.strEmail, roleName);

        return Ok(new
        {
            email = user.strEmail,
            name = user.strUserName,
            token,
            role = roleName,
            roleName,
            userId = user.strUserGUID
        });
    }

    // POST api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        // Check if email is already taken
        bool emailExists = await dbContext.Logins
            .AsNoTracking()
            .AnyAsync(x => x.Email == normalizedEmail, cancellationToken);

        if (emailExists)
        {
            return Conflict(new { message = "An account with this email already exists." });
        }

        // Hash the password before saving
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var newUser = new Login
        {
            Email = normalizedEmail,
            Password = hashedPassword
        };

        dbContext.Logins.Add(newUser);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(Register), new RegisterResponse
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName,
            Email = newUser.Email,
            CreatedAt = DateTime.UtcNow,
            Message = "Account created successfully."
        });
    }

    // POST api/auth/admin/register
    [HttpPost("admin/register")]
    public async Task<IActionResult> AdminRegister([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        bool emailExists = await dbContext.Logins
            .AsNoTracking()
            .AnyAsync(x => x.Email == normalizedEmail, cancellationToken);

        if (emailExists)
        {
            return Conflict(new { message = "An admin account with this email already exists." });
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var newAdmin = new Login
        {
            Email = normalizedEmail,
            Password = hashedPassword
        };

        dbContext.Logins.Add(newAdmin);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(AdminRegister), new RegisterResponse
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName,
            Email = newAdmin.Email,
            CreatedAt = DateTime.UtcNow,
            Message = "Admin account created successfully."
        });
    }

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var registeredUser = await dbContext.Logins
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);

        if (registeredUser is not null)
        {
            bool passwordValid = VerifyPassword(request.Password, registeredUser.Password);
            if (!passwordValid)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = GenerateToken(configuration, registeredUser.Email, "User");
            return Ok(new LoginResponse { Email = registeredUser.Email, Token = token, Role = "User" });
        }

        return Unauthorized(new { message = "Invalid email or password." });
    }

    // POST api/auth/admin/login
    [HttpPost("admin/login")]
    public async Task<IActionResult> AdminLogin([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();

        var adminUser = await dbContext.Logins
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);

        if (adminUser is null)
        {
            return Unauthorized(new { message = "Invalid admin email or password." });
        }

        bool passwordValid = VerifyPassword(request.Password, adminUser.Password);
        if (!passwordValid)
        {
            return Unauthorized(new { message = "Invalid admin email or password." });
        }

        var token = GenerateToken(configuration, adminUser.Email, "Admin");
        return Ok(new LoginResponse { Email = adminUser.Email, Token = token, Role = "Admin" });
    }

    // POST api/auth/forgot-password
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Please provide a valid email address." });
        }

        var normalizedEmail = request.strEmail.Trim().ToLowerInvariant();
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.strEmail == normalizedEmail, cancellationToken);

        var loginAccount = user is null
            ? await dbContext.Logins.FirstOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken)
            : null;

        // Do not reveal if an email exists in the system.
        if (user is null && loginAccount is null)
        {
            return Ok(new { message = "If the email exists, an OTP has been sent." });
        }

        if (user is not null && !user.bolIsActive)
        {
            return Ok(new { message = "If the email exists, an OTP has been sent." });
        }

        var otp = GenerateOtp();
        var expiry = DateTime.UtcNow.AddMinutes(15);

        if (user is not null)
        {
            user.strOTP = otp;
            user.dtOTPExpiry = expiry;
            user.dtUpdatedOn = DateTime.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);
        }
        else
        {
            LoginOtpStore[normalizedEmail] = (otp, expiry);
        }

        var subject = "Your password reset OTP";
        var recipientName = user?.strUserName;
        if (string.IsNullOrWhiteSpace(recipientName))
        {
            recipientName = "User";
        }

        var body = $@"<p>Hello {recipientName},</p>
<p>Your OTP for password reset is:</p>
<h2>{otp}</h2>
<p>This OTP is valid for 15 minutes.</p>
<p>If you did not request this, you can ignore this email.</p>";

        var targetEmail = user?.strEmail ?? loginAccount!.Email;
        var emailSent = await emailService.SendEmailAsync(targetEmail, subject, body, true);
        if (!emailSent)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = "Could not send OTP email. Please try again later."
            });
        }

        return Ok(new
        {
            message = "OTP has been sent to your email.",
            expiresAtUtc = expiry
        });
    }

    // POST api/auth/reset-password
    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpDto request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Please check email and OTP." });
        }

        var normalizedEmail = request.strEmail.Trim().ToLowerInvariant();
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.strEmail == normalizedEmail, cancellationToken);

        if (user is not null)
        {
            if (string.IsNullOrWhiteSpace(user.strOTP) || !string.Equals(user.strOTP, request.strOTP, StringComparison.Ordinal))
            {
                return BadRequest(new { message = "Invalid OTP." });
            }

            if (!user.dtOTPExpiry.HasValue || user.dtOTPExpiry.Value < DateTime.UtcNow)
            {
                user.strOTP = string.Empty;
                user.dtOTPExpiry = null;
                user.dtUpdatedOn = DateTime.UtcNow;
                await dbContext.SaveChangesAsync(cancellationToken);
                return BadRequest(new { message = "OTP expired. Please request a new one." });
            }

            return Ok(new { message = "OTP verified successfully." });
        }

        var loginAccount = await dbContext.Logins.FirstOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);
        if (loginAccount is null)
        {
            return BadRequest(new { message = "Invalid email or OTP." });
        }

        if (!LoginOtpStore.TryGetValue(normalizedEmail, out var otpEntry) ||
            !string.Equals(otpEntry.Otp, request.strOTP, StringComparison.Ordinal))
        {
            return BadRequest(new { message = "Invalid OTP." });
        }

        if (otpEntry.ExpiryUtc < DateTime.UtcNow)
        {
            LoginOtpStore.TryRemove(normalizedEmail, out _);
            return BadRequest(new { message = "OTP expired. Please request a new one." });
        }

        return Ok(new { message = "OTP verified successfully." });
    }

    // POST api/auth/reset-password
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request, CancellationToken cancellationToken)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Please check reset password inputs." });
        }

        var normalizedEmail = request.strEmail.Trim().ToLowerInvariant();
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.strEmail == normalizedEmail, cancellationToken);

        if (user is not null)
        {
            if (string.IsNullOrWhiteSpace(user.strOTP) || !string.Equals(user.strOTP, request.strOTP, StringComparison.Ordinal))
            {
                return BadRequest(new { message = "Invalid OTP." });
            }

            if (!user.dtOTPExpiry.HasValue || user.dtOTPExpiry.Value < DateTime.UtcNow)
            {
                user.strOTP = string.Empty;
                user.dtOTPExpiry = null;
                user.dtUpdatedOn = DateTime.UtcNow;
                await dbContext.SaveChangesAsync(cancellationToken);

                return BadRequest(new { message = "OTP expired. Please request a new one." });
            }

            user.strPassword = HashSha256Password(request.strNewPassword);
            user.strOTP = string.Empty;
            user.dtOTPExpiry = null;
            user.dtUpdatedOn = DateTime.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);
        }
        else
        {
            var loginAccount = await dbContext.Logins.FirstOrDefaultAsync(x => x.Email == normalizedEmail, cancellationToken);
            if (loginAccount is null)
            {
                return BadRequest(new { message = "Invalid email or OTP." });
            }

            if (!LoginOtpStore.TryGetValue(normalizedEmail, out var otpEntry) ||
                !string.Equals(otpEntry.Otp, request.strOTP, StringComparison.Ordinal))
            {
                return BadRequest(new { message = "Invalid OTP." });
            }

            if (otpEntry.ExpiryUtc < DateTime.UtcNow)
            {
                LoginOtpStore.TryRemove(normalizedEmail, out _);
                return BadRequest(new { message = "OTP expired. Please request a new one." });
            }

            loginAccount.Password = BCrypt.Net.BCrypt.HashPassword(request.strNewPassword);
            LoginOtpStore.TryRemove(normalizedEmail, out _);
            await dbContext.SaveChangesAsync(cancellationToken);
        }

        return Ok(new { message = "Password reset successful. You can now sign in." });
    }

    // SHA-256 password verification — used for users in the Users table
    private static bool VerifySha256Password(string plainPassword, string storedHash)
    {
        if (string.IsNullOrWhiteSpace(storedHash)) return false;

        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(plainPassword));
        var builder = new StringBuilder(hashedBytes.Length * 2);
        foreach (var b in hashedBytes)
            builder.Append(b.ToString("x2"));

        return string.Equals(builder.ToString(), storedHash, StringComparison.OrdinalIgnoreCase);
    }

    private static string HashSha256Password(string plainPassword)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(plainPassword));
        var builder = new StringBuilder(hashedBytes.Length * 2);
        foreach (var b in hashedBytes)
            builder.Append(b.ToString("x2"));

        return builder.ToString();
    }

    private static string GenerateOtp()
    {
        var value = RandomNumberGenerator.GetInt32(100000, 1_000_000);
        return value.ToString();
    }

    private static bool VerifyPassword(string plainPassword, string storedHash)
    {
        if (string.IsNullOrWhiteSpace(storedHash))
        {
            return false;
        }

        // BCrypt hashes start with "$2".
        if (storedHash.StartsWith("$2", StringComparison.Ordinal))
        {
            return BCrypt.Net.BCrypt.Verify(plainPassword, storedHash);
        }

        // Backward compatibility for legacy SHA-256 password records.
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(plainPassword));
        var builder = new StringBuilder(hashedBytes.Length * 2);
        foreach (var b in hashedBytes)
        {
            builder.Append(b.ToString("x2"));
        }

        if (string.Equals(builder.ToString(), storedHash, StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        // Final fallback for legacy plain-text records in Login table.
        return string.Equals(plainPassword, storedHash, StringComparison.Ordinal);
    }

    private static string GenerateToken(IConfiguration configuration, string email, string role)
    {
        var key          = configuration["Jwt:Key"]           ?? string.Empty;
        var issuer       = configuration["Jwt:Issuer"]        ?? string.Empty;
        var audience     = configuration["Jwt:Audience"]      ?? string.Empty;
        var expiryMinutes = int.TryParse(configuration["Jwt:ExpiryMinutes"], out var parsed) ? parsed : 60;

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, email),
            new(ClaimTypes.Role, role),
            new(JwtRegisteredClaimNames.Sub, email)
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creds      = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer:             issuer,
            audience:           audience,
            claims:             claims,
            expires:            DateTime.UtcNow.AddMinutes(expiryMinutes),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
