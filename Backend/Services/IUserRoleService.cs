using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.DTOs;

namespace Backend.Services
{
    public interface IUserRoleService
    {
        Task<UserRoleResponseDto?> GetRoleByIdAsync(Guid roleId);
        Task<UserRoleResponseDto?> GetRoleByNameAsync(string roleName);
        Task<IEnumerable<UserRoleResponseDto>> GetAllRolesAsync();
        Task<UserRoleResponseDto> CreateRoleAsync(CreateUserRoleDto createRoleDto, Guid? createdByGuid = null);
        Task<UserRoleResponseDto?> UpdateRoleAsync(Guid roleId, UpdateUserRoleDto updateRoleDto, Guid? updatedByGuid = null);
        Task<bool> DeleteRoleAsync(Guid roleId);
    }
}
