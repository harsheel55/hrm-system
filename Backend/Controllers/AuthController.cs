using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
        // Check if email is already taken
        bool emailExists = await dbContext.Registers
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

        dbContext.Registers.Add(newUser);
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

    // POST api/auth/admin/register
    [HttpPost("admin/register")]
    public async Task<IActionResult> AdminRegister([FromBody] RegisterRequest request, CancellationToken cancellationToken)
    {
        bool emailExists = await dbContext.Registers
            .AsNoTracking()
            .AnyAsync(x => x.Email == request.Email, cancellationToken);

        if (emailExists)
        {
            return Conflict(new { message = "An admin account with this email already exists." });
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var newAdmin = new Register
        {
            FullName = request.FullName,
            Email = request.Email,
            Password = hashedPassword,
            CreatedAt = DateTime.UtcNow
        };

        dbContext.Registers.Add(newAdmin);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(nameof(AdminRegister), new RegisterResponse
        {
            Id = newAdmin.Id,
            FullName = newAdmin.FullName,
            Email = newAdmin.Email,
            CreatedAt = newAdmin.CreatedAt,
            Message = "Admin account created successfully."
        });
    }

    // POST api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        // First try the Users table (registered via /register, BCrypt hashed)
        var registeredUser = await dbContext.Registers
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

        if (registeredUser is not null)
        {
            bool passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, registeredUser.Password);
            if (!passwordValid)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var token = GenerateToken(configuration, registeredUser.Email, "User");
            return Ok(new LoginResponse { Email = registeredUser.Email, Token = token, Role = "User" });
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

        var legacyToken = GenerateToken(configuration, legacyUser.Email, "User");
        return Ok(new LoginResponse { Email = legacyUser.Email, Token = legacyToken, Role = "User" });
    }

    // POST api/auth/admin/login
    [HttpPost("admin/login")]
    public async Task<IActionResult> AdminLogin([FromBody] LoginRequest request, CancellationToken cancellationToken)
    {
        var adminUser = await dbContext.Registers
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Email == request.Email, cancellationToken);

        if (adminUser is null)
        {
            return Unauthorized(new { message = "Invalid admin email or password." });
        }

        bool passwordValid = BCrypt.Net.BCrypt.Verify(request.Password, adminUser.Password);
        if (!passwordValid)
        {
            return Unauthorized(new { message = "Invalid admin email or password." });
        }

        var token = GenerateToken(configuration, adminUser.Email, "Admin");
        return Ok(new LoginResponse { Email = adminUser.Email, Token = token, Role = "Admin" });
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
