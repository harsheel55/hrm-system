using System.Text;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAttendanceService, AttendanceService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IFileUploadService, FileUploadService>();
builder.Services.AddScoped<ILeaveService, LeaveService>();
builder.Services.AddScoped<IMenuService, MenuService>();
builder.Services.AddScoped<IPayrollService, PayrollService>();
builder.Services.AddScoped<IRecruitmentService, RecruitmentService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRightsService, UserRightsService>();
builder.Services.AddScoped<IUserRoleService, UserRoleService>();
builder.Services.AddScoped<IShiftService, ShiftService>();

// CORS � allow the Vite dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
        policy.SetIsOriginAllowed(origin =>
              {
                  if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                  {
                      return false;
                  }

                  if (uri.Scheme is not ("http" or "https"))
                  {
                      return false;
                  }

                  return uri.Host is "localhost" or "127.0.0.1";
              })
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var defaultConnection = builder.Configuration.GetConnectionString("DefaultConnection");
var useInMemoryDatabase = string.IsNullOrWhiteSpace(defaultConnection);

if (!useInMemoryDatabase)
{
    try
    {
        var builderConnection = new SqlConnectionStringBuilder(defaultConnection)
        {
            ConnectTimeout = 2
        };

        using var connection = new SqlConnection(builderConnection.ConnectionString);
        connection.Open();
    }
    catch
    {
        useInMemoryDatabase = true;
    }
}

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (useInMemoryDatabase)
    {
        options.UseInMemoryDatabase("HrmAuthDevDb");
        return;
    }

    options.UseSqlServer(defaultConnection);
});

var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];
if (string.IsNullOrWhiteSpace(jwtKey) || string.IsNullOrWhiteSpace(jwtIssuer) || string.IsNullOrWhiteSpace(jwtAudience))
{
    throw new InvalidOperationException("Jwt settings are missing or invalid.");
}

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();
var logger = app.Services.GetRequiredService<ILogger<Program>>();

// Auto-create DB tables if they don't exist
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (db.Database.IsRelational())
    {
        db.Database.Migrate();
    }

    if (useInMemoryDatabase)
    {
        logger.LogWarning("SQL Server unavailable. Using in-memory database for authentication APIs.");
    }

    const string defaultHrEmail = "hr@hrm.local";
    const string defaultHrPassword = "Hr@123";
    try
    {
        // Seed default roles
        if (!useInMemoryDatabase)
        {
            try
            {
                var roles = new[]
                {
                    new UserRole
                    {
                        strUserRoleGUID = Guid.Parse("22222222-2222-2222-2222-222222222222"),
                        strRoleName = "HR",
                        strDesc = "Human Resources with management access",
                        bolIsActive = true,
                        bolSystemCreated = true,
                        dtCreatedOn = DateTime.UtcNow,
                        dtUpdatedOn = DateTime.UtcNow
                    },
                    new UserRole
                    {
                        strUserRoleGUID = Guid.Parse("33333333-3333-3333-3333-333333333333"),
                        strRoleName = "Employee",
                        strDesc = "Standard employee access",
                        bolIsActive = true,
                        bolSystemCreated = true,
                        dtCreatedOn = DateTime.UtcNow,
                        dtUpdatedOn = DateTime.UtcNow
                    }
                };

                foreach (var role in roles)
                {
                    var roleExists = db.UserRoles.Any(r => r.strUserRoleGUID == role.strUserRoleGUID);
                    if (!roleExists)
                    {
                        db.UserRoles.Add(role);
                    }
                }
                db.SaveChanges();
                logger.LogInformation("Seeded default user roles");
            }
            catch (Exception roleEx)
            {
                logger.LogWarning(roleEx, "Could not seed user roles.");
            }
        }

        // Seed HR login in Login table used by AuthController login endpoints.
        if (!useInMemoryDatabase)
        {
            try
            {
                var hrExists = db.Logins.Any(l => l.Email == defaultHrEmail);
                if (!hrExists)
                {
                    db.Logins.Add(new Login
                    {
                        Email = defaultHrEmail,
                        Password = BCrypt.Net.BCrypt.HashPassword(defaultHrPassword)
                    });

                    db.SaveChanges();
                    logger.LogInformation("Seeded default HR login account: {HrEmail}", defaultHrEmail);
                }
            }
            catch (Exception schemaEx)
            {
                logger.LogWarning(schemaEx, "Could not seed HR login account in Login table.");
                // Continue running - schema mismatch is not critical at startup
            }
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Unexpected error during startup seeding: {Message}", ex.Message);
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
