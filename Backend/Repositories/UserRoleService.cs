    using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class UserRoleService : IUserRoleService
    {
        private static readonly HashSet<string> AllowedRoles = new(StringComparer.OrdinalIgnoreCase)
        {
            "HR",
            "Employee"
        };

        private readonly AppDbContext _context;

        public UserRoleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserRoleResponseDto?> GetRoleByIdAsync(Guid roleId)
        {
            var role = await _context.UserRoles
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.strUserRoleGUID == roleId && AllowedRoles.Contains(r.strRoleName));

            return role == null ? null : Map(role);
        }

        public async Task<UserRoleResponseDto?> GetRoleByNameAsync(string roleName)
        {
            var role = await _context.UserRoles
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.strRoleName == roleName && AllowedRoles.Contains(r.strRoleName));

            return role == null ? null : Map(role);
        }

        public async Task<IEnumerable<UserRoleResponseDto>> GetAllRolesAsync()
        {
            var roles = await _context.UserRoles
                .AsNoTracking()
                .Where(r => r.bolIsActive && AllowedRoles.Contains(r.strRoleName))
                .ToListAsync();

            return roles
                .GroupBy(r => r.strRoleName.Trim(), StringComparer.OrdinalIgnoreCase)
                .Select(g => g
                    .OrderByDescending(r => r.bolSystemCreated)
                    .ThenByDescending(r => r.dtUpdatedOn)
                    .First())
                .OrderBy(r => r.strRoleName)
                .Select(Map);
        }

        public Task<UserRoleResponseDto> CreateRoleAsync(CreateUserRoleDto createRoleDto, Guid? createdByGuid = null)
        {
            throw new InvalidOperationException("Roles are fixed. Only HR and Employee roles are allowed.");
        }

        public Task<UserRoleResponseDto?> UpdateRoleAsync(Guid roleId, UpdateUserRoleDto updateRoleDto, Guid? updatedByGuid = null)
        {
            throw new InvalidOperationException("Roles are fixed. Only HR and Employee roles are allowed.");
        }

        public Task<bool> DeleteRoleAsync(Guid roleId)
        {
            throw new InvalidOperationException("Roles are fixed. Only HR and Employee roles are allowed.");
        }

        private static UserRoleResponseDto Map(UserRole role)
        {
            return new UserRoleResponseDto
            {
                strUserRoleGUID = role.strUserRoleGUID,
                strRoleName = role.strRoleName,
                strDescription = role.strDesc,
                bolIsActive = role.bolIsActive,
                bolSystemCreated = role.bolSystemCreated,
                dtCreatedDate = role.dtCreatedOn.ToString("o"),
                dtModifiedDate = role.dtUpdatedOn.ToString("o")
            };
        }
    }
}
