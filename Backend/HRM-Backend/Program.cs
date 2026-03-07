using System.Text;
using HRM_Backend.Data;
using HRM_Backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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
    const string defaultAdminName = "System Admin";

    var adminExists = db.Users.Any(u => u.Email == defaultAdminEmail);
    if (!adminExists)
    {
        db.Users.Add(new Register
        {
            FullName = defaultAdminName,
            Email = defaultAdminEmail,
            Password = BCrypt.Net.BCrypt.HashPassword(defaultAdminPassword),
            CreatedAt = DateTime.UtcNow
        });

        db.SaveChanges();
        logger.LogInformation("Seeded default admin account: {AdminEmail}", defaultAdminEmail);
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
