using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.DTOs;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    /// <summary>
    /// REST API Controller for Menu Management operations
    /// All endpoints require JWT authentication via [Authorize] attribute
    /// Base route: /api/menu
    /// 
    /// IMPORTANT: All endpoints in this controller are protected and require a valid JWT token.
    /// Include token in request header: Authorization: Bearer {token}
    /// 
    /// Examples of operations:
    /// - GET /api/menu - Get all menus
    /// - GET /api/menu/123 - Get specific menu by ID
    /// - GET /api/menu/key/USER_MGMT - Get menu by map key
    /// - GET /api/menu/parent/456 - Get child menus of a parent
    /// - POST /api/menu - Create new menu item
    /// - PUT /api/menu/123 - Update menu details
    /// - DELETE /api/menu/123 - Delete menu permanently
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]  // PROTECTION: All methods require valid JWT token in Authorization header
    public class MenuController : ControllerBase
    {
        // Injected service for menu operations (CRUD)
        private readonly IMenuService _menuService;

        // Constructor: Receives MenuService dependency injection
        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        /// <summary>
        /// GET: /api/menu
        /// Get a list of all menu items in the system, ordered by sequence
        /// Returns 200 OK with list of MenuResponseDto sorted by dblSeqNo (lower number = higher priority)
        /// 
        /// Requires: JWT token with any valid role
        /// Use case: Load application menu structure
        /// Example response: 
        /// [
        ///   { strMenuGUID: "...", strMenuName: "Dashboard", dblSeqNo: 1, ... },
        ///   { strMenuGUID: "...", strMenuName: "Users", dblSeqNo: 2, ... }
        /// ]
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<object>>> GetAllMenus()
        {
            // Call service to retrieve all menus from database (ordered by sequence)
            var menus = await _menuService.GetAllMenusAsync();
            
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "Menus retrieved successfully",
                data = menus
            };
            return Ok(response);
        }

        /// <summary>
        /// GET: /api/menu/{id}
        /// Get a specific menu item by its unique GUID
        /// Returns 200 OK with MenuResponseDto, or 404 if not found
        /// 
        /// Requires: JWT token with any valid role
        /// Parameters: id = Menu's unique GUID
        /// Use case: View individual menu details for editing
        /// Example response:
        /// {
        ///   "strMenuGUID": "11111111-1111-1111-1111-111111111111",
        ///   "strMenuName": "User Management",
        ///   "strPath": "/user",
        ///   "bolIsActive": true
        /// }
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> GetMenuById(Guid id)
        {
            // Find menu by GUID
            var menu = await _menuService.GetMenuByIdAsync(id);
            
            // If menu not found, return 404 Not Found with error message
            if (menu == null)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "Menu not found",
                    data = null
                };
                return NotFound(notFound);
            }
            
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "Menu retrieved successfully",
                data = menu
            };
            return Ok(response);
        }

        /// <summary>
        /// GET: /api/menu/key/{mapKey}
        /// Get a specific menu item by its map key identifier
        /// Returns 200 OK with MenuResponseDto, or 404 if not found
        /// 
        /// Requires: JWT token with any valid role
        /// Parameters: mapKey = Menu's unique string identifier (e.g., "USER_MGMT")
        /// Use case: Look up menu by string key instead of GUID
        /// Example response: Same as GetMenuById
        /// </summary>
        [HttpGet("key/{mapKey}")]
        public async Task<ActionResult<ApiResponse<object>>> GetMenuByMapKey(string mapKey)
        {
            // Find menu by map key
            var menu = await _menuService.GetMenuByMapKeyAsync(mapKey);
            
            // If menu not found, return 404 Not Found
            if (menu == null)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "Menu not found",
                    data = null
                };
                return NotFound(notFound);
            }
            
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "Menu retrieved successfully",
                data = menu
            };
            return Ok(response);
        }

        /// <summary>
        /// GET: /api/menu/parent/{parentId}
        /// Get all child menu items for a specific parent menu
        /// Returns 200 OK with list of child MenuResponseDto items
        /// If parentId is null/empty, returns root menus (menus with no parent)
        /// 
        /// Requires: JWT token with any valid role
        /// Parameters: parentId = Parent menu's GUID (pass "null" or "00000000-0000-0000-0000-000000000000" for root menus)
        /// Use case: Build hierarchical menu tree, load submenu items
        /// Example response:
        /// [
        ///   { strMenuName: "Create User", strParentMenuGUID: "11111111-...", ... },
        ///   { strMenuName: "List Users", strParentMenuGUID: "11111111-...", ... }
        /// ]
        /// </summary>
        [HttpGet("parent/{parentId}")]
        public async Task<ActionResult<ApiResponse<object>>> GetMenusByParent(string parentId)
        {
            // Parse parent ID (handle null string)
            Guid? parentGuid = parentId == "null" || string.IsNullOrEmpty(parentId) ? null : Guid.Parse(parentId);
            
            // Find all menus with this parent
            var menus = await _menuService.GetMenusByParentAsync(parentGuid);
            
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "Menus retrieved successfully",
                data = menus
            };
            return Ok(response);
        }

        /// <summary>
        /// POST: /api/menu
        /// Create a new menu item
        /// Returns 201 Created with new MenuResponseDto, or 400 if validation fails
        /// 
        /// Requires: JWT token with admin role (typically)
        /// Request body: CreateMenuDto with strMenuName, strPath, strMapKey, etc.
        /// Use case: Admin creates new menu item in application menu system
        /// Example request:
        /// {
        ///   "strMenuName": "Dashboard",
        ///   "dblSeqNo": 1,
        ///   "strPath": "/dashboard",
        ///   "strMapKey": "DASHBOARD",
        ///   "strMenuPositions": "TOP_NAV",
        ///   "bolHasSubMenu": false,
        ///   "strIconName": "fa-dashboard"
        /// }
        /// Example response: 201 Created with MenuResponseDto
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<object>>> CreateMenu([FromBody] CreateMenuDto createMenuDto)
        {
            try
            {
                // Call service to create new menu
                var menu = await _menuService.CreateMenuAsync(createMenuDto);
                
                var response = new ApiResponse<object>
                {
                    statusCode = 201,
                    message = "Menu created successfully",
                    data = menu
                };
                return CreatedAtAction(nameof(GetMenuById), new { id = menu.strMenuGUID }, response);
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
        /// PUT: /api/menu/{id}
        /// Update an existing menu item (partial update)
        /// Returns 200 OK with updated MenuResponseDto, 404 if not found, or 400 if validation fails
        /// 
        /// Requires: JWT token (typically admin role)
        /// Parameters: id = Menu's unique GUID
        /// Request body: UpdateMenuDto with only fields to update
        /// Use case: Admin modifies menu properties, reorder menus, enable/disable menu
        /// Example request (partial update):
        /// {
        ///   "strMenuName": "User Management System",
        ///   "dblSeqNo": 2,
        ///   "bolIsActive": true
        /// }
        /// Example response: 200 OK with fully updated MenuResponseDto
        /// </summary>
        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> UpdateMenu(Guid id, [FromBody] UpdateMenuDto updateMenuDto)
        {
            try
            {
                // Call service to update menu
                // Only provided fields are updated (partial update pattern)
                var menu = await _menuService.UpdateMenuAsync(id, updateMenuDto);
                
                // If menu not found, return 404 Not Found
                if (menu == null)
                {
                    var notFound = new ApiResponse<object>
                    {
                        statusCode = 404,
                        message = "Menu not found",
                        data = null
                    };
                    return NotFound(notFound);
                }
                
                var response = new ApiResponse<object>
                {
                    statusCode = 200,
                    message = "Menu updated successfully",
                    data = menu
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
        /// DELETE: /api/menu/{id}
        /// Delete a menu item permanently from the system
        /// Returns 204 No Content if successful, or 404 if menu not found
        /// 
        /// Requires: JWT token with admin role (typically)
        /// Parameters: id = Menu's unique GUID
        /// Use case: Admin removes a menu item from application
        /// WARNING: This is permanent and cannot be undone!
        /// Consider checking for child menus before deletion
        /// Example response: 204 No Content (empty response)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteMenu(Guid id)
        {
            // Call service to delete menu from database
            var result = await _menuService.DeleteMenuAsync(id);
            
            // If menu not found, return 404 Not Found
            if (!result)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "Menu not found",
                    data = null
                };
                return NotFound(notFound);
            }
            
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "Menu deleted successfully",
                data = new { }
            };
            return Ok(response);
        }
    }
}
