using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.DTOs;

namespace Backend.Services
{
    /// <summary>
    /// Interface for Menu service operations
    /// Defines contract for menu CRUD operations
    /// </summary>
    public interface IMenuService
    {
        // Retrieve menu by ID
        Task<MenuResponseDto?> GetMenuByIdAsync(Guid menuId);

        // Retrieve menu by map key
        Task<MenuResponseDto?> GetMenuByMapKeyAsync(string mapKey);

        // Retrieve all menus
        Task<IEnumerable<MenuResponseDto>> GetAllMenusAsync();

        // Retrieve menus by parent (child menus)
        Task<IEnumerable<MenuResponseDto>> GetMenusByParentAsync(Guid? parentMenuId);

        // Create new menu
        Task<MenuResponseDto> CreateMenuAsync(CreateMenuDto createMenuDto, Guid? createdByGuid = null);

        // Update existing menu
        Task<MenuResponseDto?> UpdateMenuAsync(Guid menuId, UpdateMenuDto updateMenuDto, Guid? updatedByGuid = null);

        // Delete menu
        Task<bool> DeleteMenuAsync(Guid menuId);
    }
}
