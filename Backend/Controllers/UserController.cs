using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    /// <summary>
    /// REST API Controller for User Management operations
    /// All endpoints require JWT authentication via [Authorize] attribute
    /// Base route: /api/user
    /// 
    /// IMPORTANT: All endpoints in this controller are protected and require a valid JWT token.
    /// Include token in request header: Authorization: Bearer {token}
    /// 
    /// Examples of operations:
    /// - GET /api/user - Get all users (Admin only typically)
    /// - GET /api/user/123 - Get specific user by ID
    /// - GET /api/user/email/admin@example.com - Get user by email
    /// - POST /api/user - Create new user
    /// - PUT /api/user/123 - Update user details
    /// - DELETE /api/user/123 - Delete user permanently
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]  // PROTECTION: All methods require valid JWT token in Authorization header
    public class UserController : ControllerBase
    {
        // Injected service for user operations (CRUD, password verification, etc.)
        private readonly IUserService _userService;
        private readonly AppDbContext _context;

        // Constructor: Receives UserService and DbContext dependency injection
        public UserController(IUserService userService, AppDbContext context)
        {
            _userService = userService;
            _context = context;
        }

        /// <summary>
        /// GET: /api/user
        /// Get a list of all users in the system
        /// Returns 200 OK with list of UserResponseDto
        /// 
        /// Requires: JWT token with any valid role
        /// Use case: Admin dashboard to view all registered users
        /// Example response: 
        /// [
        ///   { strUserGUID: "11111111-...", strEmail: "admin@example.com", ... },
        ///   { strUserGUID: "22222222-...", strEmail: "user@example.com", ... }
        /// ]
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<object>>> GetAllUsers()
        {
            // Call service to retrieve all users from database
            var users = await _userService.GetAllUsersAsync();
            
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "Users retrieved successfully",
                data = users
            };
            return Ok(response);
        }

        /// <summary>
        /// GET: /api/user/{id}
        /// Get a specific user by their unique GUID
        /// Returns 200 OK with UserResponseDto, or 404 if not found
        /// 
        /// Requires: JWT token with any valid role
        /// Parameters: id = User's unique GUID (e.g., 11111111-1111-1111-1111-111111111111)
        /// Use case: View individual user profile/details
        /// Example response:
        /// {
        ///   "strUserGUID": "11111111-1111-1111-1111-111111111111",
        ///   "strEmail": "admin@example.com",
        ///   "strUserName": "Super Admin",
        ///   "bolIsActive": true
        /// }
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> GetUserById(Guid id)
        {
            // Find user by GUID
            var user = await _userService.GetUserByIdAsync(id);
            
            // If user not found, return 404 Not Found with error message
            if (user == null)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "User not found",
                    data = null
                };
                return NotFound(notFound);
            }
            
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "User retrieved successfully",
                data = user
            };
            return Ok(response);
        }

        /// <summary>
        /// GET: /api/user/email/{email}
        /// Get a specific user by their email address
        /// Returns 200 OK with UserResponseDto, or 404 if not found
        /// 
        /// Requires: JWT token with any valid role
        /// Parameters: email = User's email address (e.g., admin@example.com)
        /// Use case: Look up user by email instead of GUID
        /// Example response: Same as GetUserById
        /// </summary>
        [HttpGet("email/{email}")]
        public async Task<ActionResult<ApiResponse<object>>> GetUserByEmail(string email)
        {
            // Find user by email address
            var user = await _userService.GetUserByEmailAsync(email);
            
            // If user not found, return 404 Not Found
            if (user == null)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "User not found",
                    data = null
                };
                return NotFound(notFound);
            }
            
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "User retrieved successfully",
                data = user
            };
            return Ok(response);
        }

        /// <summary>
        /// POST: /api/user
        /// Create a new user account with optional profile image
        /// Returns 201 Created with new UserResponseDto, or 400 if validation fails
        /// 
        /// Requires: JWT token with admin role (typically)
        /// Content-Type: multipart/form-data
        /// 
        /// Form fields:
        /// - strUserName (text) - Required
        /// - strEmail (text) - Required  
        /// - strPassword (text) - Required
        /// - strPhoneNo (text) - Optional
        /// - dDob (text/date) - Optional
        /// - strRoleGUID (text/guid) - Optional
        /// - strPreferredLanguage (text) - Optional, default "en"
        /// - profileImage (file) - Optional, jpg/jpeg/png/gif max 5MB
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<object>>> CreateUser([FromForm] CreateUserDto createUserDto)
        {
            try
            {
                // Validate model state
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .ToList();
                    
                    var errorResponse = new ApiResponse<object>
                    {
                        statusCode = 400,
                        message = string.Join(", ", errors),
                        data = null
                    };
                    return BadRequest(errorResponse);
                }

                // Handle profile image if provided
                if (createUserDto.strProfileImage != null && createUserDto.strProfileImage.Length > 0)
                {
                    // Validate file
                    const long maxFileSize = 5 * 1024 * 1024;
                    if (createUserDto.strProfileImage.Length > maxFileSize)
                    {
                        var errorResponse = new ApiResponse<object>
                        {
                            statusCode = 400,
                            message = "Profile image exceeds 5MB limit",
                            data = null
                        };
                        return BadRequest(errorResponse);
                    }

                    // Check file type
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                    var extension = Path.GetExtension(createUserDto.strProfileImage.FileName).ToLowerInvariant();
                    if (!allowedExtensions.Contains(extension))
                    {
                        var errorResponse = new ApiResponse<object>
                        {
                            statusCode = 400,
                            message = "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed",
                            data = null
                        };
                        return BadRequest(errorResponse);
                    }

                    // Create uploads directory
                    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
                    if (!Directory.Exists(uploadsPath))
                    {
                        Directory.CreateDirectory(uploadsPath);
                    }

                    // Generate unique filename
                    var newUserId = Guid.NewGuid();
                    var fileName = $"{newUserId}_{DateTime.UtcNow.Ticks}{extension}";
                    var filePath = Path.Combine(uploadsPath, fileName);

                    // Save file to disk
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await createUserDto.strProfileImage.CopyToAsync(stream);
                    }

                    // Store the profile image URL to be saved in database
                    var imageUrl = $"/uploads/profiles/{fileName}";
                    var user = await _userService.CreateUserAsync(createUserDto, null, imageUrl);
                    
                    var response = new ApiResponse<object>
                    {
                        statusCode = 201,
                        message = "User created successfully",
                        data = user
                    };
                    return CreatedAtAction(nameof(GetUserById), new { id = user.strUserGUID }, response);
                }
                else
                {
                    // Call service to create new user without profile image
                    var user = await _userService.CreateUserAsync(createUserDto);
                    
                    var response = new ApiResponse<object>
                    {
                        statusCode = 201,
                        message = "User created successfully",
                        data = user
                    };
                    return CreatedAtAction(nameof(GetUserById), new { id = user.strUserGUID }, response);
                }
            }
            catch (InvalidOperationException ex)
            {
                var error = new ApiResponse<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                };
                return BadRequest(error);
            }
        }

        /// <summary>
        /// PUT: /api/user/{id}
        /// Update an existing user's information with optional profile image
        /// Returns 200 OK with updated UserResponseDto, 404 if not found, or 400 if validation fails
        /// 
        /// Requires: JWT token (typically must be the user or admin)
        /// Parameters: id = User's unique GUID
        /// Content-Type: multipart/form-data
        /// 
        /// Form fields (all optional):
        /// - strUserName (text) - Update name
        /// - strEmail (text) - Update email
        /// - strPhoneNo (text) - Update phone
        /// - dDob (text/date) - Update date of birth
        /// - bolIsActive (text/bool) - Update active status
        /// - strRoleGUID (text/guid) - Update role
        /// - strPreferredLanguage (text) - Update language
        /// - profileImage (file) - Update profile image, jpg/jpeg/png/gif max 5MB
        /// 
        /// Use case: User updates profile or admin updates user details
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> UpdateUser(Guid id, [FromForm] UpdateUserDto updateUserDto)
        {
            try
            {
                // Get current user to check existing profile image
                var currentUser = await _context.Users.FindAsync(id);
                if (currentUser == null)
                {
                    var notFound = new ApiResponse<object>
                    {
                        statusCode = 404,
                        message = "User not found",
                        data = null
                    };
                    return NotFound(notFound);
                }

                // Handle profile image if provided
                if (updateUserDto.strProfileImage != null && updateUserDto.strProfileImage.Length > 0)
                {
                    // Validate file
                    const long maxFileSize = 5 * 1024 * 1024;
                    if (updateUserDto.strProfileImage.Length > maxFileSize)
                    {
                        var errorResponse = new ApiResponse<object>
                        {
                            statusCode = 400,
                            message = "Profile image exceeds 5MB limit",
                            data = null
                        };
                        return BadRequest(errorResponse);
                    }

                    // Check file type
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                    var extension = Path.GetExtension(updateUserDto.strProfileImage.FileName).ToLowerInvariant();
                    if (!allowedExtensions.Contains(extension))
                    {
                        var errorResponse = new ApiResponse<object>
                        {
                            statusCode = 400,
                            message = "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed",
                            data = null
                        };
                        return BadRequest(errorResponse);
                    }

                    // Delete old profile image if exists
                    if (!string.IsNullOrEmpty(currentUser.strProfileImg))
                    {
                        var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", currentUser.strProfileImg.TrimStart('/'));
                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    // Create uploads directory if it doesn't exist
                    var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "profiles");
                    if (!Directory.Exists(uploadsPath))
                    {
                        Directory.CreateDirectory(uploadsPath);
                    }

                    // Generate unique filename
                    var fileName = $"{id}_{DateTime.UtcNow.Ticks}{extension}";
                    var filePath = Path.Combine(uploadsPath, fileName);

                    // Save file to disk
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await updateUserDto.strProfileImage.CopyToAsync(stream);
                    }

                    // Set profile image URL in database
                    var imageUrl = $"/uploads/profiles/{fileName}";
                    currentUser.strProfileImg = imageUrl;
                    currentUser.dtUpdatedOn = DateTime.UtcNow;
                    
                    // Get current user ID for audit trail
                    var currentUserIdClaim = User.FindFirst("userId")?.Value;
                    if (Guid.TryParse(currentUserIdClaim, out var currentUserId))
                    {
                        currentUser.strUpdatedByGUID = currentUserId;
                    }
                    
                    await _context.SaveChangesAsync();
                }

                // Call service to update user
                var user = await _userService.UpdateUserAsync(id, updateUserDto);
                
                // If user not found, return 404 Not Found
                if (user == null)
                {
                    var notFound = new ApiResponse<object>
                    {
                        statusCode = 404,
                        message = "User not found",
                        data = null
                    };
                    return NotFound(notFound);
                }
                
                var response = new ApiResponse<object>
                {
                    statusCode = 200,
                    message = "User updated successfully",
                    data = user
                };
                return Ok(response);
            }
            catch (InvalidOperationException ex)
            {
                var error = new ApiResponse<object>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                };
                return BadRequest(error);
            }
        }

        /// <summary>
        /// DELETE: /api/user/{id}
        /// Delete a user account permanently from the system
        /// Returns 204 No Content if successful, or 404 if user not found
        /// 
        /// Requires: JWT token with admin role (typically)
        /// Parameters: id = User's unique GUID
        /// Use case: Admin removes a user account
        /// WARNING: This is permanent and cannot be undone!
        /// Example response: 204 No Content (empty response)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteUser(Guid id)
        {
            // Call service to delete user from database
            var result = await _userService.DeleteUserAsync(id);
            
            // If user not found, return 404 Not Found
            if (!result)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "User not found",
                    data = null
                };
                return NotFound(notFound);
            }
            
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "User deleted successfully",
                data = new { }
            };
            return Ok(response);
        }

        /// <summary>
        /// POST: /api/user/verify-password
        /// Verify if a password is correct for a user's account
        /// Returns 200 OK with { isValid: true/false }
        /// 
        /// Requires: JWT token (typically requires the user to verify their own password)
        /// Request body: VerifyPasswordDto with email and password
        /// Use case: Security check before allowing sensitive operations (delete account, change password, etc.)
        /// Example request:
        /// {
        ///   "email": "admin@example.com",
        ///   "password": "ChangeMe123!"
        /// }
        /// Example response:
        /// {
        ///   "isValid": true
        /// }
        /// </summary>
        [HttpPost("verify-password")]
        public async Task<ActionResult<ApiResponse<object>>> VerifyPassword([FromBody] VerifyPasswordDto dto)
        {
            // Call service to verify password
            // Returns true if password matches, false otherwise
            var result = await _userService.VerifyPasswordAsync(dto.Email, dto.Password);
            
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = result ? "Password verified successfully" : "Invalid password",
                data = new { isValid = result }
            };
            return Ok(response);
        }
    }

    public class VerifyPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
