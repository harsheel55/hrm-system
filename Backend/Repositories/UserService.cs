using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Backend.Common;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    /// <summary>
    /// Service to manage User accounts (Create, Read, Update, Delete)
    /// Handles user authentication data and profile information
    /// All passwords are hashed using SHA-256 before storing in database
    /// </summary>
    public class UserService : IUserService
    {
        // Database connection to access Users table (mstUser)
        private readonly AppDbContext _context;

        // Constructor: Receives database connection when service is created
        public UserService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// STEP 1: Get a specific user by their unique ID (GUID)
        /// Example: GetUserByIdAsync(new Guid("11111111-1111-1111-1111-111111111111"))
        /// Returns null if user not found
        /// </summary>
        public async Task<UserResponseDto?> GetUserByIdAsync(Guid userId)
        {
            // Search database for user with this ID and include role information
            var user = await _context.Users
                .Include(u => u.UserRole)
                .FirstOrDefaultAsync(u => u.strUserGUID == userId);
            
            // If not found, return null. Otherwise, convert to safe response format (without password)
            return user == null ? null : MapToResponseDto(user);
        }

        /// <summary>
        /// STEP 2: Get a specific user by their email address
        /// Example: GetUserByEmailAsync("admin@example.com")
        /// Returns null if user not found
        /// </summary>
        public async Task<UserResponseDto?> GetUserByEmailAsync(string email)
        {
            // Search database for user with this email and include role information
            var user = await _context.Users
                .Include(u => u.UserRole)
                .FirstOrDefaultAsync(u => u.strEmail == email);
            
            // If not found, return null. Otherwise, convert to safe response format
            return user == null ? null : MapToResponseDto(user);
        }

        /// <summary>
        /// STEP 3: Get all users from database
        /// Returns a list of all registered users
        /// </summary>
        public async Task<IEnumerable<UserResponseDto>> GetAllUsersAsync()
        {
            // Get all users from database with role information
            var users = await _context.Users
                .Include(u => u.UserRole)
                .ToListAsync();
            
            // Convert each user to response format (safe format without passwords) and return
            return users.Select(MapToResponseDto);
        }

        /// <summary>
        /// STEP 4: Create a new user account
        /// Example: CreateUserAsync(new CreateUserDto { strEmail = "newuser@example.com", strPassword = "Pass123!" })
        /// Password is automatically hashed using SHA-256 algorithm
        /// </summary>
        public async Task<UserResponseDto> CreateUserAsync(CreateUserDto createUserDto, Guid? createdByGuid = null, string? profileImageUrl = null)
        {
            var auditCreatedBy = createdByGuid ?? SystemConstants.SYSTEM_USER_GUID;
            var normalizedEmail = createUserDto.strEmail.Trim().ToLowerInvariant();

            // VALIDATION: Check if email already exists - prevent duplicate emails
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.strEmail == normalizedEmail);
            if (existingUser != null)
            {
                // Stop and throw error - this email is already registered
                throw new InvalidOperationException("User with this email already exists.");
            }

            // VALIDATION: If a role is provided, ensure it exists
            if (createUserDto.strRoleGUID.HasValue)
            {
                var roleExists = await _context.UserRoles.AnyAsync(r => r.strUserRoleGUID == createUserDto.strRoleGUID.Value);
                if (!roleExists)
                {
                    throw new InvalidOperationException("Invalid role GUID. Role not found.");
                }
            }

            // CREATE NEW USER: Build the user object with all required fields
            var user = new User
            {
                strUserGUID = Guid.NewGuid(),                              // Generate unique ID automatically
                strUserName = createUserDto.strUserName,                   // Full name (e.g., "John Doe")
                strEmail = normalizedEmail,                                 // Email address (e.g., "john@example.com")
                strPassword = HashPassword(createUserDto.strPassword),      // HASH password before storing (security)
                strPhoneNo = createUserDto.strPhoneNo,                      // Phone number (optional)
                dDob = createUserDto.dDob,                                  // Date of birth (optional)
                bolIsActive = true,                                         // New users are active by default
                bolSystemCreated = false,                                   // This is a regular user, not system-created
                strRoleGUID = createUserDto.strRoleGUID,                    // Link to user role (Admin, User, etc.)
                strPreferredLanguage = createUserDto.strPreferredLanguage,  // Language preference (default: "en" for English)
                strBankName = createUserDto.strBankName,
                strBankAccountNo = createUserDto.strBankAccountNo,
                strTaxBracket = createUserDto.strTaxBracket,
                strLocation = createUserDto.strLocation,
                strProfileImg = profileImageUrl ?? string.Empty,            // Profile image URL (passed from controller if file uploaded)
                strCreatedByGUID = auditCreatedBy,                          // Who created this user (default to system)
                dtCreatedOn = DateTime.UtcNow,                              // Timestamp: when user was created
                dtUpdatedOn = DateTime.UtcNow,                              // Timestamp: when last updated
                strUpdatedByGUID = auditCreatedBy                           // Initial update actor
            };

            // SAVE TO DATABASE: Add user and create matching Login row for compatibility.
            _context.Users.Add(user);

            var loginExists = await _context.Logins.AnyAsync(l => l.Email == normalizedEmail);
            if (!loginExists)
            {
                _context.Logins.Add(new Login
                {
                    Email = normalizedEmail,
                    Password = BCrypt.Net.BCrypt.HashPassword(createUserDto.strPassword)
                });
            }

            await _context.SaveChangesAsync();

            // Return the newly created user in response format
            return MapToResponseDto(user);
        }

        /// <summary>
        /// STEP 5: Update an existing user's information
        /// Only updates fields that are provided (partial update)
        /// Example: UpdateUserAsync(userId, new UpdateUserDto { strUserName = "Jane Doe" })
        /// </summary>
        public async Task<UserResponseDto?> UpdateUserAsync(Guid userId, UpdateUserDto updateUserDto, Guid? updatedByGuid = null)
        {
            var auditUpdatedBy = updatedByGuid ?? SystemConstants.SYSTEM_USER_GUID;

            // Find the user to update
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                // User not found, return null
                return null;
            }

            // UPDATE USER NAME (if provided and not empty)
            if (!string.IsNullOrEmpty(updateUserDto.strUserName))
                user.strUserName = updateUserDto.strUserName;

            // UPDATE EMAIL (if provided)
            if (!string.IsNullOrEmpty(updateUserDto.strEmail))
            {
                // VALIDATION: Check if new email is not already used by another user
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.strEmail == updateUserDto.strEmail && u.strUserGUID != userId);
                if (existingUser != null)
                {
                    // Stop and throw error - another user already has this email
                    throw new InvalidOperationException("Email already in use by another user.");
                }
                user.strEmail = updateUserDto.strEmail;
            }

            // UPDATE PHONE NUMBER (if provided)
            if (!string.IsNullOrEmpty(updateUserDto.strPhoneNo))
                user.strPhoneNo = updateUserDto.strPhoneNo;

            // UPDATE DATE OF BIRTH (if provided)
            if (updateUserDto.dDob.HasValue)
                user.dDob = updateUserDto.dDob;

            // UPDATE ACTIVE STATUS (if provided - enable/disable account)
            if (updateUserDto.bolIsActive.HasValue)
                user.bolIsActive = updateUserDto.bolIsActive.Value;

            // UPDATE USER ROLE (if provided - change permission level)
            if (updateUserDto.strRoleGUID.HasValue)
            {
                var roleExists = await _context.UserRoles.AnyAsync(r => r.strUserRoleGUID == updateUserDto.strRoleGUID.Value);
                if (!roleExists)
                {
                    throw new InvalidOperationException("Invalid role GUID. Role not found.");
                }

                user.strRoleGUID = updateUserDto.strRoleGUID;
            }

            // UPDATE LANGUAGE PREFERENCE (if provided - English, Spanish, etc.)
            if (!string.IsNullOrEmpty(updateUserDto.strPreferredLanguage))
                user.strPreferredLanguage = updateUserDto.strPreferredLanguage;

            // UPDATE BANK DETAILS (if provided)
            if (!string.IsNullOrEmpty(updateUserDto.strBankName))
                user.strBankName = updateUserDto.strBankName;

            if (!string.IsNullOrEmpty(updateUserDto.strBankAccountNo))
                user.strBankAccountNo = updateUserDto.strBankAccountNo;

            if (!string.IsNullOrEmpty(updateUserDto.strTaxBracket))
                user.strTaxBracket = updateUserDto.strTaxBracket;

            if (!string.IsNullOrEmpty(updateUserDto.strLocation))
                user.strLocation = updateUserDto.strLocation;

            // UPDATE METADATA: Who updated it and when
            user.strUpdatedByGUID = auditUpdatedBy;                        // Admin who made the change (default to system)
            user.dtUpdatedOn = DateTime.UtcNow;                            // Current timestamp

            // SAVE CHANGES to database
            await _context.SaveChangesAsync();

            // Return the updated user in response format
            return MapToResponseDto(user);
        }

        /// <summary>
        /// STEP 6: Delete a user permanently from database
        /// Example: DeleteUserAsync(userId)
        /// Returns true if deleted, false if user not found
        /// </summary>
        public async Task<bool> DeleteUserAsync(Guid userId)
        {
            // Find the user to delete
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                // User not found, return false
                return false;
            }

            // REMOVE from database and save changes
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            // Return true to indicate successful deletion
            return true;
        }

        /// <summary>
        /// STEP 7: Verify a user's password during login
        /// Takes the plain password they entered and compares with stored hashed password
        /// Example: await VerifyPasswordAsync("admin@example.com", "ChangeMe123!")
        /// Returns true if password is correct, false if incorrect
        /// </summary>
        public async Task<bool> VerifyPasswordAsync(string email, string password)
        {
            // STEP 1: Find user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.strEmail == email);
            if (user == null)
            {
                // User not found, return false
                return false;
            }

            // STEP 2: Hash the password they provided
            var hashedPassword = HashPassword(password);
            
            // STEP 3: Compare with stored password hash
            // Return true if passwords match, false if they don't
            return user.strPassword == hashedPassword;
        }

        /// <summary>
        /// HELPER FUNCTION: Hash a password using SHA-256 algorithm
        /// Why SHA-256? Fast, one-way encryption (can't reverse it)
        /// Note: For production, consider upgrading to BCrypt or Argon2 which are slower and safer against brute-force attacks
        /// Example: HashPassword("MyPassword123") → "A7F3B4C8D9E..." (hexadecimal hash)
        /// </summary>
        private static string HashPassword(string password)
        {
            // STEP 1: Create SHA-256 hasher
            using var sha256 = SHA256.Create();
            
            // STEP 2: Convert password string to bytes and hash them
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            
            // STEP 3: Convert bytes to readable text format (hexadecimal: 0-9, A-F)
            var builder = new StringBuilder();
            foreach (var b in hashedBytes)
            {
                builder.Append(b.ToString("x2")); // x2 = hexadecimal format
            }
            
            // STEP 4: Return the hashed password
            return builder.ToString();
        }

        /// <summary>
        /// HELPER FUNCTION: Convert User object to UserResponseDto (safe response format)
        /// Why? Remove sensitive data (like password hash) before sending to frontend
        /// Only returns non-sensitive fields that are safe to display to clients
        /// </summary>
        private static UserResponseDto MapToResponseDto(User user)
        {
            // CREATE RESPONSE: Include only safe, non-sensitive user information
            return new UserResponseDto
            {
                strUserGUID = user.strUserGUID,                            // User's unique ID
                strUserName = user.strUserName,                            // Full name
                strEmail = user.strEmail,                                  // Email address
                strPhoneNo = user.strPhoneNo,                              // Phone number
                dDob = user.dDob,                                          // Date of birth
                bolIsActive = user.bolIsActive,                            // Is account active?
                bolSystemCreated = user.bolSystemCreated,                  // Is this a system-created account?
                strRoleGUID = user.strRoleGUID,                            // User's role GUID
                strRoleName = user.UserRole?.strRoleName,                  // User's role name (from navigation property)
                strPreferredLanguage = user.strPreferredLanguage,          // Language preference
                strBankName = user.strBankName,
                strBankAccountNo = user.strBankAccountNo,
                strTaxBracket = user.strTaxBracket,
                strLocation = user.strLocation,
                strProfileImageUrl = user.strProfileImg,                   // Profile picture URL
                dtLastLogin = user.dtLastLogin,                            // Last login timestamp
                dtCreatedDate = user.dtCreatedOn,                          // Account creation date
                dtModifiedDate = user.dtUpdatedOn                          // Account modification date
            };
        }
    }
}
