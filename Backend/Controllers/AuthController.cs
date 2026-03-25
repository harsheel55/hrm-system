using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Backend.Data;
using Backend.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(AppDbContext dbContext, IConfiguration configuration) : ControllerBase
{
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
