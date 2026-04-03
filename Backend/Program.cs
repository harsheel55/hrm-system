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
builder.Services.AddScoped<IBlogCategoryService, BlogCategoryService>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<IBlogTagService, BlogTagService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IFileUploadService, FileUploadService>();
builder.Services.AddScoped<ILeaveService, LeaveService>();
builder.Services.AddScoped<IMenuService, MenuService>();
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

    const string defaultAdminEmail = "admin@hrm.local";
    const string defaultAdminPassword = "Admin@123";
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
                        strUserRoleGUID = Guid.Parse("00000000-0000-0000-0000-000000000001"),
                        strRoleName = "Super Admin",
                        strDesc = "System Administrator with full access",
                        bolIsActive = true,
                        bolSystemCreated = true,
                        dtCreatedOn = DateTime.UtcNow,
                        dtUpdatedOn = DateTime.UtcNow
                    },
                    new UserRole
                    {
                        strUserRoleGUID = Guid.Parse("00000000-0000-0000-0000-000000000002"),
                        strRoleName = "Administrator",
                        strDesc = "Administrator with management permissions",
                        bolIsActive = true,
                        bolSystemCreated = true,
                        dtCreatedOn = DateTime.UtcNow,
                        dtUpdatedOn = DateTime.UtcNow
                    },
                    new UserRole
                    {
                        strUserRoleGUID = Guid.Parse("00000000-0000-0000-0000-000000000003"),
                        strRoleName = "Manager",
                        strDesc = "Manager with department control and reporting rights",
                        bolIsActive = true,
                        bolSystemCreated = true,
                        dtCreatedOn = DateTime.UtcNow,
                        dtUpdatedOn = DateTime.UtcNow
                    },
                    new UserRole
                    {
                        strUserRoleGUID = Guid.Parse("00000000-0000-0000-0000-000000000004"),
                        strRoleName = "Employee",
                        strDesc = "Standard employee with basic access",
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

        // Seed admin in Login table used by AuthController login endpoints.
        if (!useInMemoryDatabase)
        {
            try
            {
                var adminExists = db.Logins.Any(l => l.Email == defaultAdminEmail);
                if (!adminExists)
                {
                    db.Logins.Add(new Login
                    {
                        Email = defaultAdminEmail,
                        Password = BCrypt.Net.BCrypt.HashPassword(defaultAdminPassword)
                    });

                    db.SaveChanges();
                    logger.LogInformation("Seeded default admin login account: {AdminEmail}", defaultAdminEmail);
                }
            }
            catch (Exception schemaEx)
            {
                logger.LogWarning(schemaEx, "Could not seed admin login account in Login table.");
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
app.UseCors("FrontendPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
