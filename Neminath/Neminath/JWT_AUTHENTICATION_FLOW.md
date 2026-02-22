# JWT Authentication Flow - Pristine API

## Overview
The Pristine API implements a comprehensive JWT authentication system with the following key features:
- JWT token generation with multiple claims
- Token encryption/decryption for HTTP-only cookies
- Refresh token rotation
- Session management in database
- Automatic cookie reading and validation

---

## 1. JWT Configuration (Program.cs)

### JWT Settings Model
**File:** [Models/Auth/JwtSettings.cs](Models/Auth/JwtSettings.cs)

```csharp
public class JwtSettings
{
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;
    public double AccessTokenMinutes { get; set; } = 60;
    public int RefreshTokenDays { get; set; } = 7;
}
```

### Configuration in Program.cs
**File:** [Program.cs](Program.cs#L28-L94)

```csharp
// Load JWT settings from appsettings
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
if (jwtSettings is null || string.IsNullOrWhiteSpace(jwtSettings.Key))
{
    throw new InvalidOperationException("JwtSettings are missing or invalid.");
}

var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));

// Register Authentication Handler
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,           // ✓ Validate Issuer claim
        ValidateAudience = true,         // ✓ Validate Audience claim
        ValidateLifetime = true,         // ✓ Check token expiration
        ValidateIssuerSigningKey = true, // ✓ Verify signature
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = signingKey,
        ClockSkew = TimeSpan.FromMinutes(1) // Allow 1 minute clock skew
    };
});
```

### Middleware Pipeline
**File:** [Program.cs](Program.cs#L119-L133)

```csharp
// Token validation middleware - reads encrypted cookie and sets Authorization header
app.UseMiddleware<TokenValidationMiddleware>();

app.UseAuthentication();
app.UseAuthorization();
```

---

## 2. Token Generation - ITokenService

**File:** [Services/Auth/ITokenService.cs](Services/Auth/ITokenService.cs)

### Interface Definition
```csharp
public interface ITokenService
{
    string GenerateAccessToken(MstUser user, IEnumerable<Claim>? additionalClaims = null);
    (string token, DateTime expiresAt) GenerateRefreshToken();
}

public interface ITokenCryptoService
{
    string EncryptToken(string token);
    string DecryptToken(string encryptedToken);
}
```

### Implementation - TokenService

**File:** [Services/Auth/TokenService.cs](Services/Auth/TokenService.cs)

#### Generate Access Token
```csharp
public string GenerateAccessToken(MstUser user, IEnumerable<Claim>? additionalClaims = null)
{
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Key));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    // Core JWT claims
    var claims = new List<Claim>
    {
        new(JwtRegisteredClaimNames.Sub, user.UserGuid.ToString()),  // Subject: UserGuid
        new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // JWT ID (unique)
        // EventQR-style claims
        new("strUserGUID", user.UserGuid.ToString()),
        new("strEmail", user.Email),
        new("strUserRoleGUID", user.UserRoleGuid?.ToString() ?? string.Empty)
    };

    // Add custom claims (passed from controller)
    if (additionalClaims is not null)
    {
        claims.AddRange(additionalClaims);
    }

    // Create and sign JWT
    var token = new JwtSecurityToken(
        issuer: _settings.Issuer,
        audience: _settings.Audience,
        claims: claims,
        expires: DateTime.UtcNow.AddMinutes(_settings.AccessTokenMinutes),
        signingCredentials: creds);

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

#### Generate Refresh Token
```csharp
public (string token, DateTime expiresAt) GenerateRefreshToken()
{
    var bytes = RandomNumberGenerator.GetBytes(64);  // 64 random bytes
    var token = Convert.ToBase64String(bytes);
    var expires = DateTime.UtcNow.AddDays(_settings.RefreshTokenDays);
    return (token, expires);
}
```

#### Token Encryption (for HTTP-only cookies)
```csharp
public string EncryptToken(string token)
{
    var keyBytes = Encoding.UTF8.GetBytes(_settings.Key);
    
    // Ensure key is exactly 32 bytes for AES-256
    var key = new byte[32];
    Array.Copy(keyBytes, key, Math.Min(keyBytes.Length, 32));

    using var aes = Aes.Create();
    aes.Key = key;
    aes.GenerateIV();  // Random IV

    using var encryptor = aes.CreateEncryptor();
    using var ms = new MemoryStream();
    ms.Write(aes.IV, 0, aes.IV.Length);  // Prepend IV

    using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
    using (var sw = new StreamWriter(cs))
    {
        sw.Write(token);  // Encrypt token
    }

    return Convert.ToBase64String(ms.ToArray());  // IV + encrypted token
}

public string DecryptToken(string encryptedToken)
{
    var keyBytes = Encoding.UTF8.GetBytes(_settings.Key);
    var key = new byte[32];
    Array.Copy(keyBytes, key, Math.Min(keyBytes.Length, 32));

    var encryptedBytes = Convert.FromBase64String(encryptedToken);

    using var aes = Aes.Create();
    aes.Key = key;

    // Extract IV from first 16 bytes
    var iv = new byte[16];
    Array.Copy(encryptedBytes, 0, iv, 0, 16);
    aes.IV = iv;

    // Decrypt remaining bytes
    using var decryptor = Aes.Create().CreateDecryptor(aes.Key, aes.IV);
    using var ms = new MemoryStream(encryptedBytes, 16, encryptedBytes.Length - 16);
    using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
    using var sr = new StreamReader(cs);

    return sr.ReadToEnd();
}
```

---

## 3. Claims Stored in JWT

When tokens are generated, the following claims are included:

### Standard JWT Claims
| Claim | Value | Purpose |
|-------|-------|---------|
| `sub` | UserGuid | Subject identifier |
| `jti` | Unique GUID | JWT ID for uniqueness |
| `iss` | JwtSettings.Issuer | Token issuer |
| `aud` | JwtSettings.Audience | Token audience |
| `exp` | Unix timestamp | Expiration time |

### Custom Claims (Always Included)
| Claim | Value | 
|-------|-------|
| `strUserGUID` | User's GUID |
| `strEmail` | User's email |
| `strUserRoleGUID` | User's role GUID (if assigned) |

### Dynamic Claims (Login-specific)
**Added during login/refresh:**

```csharp
additionalClaims = new List<Claim>
{
    new("accountTypes", string.Join(",", accountTypes))  // Comma-separated resident types
};

// If only one account:
additionalClaims.Add(new Claim("activeAccountType", availableAccounts[0].strResidentType));
additionalClaims.Add(new Claim("activeAccountGUID", availableAccounts[0].strResidentGUID));

// Session tracking:
additionalClaims.Add(new Claim("strSessionGUID", sessionGuid.ToString()));
```

**Example JWT Payload:**
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "jti": "7c3e5e40-e29b-41d4-a716-446655440001",
  "strUserGUID": "550e8400-e29b-41d4-a716-446655440000",
  "strEmail": "user@example.com",
  "strUserRoleGUID": "admin-role-guid",
  "accountTypes": "Tenant,Owner",
  "activeAccountType": "Tenant",
  "activeAccountGUID": "tenant-guid",
  "strSessionGUID": "session-guid",
  "iss": "pristine-api",
  "aud": "pristine-app",
  "exp": 1705305600,
  "iat": 1705302000
}
```

---

## 4. Cookie Management

### Setting Cookies
**File:** [Controllers/AuthController.cs](Controllers/AuthController.cs#L1090-1110)

```csharp
private void SetTokenCookies(string accessToken, string refreshToken, DateTime refreshExpires)
{
    const string JwtCookieName = "Token";
    const string RefreshCookieName = "RefreshToken";

    // Access Token - encrypted, HTTP-only
    Response.Cookies.Append(
        JwtCookieName,
        accessToken,  // Already encrypted by controller before passing
        new CookieOptions
        {
            HttpOnly = true,  // ✓ Not accessible from JavaScript
            Secure = true,    // ✓ HTTPS only
            SameSite = SameSiteMode.Lax,
            Expires = DateTimeOffset.UtcNow.AddMinutes(_jwtSettings.AccessTokenMinutes)
        });

    // Refresh Token - encrypted, HTTP-only
    Response.Cookies.Append(
        RefreshCookieName,
        refreshToken,
        new CookieOptions
        {
            HttpOnly = true,  // ✓ Not accessible from JavaScript
            Secure = true,    // ✓ HTTPS only
            SameSite = SameSiteMode.Lax,
            Expires = refreshExpires
        });
}
```

---

## 5. Reading Tokens from Cookies - TokenValidationMiddleware

**File:** [Middleware/TokenValidationMiddleware.cs](Middleware/TokenValidationMiddleware.cs)

### Complete Flow

```csharp
public async Task InvokeAsync(HttpContext context)
{
    // Skip token validation for public endpoints
    var skipPrefixes = new[]
    {
        "/swagger",
        "/api/auth/login",
        "/api/auth/register",
        "/api/auth/forgot-password",
        "/api/auth/reset-password",
        "/api/auth/refresh-token"
    };

    if (skipPrefixes.Any(prefix => requestPath.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)))
    {
        await _next(context);
        return;
    }

    // CASE 1: Token in Authorization header
    var authHeader = context.Request.Headers["Authorization"].ToString();
    var tokenFromHeader = string.Empty;

    if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
    {
        tokenFromHeader = authHeader["Bearer ".Length..].Trim();
        
        // Try to decrypt (token might be encrypted)
        try
        {
            var decryptedToken = cryptoService.DecryptToken(tokenFromHeader);
            context.Request.Headers["Authorization"] = "Bearer " + decryptedToken;
            _logger.LogDebug("Decrypted token from Authorization header");
        }
        catch
        {
            // Token is already plain, use as-is
            _logger.LogDebug("Token in Authorization header is already plain");
        }
    }
    // CASE 2: No token in header, read from cookie
    else
    {
        var encryptedToken = context.Request.Cookies["Token"];

        if (!string.IsNullOrEmpty(encryptedToken))
        {
            try
            {
                var decryptedToken = cryptoService.DecryptToken(encryptedToken);
                context.Request.Headers["Authorization"] = "Bearer " + decryptedToken;
                _logger.LogDebug("Token read from cookie and set in Authorization header");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to decrypt token from cookie");
            }
        }
    }

    await _next(context);
}
```

### Token Reading Priority
1. **Authorization Header** (already in Bearer format)
   - If encrypted: decrypt it
   - If plain: use as-is
2. **Cookie Fallback** (if no Authorization header)
   - Read `Token` cookie
   - Decrypt the encrypted token
   - Set Authorization header with decrypted token

---

## 6. /me Endpoint - Extract userId from JWT

**File:** [Controllers/AuthController.cs](Controllers/AuthController.cs#L462-L525)

### Endpoint Implementation

```csharp
[HttpGet("me")]
[Authorize]  // Requires valid JWT
public async Task<IActionResult> GetCurrentUserAsync()
{
    // ✓ Extract UserGuid from JWT claims
    // Supports both standard and custom claim names
    var userGuidClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub) 
                        ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
    
    if (!Guid.TryParse(userGuidClaim, out var userGuid))
    {
        return Unauthorized(ApiResponse<object>.Fail(
            StatusCodes.Status401Unauthorized, "Invalid token"));
    }

    // Fetch user from database
    var user = await _context.MstUsers
        .AsNoTracking()
        .SingleOrDefaultAsync(u => u.UserGuid == userGuid);

    if (user is null)
    {
        return Unauthorized(ApiResponse<object>.Fail(
            StatusCodes.Status401Unauthorized, "User not found"));
    }

    // Get user role name
    string? roleName = null;
    if (user.UserRoleGuid.HasValue)
    {
        roleName = await _context.MstUserRoles
            .AsNoTracking()
            .Where(r => r.UserRoleGuid == user.UserRoleGuid.Value)
            .Select(r => r.Name)
            .FirstOrDefaultAsync();
    }

    // Get account types from claims
    var accountTypes = await GetUserAccountTypesAsync(user.UserGuid);
    
    // Priority 1: Get active account from session DB (if session GUID in token)
    ActiveAccountDto? activeAccount = null;
    var sessionGuidClaim = User.FindFirst("strSessionGUID")?.Value;
    
    if (Guid.TryParse(sessionGuidClaim, out var sessionGuid))
    {
        var session = await _context.MstUserSessions
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.SessionGuid == sessionGuid);
        
        if (session != null && session.ActiveResidentGuid.HasValue 
            && !string.IsNullOrEmpty(session.ActiveResidentType))
        {
            activeAccount = await GetActiveAccountAsync(
                user.UserGuid, 
                accountTypes, 
                session.ActiveResidentType, 
                session.ActiveResidentGuid.Value.ToString());
        }
    }
    
    // Priority 2: Fallback to claims if session not found
    if (activeAccount == null)
    {
        var activeTypeClaim = User.FindFirst("activeAccountType")?.Value;
        var activeGuidClaim = User.FindFirst("activeAccountGUID")?.Value;
        activeAccount = await GetActiveAccountAsync(
            user.UserGuid, 
            accountTypes, 
            activeTypeClaim, 
            activeGuidClaim);
    }

    // Return user context
    var profile = new UserContextDto
    {
        strUserGUID = user.UserGuid.ToString(),
        strName = user.Name,
        strEmail = user.Email,
        strPhoneNO = user.PhoneNo ?? string.Empty,
        strUserRoleGUID = user.UserRoleGuid?.ToString(),
        strUserRoleName = roleName ?? string.Empty,
        accountTypes = accountTypes,
        activeAccount = activeAccount
    };

    return Ok(ApiResponse<UserContextDto>.Success(
        profile, "User context retrieved successfully"));
}
```

### Claim Extraction Methods

```csharp
// Method 1: Standard JWT claim
var userId = User.FindFirstValue(JwtRegisteredClaimNames.Sub);

// Method 2: Custom claim name
var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

// Method 3: Get specific custom claim
var sessionGuid = User.FindFirst("strSessionGUID")?.Value;
var activeAccountType = User.FindFirst("activeAccountType")?.Value;
```

---

## 7. Complete Authentication Flow - Login to /me

### Step 1: Login Endpoint
**File:** [Controllers/AuthController.cs](Controllers/AuthController.cs#L252-L350)

1. User submits email and password
2. Password verified against hashed password
3. Account types determined (Tenant/Owner)
4. Session created in database with unique SessionGuid
5. Access token generated with claims:
   - `sub` (UserGuid)
   - `strUserGUID`, `strEmail`, `strUserRoleGUID`
   - `accountTypes` (comma-separated)
   - `activeAccountType` (if single account)
   - `strSessionGUID`
6. Refresh token generated (random 64 bytes)
7. Both tokens encrypted and set in HTTP-only cookies
8. Encrypted token returned in response body

```csharp
var sessionGuid = Guid.NewGuid();
var additionalClaims = new List<Claim>
{
    new("accountTypes", string.Join(",", accountTypes))
};

if (availableAccounts.Count == 1)
{
    additionalClaims.Add(new Claim("activeAccountType", availableAccounts[0].strResidentType));
    additionalClaims.Add(new Claim("activeAccountGUID", availableAccounts[0].strResidentGUID));
}

additionalClaims.Add(new Claim("strSessionGUID", sessionGuid.ToString()));

var accessToken = _tokenService.GenerateAccessToken(user, additionalClaims);
var (refreshToken, refreshExpires) = _tokenService.GenerateRefreshToken();

// Create session in database
var session = new MstUserSession
{
    SessionGuid = sessionGuid,
    UserGuid = user.UserGuid,
    AppType = isPortalLogin ? "PORTAL" : "ADMIN",
    RefreshToken = refreshToken,
    RefreshTokenExpiry = refreshExpires,
    IsActive = true,
    LoginOn = DateTime.UtcNow
};

_context.MstUserSessions.Add(session);
await _context.SaveChangesAsync();

SetTokenCookies(_tokenCryptoService.EncryptToken(accessToken), refreshToken, refreshExpires);
```

### Step 2: Subsequent Requests to /me

1. Client sends request with Authorization header or cookie
2. **TokenValidationMiddleware** intercepts:
   - If token in header: decrypt if needed, keep in header
   - If token in cookie: decrypt and move to Authorization header
3. **JWT Bearer** validates token:
   - Signature verified
   - Issuer/Audience validated
   - Expiration checked
   - ClaimsPrincipal populated with all claims
4. Controller action `[Authorize]` attribute allows request
5. `/me` endpoint extracts `sub` claim → `userGuid`
6. User fetched from database
7. Session looked up using `strSessionGUID` claim
8. Active account retrieved from session or fallback to claims
9. User context returned with all details

### Step 3: Token Refresh
**File:** [Controllers/AuthController.cs](Controllers/AuthController.cs#L357-L430)

1. Client calls `/api/auth/refresh-token`
2. Refresh token read from cookie or `X-Refresh-Token` header
3. Session looked up in database by refresh token
4. Expiration and active status validated
5. New access token generated with same claims
6. New refresh token generated (token rotation)
7. Both encrypted and set in cookies
8. New tokens returned in response

---

## 8. Security Summary

| Feature | Implementation |
|---------|-----------------|
| **Token Storage** | HTTP-only cookies (not accessible from JavaScript) |
| **Token Encryption** | AES-256 encryption with random IV |
| **Signature Algorithm** | HMAC-SHA256 |
| **Token Lifetime** | Configurable (default 60 minutes) |
| **Refresh Token Lifetime** | Configurable (default 7 days) |
| **Refresh Token Storage** | Database table `MstUserSessions` |
| **Token Rotation** | New refresh token on each refresh |
| **Session Tracking** | SessionGuid in JWT + database record |
| **Multi-device Support** | Each login creates separate session |
| **Logout** | Sessions marked inactive, refresh token cleared |

---

## 9. Configuration Example (appsettings.json)

```json
{
  "JwtSettings": {
    "Issuer": "pristine-api",
    "Audience": "pristine-app",
    "Key": "your-super-secret-key-at-least-32-characters-long!",
    "AccessTokenMinutes": 60,
    "RefreshTokenDays": 7
  }
}
```

---

## 10. Database Models

### MstUser
```csharp
public class MstUser
{
    public Guid UserGuid { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }  // Hashed
    public string? PhoneNo { get; set; }
    public Guid? UserRoleGuid { get; set; }
    public bool IsActive { get; set; }
    public DateTime LastLoginDate { get; set; }
    public DateTime CreatedOn { get; set; }
}
```

### MstUserSession (Refresh Token Storage)
```csharp
public class MstUserSession
{
    public Guid SessionGuid { get; set; }
    public Guid UserGuid { get; set; }
    public string AppType { get; set; }  // "ADMIN" or "PORTAL"
    public string RefreshToken { get; set; }
    public DateTime RefreshTokenExpiry { get; set; }
    public bool IsActive { get; set; }
    public DateTime LoginOn { get; set; }
    public DateTime? LogoutOn { get; set; }
    public Guid? ActiveResidentGuid { get; set; }
    public string? ActiveResidentType { get; set; }
    
    public MstUser User { get; set; }
}
```
