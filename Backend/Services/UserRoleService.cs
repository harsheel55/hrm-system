using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Common;
using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    /// <summary>
    /// Service to manage User Roles (Admin, User, Manager, etc.)
    /// Handles Create, Read, Update, Delete operations for roles
    /// </summary>
    public class UserRoleService : IUserRoleService
    {
        // Database connection to access UserRoles table
        private readonly AppDbContext _context;

        // Constructor: Receives database connection when service is created
        public UserRoleService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// STEP 1: Get a specific role by its unique ID
        /// Example: GetRoleByIdAsync("123e4567-e89b-12d3-a456-426614174000")
        /// </summary>
        public async Task<UserRoleResponseDto?> GetRoleByIdAsync(Guid roleId)
        {
            // Search database for role with this ID
            var role = await _context.UserRoles.FindAsync(roleId);
            
            // If not found, return null. Otherwise, convert to response format
            if (role == null)
                return null;

            return new UserRoleResponseDto
            {
                strUserRoleGUID = role.strUserRoleGUID,
                strRoleName = role.strRoleName,
                strDesc = role.strDesc,
                bolIsActive = role.bolIsActive,
                bolSystemCreated = role.bolSystemCreated,
                dtCreatedOn = role.dtCreatedOn,
                dtUpdatedOn = role.dtUpdatedOn
            };
        }

        /// <summary>
        /// STEP 2: Get a specific role by its name
        /// Example: GetRoleByNameAsync("Admin")
        /// </summary>
        public async Task<UserRoleResponseDto?> GetRoleByNameAsync(string roleName)
        {
            // Search database for role with this name
            var role = await _context.UserRoles.FirstOrDefaultAsync(r => r.strRoleName == roleName);
            
            // If not found, return null. Otherwise, convert to response format
            if (role == null)
                return null;

            return new UserRoleResponseDto
            {
                strUserRoleGUID = role.strUserRoleGUID,
                strRoleName = role.strRoleName,
                strDesc = role.strDesc,
                bolIsActive = role.bolIsActive,
                bolSystemCreated = role.bolSystemCreated,
                dtCreatedOn = role.dtCreatedOn,
                dtUpdatedOn = role.dtUpdatedOn
            };
        }

        /// <summary>
        /// STEP 3: Get all roles from database
        /// Returns a list of all available roles
        /// </summary>
        public async Task<IEnumerable<UserRoleResponseDto>> GetAllRolesAsync()
        {
            // Get all roles from database
            var roles = await _context.UserRoles.ToListAsync();
            
            // Convert each role to response format and return the list
            return roles.Select(role => new UserRoleResponseDto
            {
                strUserRoleGUID = role.strUserRoleGUID,
                strRoleName = role.strRoleName,
                strDesc = role.strDesc,
                bolIsActive = role.bolIsActive,
                bolSystemCreated = role.bolSystemCreated,
                dtCreatedOn = role.dtCreatedOn,
                dtUpdatedOn = role.dtUpdatedOn
            });
        }

        /// <summary>
        /// STEP 4: Create a new role
        /// Example: CreateRoleAsync(new CreateUserRoleDto { strRoleName = "Manager", strDesc = "Department Manager" })
        /// </summary>
        public async Task<UserRoleResponseDto> CreateRoleAsync(CreateUserRoleDto createRoleDto, Guid? createdByGuid = null)
        {
            var auditCreatedBy = createdByGuid ?? SystemConstants.SYSTEM_USER_GUID;

            // VALIDATION: Check if role name already exists
            var existingRole = await _context.UserRoles.FirstOrDefaultAsync(r => r.strRoleName == createRoleDto.strRoleName);
            if (existingRole != null)
            {
                // Stop and throw error - duplicate role names not allowed
                throw new InvalidOperationException("Role with this name already exists.");
            }

            // CREATE NEW ROLE: Build the role object with all required fields
            var role = new UserRole
            {
                strUserRoleGUID = Guid.NewGuid(),              // Generate unique ID automatically
                strRoleName = createRoleDto.strRoleName,        // Role name (e.g., "Admin")
                strDesc = createRoleDto.strDesc,                // Description (e.g., "System Administrator")
                bolIsActive = true,                             // New roles are active by default
                bolSystemCreated = false,                       // User-created roles (not system roles)
                strCreatedByGUID = auditCreatedBy,              // Who created this role (default to system)
                dtCreatedOn = DateTime.UtcNow,                  // Timestamp: when created
                dtUpdatedOn = DateTime.UtcNow,                  // Timestamp: when last updated
                strUpdatedByGUID = auditCreatedBy               // Initial update actor
            };

            // SAVE TO DATABASE: Add role and save changes
            _context.UserRoles.Add(role);
            await _context.SaveChangesAsync();

            // Return the newly created role in response format
            return new UserRoleResponseDto
            {
                strUserRoleGUID = role.strUserRoleGUID,
                strRoleName = role.strRoleName,
                strDesc = role.strDesc,
                bolIsActive = role.bolIsActive,
                bolSystemCreated = role.bolSystemCreated,
                dtCreatedOn = role.dtCreatedOn,
                dtUpdatedOn = role.dtUpdatedOn
            };
        }

        /// <summary>
        /// STEP 5: Update an existing role
        /// Only updates fields that are provided (partial update)
        /// Example: UpdateRoleAsync(roleId, new UpdateUserRoleDto { strRoleName = "Super Admin" })
        /// </summary>
        public async Task<UserRoleResponseDto?> UpdateRoleAsync(Guid roleId, UpdateUserRoleDto updateRoleDto, Guid? updatedByGuid = null)
        {
            var auditUpdatedBy = updatedByGuid ?? SystemConstants.SYSTEM_USER_GUID;

            // Find the role to update
            var role = await _context.UserRoles.FindAsync(roleId);
            if (role == null)
            {
                // Role not found, return null
                return null;
            }

            // UPDATE ROLE NAME (if provided)
            if (!string.IsNullOrEmpty(updateRoleDto.strRoleName))
            {
                // VALIDATION: Check if new name is already used by another role
                var existingRole = await _context.UserRoles.FirstOrDefaultAsync(r => r.strRoleName == updateRoleDto.strRoleName && r.strUserRoleGUID != roleId);
                if (existingRole != null)
                {
                    // Stop and throw error - another role already has this name
                    throw new InvalidOperationException("Role name already in use by another role.");
                }
                role.strRoleName = updateRoleDto.strRoleName;
            }

            // UPDATE DESCRIPTION (if provided)
            if (!string.IsNullOrEmpty(updateRoleDto.strDesc))
                role.strDesc = updateRoleDto.strDesc;

            // UPDATE ACTIVE STATUS (if provided)
            if (updateRoleDto.bolIsActive.HasValue)
                role.bolIsActive = updateRoleDto.bolIsActive.Value;

            // UPDATE METADATA: Who updated it and when
            role.strUpdatedByGUID = auditUpdatedBy;
            role.dtUpdatedOn = DateTime.UtcNow;

            // SAVE CHANGES to database
            await _context.SaveChangesAsync();

            // Return the updated role
            return new UserRoleResponseDto
            {
                strUserRoleGUID = role.strUserRoleGUID,
                strRoleName = role.strRoleName,
                strDesc = role.strDesc,
                bolIsActive = role.bolIsActive,
                bolSystemCreated = role.bolSystemCreated,
                dtCreatedOn = role.dtCreatedOn,
                dtUpdatedOn = role.dtUpdatedOn
            };
        }

        /// <summary>
        /// STEP 6: Delete a role permanently from database
        /// Example: DeleteRoleAsync(roleId)
        /// Returns true if deleted, false if role not found
        /// </summary>
        public async Task<bool> DeleteRoleAsync(Guid roleId)
        {
            // Find the role to delete
            var role = await _context.UserRoles.FindAsync(roleId);
            if (role == null)
            {
                // Role not found, return false
                return false;
            }

            // REMOVE from database and save changes
            _context.UserRoles.Remove(role);
            await _context.SaveChangesAsync();

            // Return true to indicate successful deletion
            return true;
        }
    }
}
