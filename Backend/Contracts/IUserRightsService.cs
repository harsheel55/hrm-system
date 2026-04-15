using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.DTOs;

namespace Backend.Services
{
    /// <summary>
    /// Interface for managing user rights (per-role menu permissions).
    /// Simplified version inspired by Pristine's IUserRightsService.
    /// </summary>
    public interface IUserRightsService
    {
        Task<UserRightResponseDto?> GetByIdAsync(Guid userRightId);
        Task<IEnumerable<UserRightResponseDto>> GetByRoleAsync(Guid roleId);
        Task<UserRightResponseDto> CreateAsync(CreateUserRightDto dto, Guid? actorId = null);
        Task<UserRightResponseDto?> UpdateAsync(Guid userRightId, CreateUserRightDto dto, Guid? actorId = null);
        Task<bool> DeleteAsync(Guid userRightId);
    }
}

