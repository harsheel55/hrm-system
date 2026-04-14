using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.DTOs;

namespace Backend.Services
{
    public interface IUserService
    {
        Task<UserResponseDto?> GetUserByIdAsync(Guid userId);
        Task<UserResponseDto?> GetUserByEmailAsync(string email);
        Task<IEnumerable<UserResponseDto>> GetAllUsersAsync();
        Task<UserResponseDto> CreateUserAsync(CreateUserDto createUserDto, Guid? createdByGuid = null, string? profileImageUrl = null);
        Task<UserResponseDto?> UpdateUserAsync(Guid userId, UpdateUserDto updateUserDto, Guid? updatedByGuid = null);
        Task<bool> DeleteUserAsync(Guid userId);
        Task<bool> VerifyPasswordAsync(string email, string password);
    }
}
