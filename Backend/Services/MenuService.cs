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
    /// Service to manage Menu items (Create, Read, Update, Delete)
    /// Handles hierarchical menu structure with parent-child relationships
    /// Supports menu sequencing, activation status, and audit trails
    /// </summary>
    public class MenuService : IMenuService
    {
        // Database connection to access Menus table (mstMenu)
        private readonly AppDbContext _context;

        // Constructor: Receives database connection when service is created
        public MenuService(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// STEP 1: Get a specific menu item by its unique ID (GUID)
        /// Example: GetMenuByIdAsync(new Guid("..."))
        /// Returns null if menu not found
        /// </summary>
        public async Task<MenuResponseDto?> GetMenuByIdAsync(Guid menuId)
        {
            // Search database for menu with this ID
            var menu = await _context.Menus.FindAsync(menuId);
            
            // If not found, return null. Otherwise, convert to response format
            return menu == null ? null : MapToResponseDto(menu);
        }

        /// <summary>
        /// STEP 2: Get a specific menu by its map key identifier
        /// Example: GetMenuByMapKeyAsync("USER_MGMT")
        /// Map key is a unique string identifier for menu lookups
        /// Returns null if not found
        /// </summary>
        public async Task<MenuResponseDto?> GetMenuByMapKeyAsync(string mapKey)
        {
            // Search database for menu with this map key
            var menu = await _context.Menus.FirstOrDefaultAsync(m => m.strMapKey == mapKey);
            
            // If not found, return null. Otherwise, convert to response format
            return menu == null ? null : MapToResponseDto(menu);
        }

        /// <summary>
        /// STEP 3: Get all menus from database
        /// Returns a list of all menu items (including parent and child menus)
        /// </summary>
        public async Task<IEnumerable<MenuResponseDto>> GetAllMenusAsync()
        {
            // Get all menus from database, ordered by sequence (dblSeqNo)
            // Lower sequence numbers appear first in the menu
            var menus = await _context.Menus
                .OrderBy(m => m.dblSeqNo)
                .ToListAsync();
            
            // Convert each menu to response format and return
            return menus.Select(MapToResponseDto);
        }

        /// <summary>
        /// STEP 4: Get all child menus for a specific parent
        /// Example: GetMenusByParentAsync(parentGuid) returns all submenu items
        /// If parentMenuId is null, returns only root menus (those with no parent)
        /// </summary>
        public async Task<IEnumerable<MenuResponseDto>> GetMenusByParentAsync(Guid? parentMenuId)
        {
            // Find all menus that have the specified parent GUID
            var menus = await _context.Menus
                .Where(m => m.strParentMenuGUID == parentMenuId)
                .OrderBy(m => m.dblSeqNo)
                .ToListAsync();
            
            // Convert each menu to response format and return
            return menus.Select(MapToResponseDto);
        }

        /// <summary>
        /// STEP 5: Create a new menu item
        /// Example: CreateMenuAsync(new CreateMenuDto { strMenuName = "Dashboard", strPath = "/dashboard" })
        /// </summary>
        public async Task<MenuResponseDto> CreateMenuAsync(CreateMenuDto createMenuDto, Guid? createdByGuid = null)
        {
            var auditCreatedBy = createdByGuid ?? SystemConstants.SYSTEM_USER_GUID;

            // VALIDATION: Check if map key already exists - prevent duplicate map keys
            var existingMenu = await _context.Menus.FirstOrDefaultAsync(m => m.strMapKey == createMenuDto.strMapKey);
            if (existingMenu != null)
            {
                // Stop and throw error - this map key is already used
                throw new InvalidOperationException("Menu with this map key already exists.");
            }

            // CREATE NEW MENU: Build the menu object with all required fields
            var menu = new Menu
            {
                strMenuGUID = Guid.NewGuid(),                              // Generate unique ID automatically
                strParentMenuGUID = createMenuDto.strParentMenuGUID,       // Parent menu (null if root)
                strMenuName = createMenuDto.strMenuName,                   // Menu display name
                dblSeqNo = createMenuDto.dblSeqNo,                         // Sequence for ordering
                strPath = createMenuDto.strPath,                           // Navigation path
                strMapKey = createMenuDto.strMapKey,                       // Unique map identifier
                strMenuPositions = createMenuDto.strMenuPositions,         // Menu position (TOP_NAV, SIDEBAR, etc.)
                bolHasSubMenu = createMenuDto.bolHasSubMenu,               // Does it have children?
                strIconName = createMenuDto.strIconName,                   // Icon for UI display
                bolIsActive = true,                                        // New menus are active by default
                strCreatedByGUID = auditCreatedBy,                         // Who created this menu
                dtCreatedOn = DateTime.UtcNow,                             // Timestamp: when created
                dtUpdateOn = DateTime.UtcNow,                              // Timestamp: when last updated
                strUpdatedByGUID = auditCreatedBy                          // Initial update actor
            };

            // SAVE TO DATABASE: Add menu and save all changes
            _context.Menus.Add(menu);
            await _context.SaveChangesAsync();

            // Return the newly created menu in response format
            return MapToResponseDto(menu);
        }

        /// <summary>
        /// STEP 6: Update an existing menu item (partial update)
        /// Only updates fields that are provided
        /// Example: UpdateMenuAsync(menuId, new UpdateMenuDto { strMenuName = "New Name" })
        /// </summary>
        public async Task<MenuResponseDto?> UpdateMenuAsync(Guid menuId, UpdateMenuDto updateMenuDto, Guid? updatedByGuid = null)
        {
            var auditUpdatedBy = updatedByGuid ?? SystemConstants.SYSTEM_USER_GUID;

            // Find the menu to update
            var menu = await _context.Menus.FindAsync(menuId);
            if (menu == null)
            {
                // Menu not found, return null
                return null;
            }

            // UPDATE PARENT MENU (if provided)
            if (updateMenuDto.strParentMenuGUID != null)
                menu.strParentMenuGUID = updateMenuDto.strParentMenuGUID;

            // UPDATE MENU NAME (if provided)
            if (!string.IsNullOrEmpty(updateMenuDto.strMenuName))
                menu.strMenuName = updateMenuDto.strMenuName;

            // UPDATE SEQUENCE NUMBER (if provided - for reordering)
            if (updateMenuDto.dblSeqNo.HasValue)
                menu.dblSeqNo = updateMenuDto.dblSeqNo.Value;

            // UPDATE PATH (if provided - navigation route)
            if (!string.IsNullOrEmpty(updateMenuDto.strPath))
                menu.strPath = updateMenuDto.strPath;

            // UPDATE MAP KEY (if provided)
            if (!string.IsNullOrEmpty(updateMenuDto.strMapKey))
            {
                // VALIDATION: Check if new map key is not already used by another menu
                var existingMenu = await _context.Menus.FirstOrDefaultAsync(m => m.strMapKey == updateMenuDto.strMapKey && m.strMenuGUID != menuId);
                if (existingMenu != null)
                {
                    // Stop and throw error - another menu already has this map key
                    throw new InvalidOperationException("Map key already in use by another menu.");
                }
                menu.strMapKey = updateMenuDto.strMapKey;
            }

            // UPDATE MENU POSITION (if provided - TOP_NAV, SIDEBAR, etc.)
            if (!string.IsNullOrEmpty(updateMenuDto.strMenuPositions))
                menu.strMenuPositions = updateMenuDto.strMenuPositions;

            // UPDATE SUBMENU FLAG (if provided)
            if (updateMenuDto.bolHasSubMenu.HasValue)
                menu.bolHasSubMenu = updateMenuDto.bolHasSubMenu.Value;

            // UPDATE ICON (if provided - UI icon identifier)
            if (!string.IsNullOrEmpty(updateMenuDto.strIconName))
                menu.strIconName = updateMenuDto.strIconName;

            // UPDATE ACTIVE STATUS (if provided - enable/disable menu)
            if (updateMenuDto.bolIsActive.HasValue)
                menu.bolIsActive = updateMenuDto.bolIsActive.Value;

            // UPDATE METADATA: Who updated it and when
            menu.strUpdatedByGUID = auditUpdatedBy;                        // Admin who made the change
            menu.dtUpdateOn = DateTime.UtcNow;                             // Current timestamp

            // SAVE CHANGES to database
            await _context.SaveChangesAsync();

            // Return the updated menu in response format
            return MapToResponseDto(menu);
        }

        /// <summary>
        /// STEP 7: Delete a menu item permanently from database
        /// Example: DeleteMenuAsync(menuId)
        /// Returns true if deleted, false if menu not found
        /// </summary>
        public async Task<bool> DeleteMenuAsync(Guid menuId)
        {
            // Find the menu to delete
            var menu = await _context.Menus.FindAsync(menuId);
            if (menu == null)
            {
                // Menu not found, return false
                return false;
            }

            // REMOVE from database and save changes
            _context.Menus.Remove(menu);
            await _context.SaveChangesAsync();

            // Return true to indicate successful deletion
            return true;
        }

        /// <summary>
        /// HELPER FUNCTION: Convert Menu object to MenuResponseDto (safe response format)
        /// Why? Return all readable fields in consistent format
        /// </summary>
        private static MenuResponseDto MapToResponseDto(Menu menu)
        {
            // CREATE RESPONSE: Include all menu information
            return new MenuResponseDto
            {
                strMenuGUID = menu.strMenuGUID,                            // Menu's unique ID
                strParentMenuGUID = menu.strParentMenuGUID,                // Parent menu (if exists)
                strMenuName = menu.strMenuName,                            // Menu display name
                dblSeqNo = menu.dblSeqNo,                                  // Sequence order
                strPath = menu.strPath,                                    // Navigation path
                strMapKey = menu.strMapKey,                                // Map key identifier
                strMenuPositions = menu.strMenuPositions,                  // Menu position
                bolHasSubMenu = menu.bolHasSubMenu,                        // Has submenu?
                strIconName = menu.strIconName,                            // Icon name
                bolIsActive = menu.bolIsActive,                            // Is active?
                strCreatedByGUID = menu.strCreatedByGUID,                  // Created by
                dtCreatedOn = menu.dtCreatedOn,                            // Created on
                strUpdatedByGUID = menu.strUpdatedByGUID,                  // Updated by
                dtUpdateOn = menu.dtUpdateOn                               // Updated on
            };
        }
    }
}
