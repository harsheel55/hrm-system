using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HRM_Backend.Data;
using HRM_Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace HRM_Backend.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(AppDbContext dbContext, IConfiguration configuration) : ControllerBase
{
    // POST api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        // Check if email is already taken
        bool emailExists = await dbContext.Users
            .AsNoTracking()
            .AnyAsync(x => x.Email == request.Email, cancellationToken);

        if (emailExists)
        {
            return Conflict(new { message = "An account with this email already exists." });
        }

        // Hash the password before saving
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var newUser = new Register
        {
            FullName  = request.FullName,
            Email     = request.Email,
            Password  = hashedPassword,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Users.Add(newUser);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(Register), new RegisterResponse
        {
            Id        = newUser.Id,
            FullName  = newUser.FullName,
            Email     = newUser.Email,
            CreatedAt = newUser.CreatedAt,
            Message   = "Account created successfully."
        });
    }

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        // First try the Users table (registered via /register, BCrypt hashed)
        var registeredUser = await dbContext.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

        if (registeredUser is not null)
        {
            bool passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, registeredUser.Password);
            if (!passwordValid)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = GenerateToken(configuration, registeredUser.Email);
            return Ok(new LoginResponse { Email = registeredUser.Email, Token = token });
        }

        // Fall back to the legacy Login table (plain-text passwords)
        var legacyUser = await dbContext.Logins
            .AsNoTracking()
            .SingleOrDefaultAsync(
                x => x.Email == request.Email && x.Password == request.Password,
                cancellationToken);

        if (legacyUser is null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        var legacyToken = GenerateToken(configuration, legacyUser.Email);
        return Ok(new LoginResponse { Email = legacyUser.Email, Token = legacyToken });
    }

    private static string GenerateToken(IConfiguration configuration, string email)
    {
        var key          = configuration["Jwt:Key"]           ?? string.Empty;
        var issuer       = configuration["Jwt:Issuer"]        ?? string.Empty;
        var audience     = configuration["Jwt:Audience"]      ?? string.Empty;
        var expiryMinutes = int.TryParse(configuration["Jwt:ExpiryMinutes"], out var parsed) ? parsed : 60;

        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, email),
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
