using System;
using Backend.DTOs;
using Backend.Services;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BlogCategoryController : ControllerBase
    {
        private readonly IBlogCategoryService _categoryService;
        private readonly IFileUploadService _fileUploadService;
        private readonly AppDbContext _context;

        public BlogCategoryController(IBlogCategoryService categoryService, IFileUploadService fileUploadService, AppDbContext context)
        {
            _categoryService = categoryService;
            _fileUploadService = fileUploadService;
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<IEnumerable<BlogCategoryResponseDto>>>> GetAllCategories([FromQuery] bool includeInactive = false)
        {
            var categories = await _categoryService.GetAllCategoriesAsync(includeInactive);
            return Ok(new ApiResponse<IEnumerable<BlogCategoryResponseDto>>
            {
                statusCode = 200,
                message = "Categories retrieved successfully",
                data = categories
            });
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<BlogCategoryResponseDto>>> GetCategoryById(string id)
        {
            var category = await _categoryService.GetCategoryByIdAsync(id);
            
            if (category == null)
            {
                return NotFound(new ApiResponse<BlogCategoryResponseDto>
                {
                    statusCode = 404,
                    message = "Category not found",
                    data = null
                });
            }
            
            return Ok(new ApiResponse<BlogCategoryResponseDto>
            {
                statusCode = 200,
                message = "Category retrieved successfully",
                data = category
            });
        }

        [HttpGet("slug/{slug}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<BlogCategoryResponseDto>>> GetCategoryBySlug(string slug)
        {
            var category = await _categoryService.GetCategoryBySlugAsync(slug);
            
            if (category == null)
            {
                return NotFound(new ApiResponse<BlogCategoryResponseDto>
                {
                    statusCode = 404,
                    message = "Category not found",
                    data = null
                });
            }
            
            return Ok(new ApiResponse<BlogCategoryResponseDto>
            {
                statusCode = 200,
                message = "Category retrieved successfully",
                data = category
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<BlogCategoryResponseDto>>> CreateCategory([FromForm] CreateBlogCategoryDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<BlogCategoryResponseDto> 
                { 
                    statusCode = 400,
                    message = "Invalid request data",
                    data = null
                });
            }

            var userIdClaim = User.FindFirst("userId")?.Value 
                           ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiResponse<BlogCategoryResponseDto> 
                { 
                    statusCode = 401,
                    message = "User not authenticated",
                    data = null
                });
            }

            // Check if user is Super Admin
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.strUserGUID.ToString() == userIdClaim);

            if (user == null)
            {
                return Unauthorized(new ApiResponse<BlogCategoryResponseDto>
                {
                    statusCode = 401,
                    message = "User not found",
                    data = null
                });
            }

            // Get user's role
            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(r => r.strUserRoleGUID == user.strRoleGUID);

            var isSuperAdmin = IsSuperAdminRole(userRole?.strRoleName);
            if (!isSuperAdmin)
            {
                return StatusCode(403, new ApiResponse<BlogCategoryResponseDto>
                {
                    statusCode = 403,
                    message = "Only Super Admin can create blog categories",
                    data = null
                });
            }

            try
            {
                string? imagePath = null;
                if (dto.strCategoryImage != null)
                {
                    imagePath = await _fileUploadService.SaveFileAsync(dto.strCategoryImage, "blog-categories");
                }

                var category = await _categoryService.CreateCategoryAsync(dto, userIdClaim);
                
                // Update with image path if file was uploaded
                if (imagePath != null)
                {
                    category.strCategoryImage = imagePath;
                }
                
                return CreatedAtAction(nameof(GetCategoryById), new { id = category.strCategoryGUID }, new ApiResponse<BlogCategoryResponseDto>
                {
                    statusCode = 201,
                    message = "Category created successfully",
                    data = category
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<BlogCategoryResponseDto>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<BlogCategoryResponseDto>>> UpdateCategory(string id, [FromForm] UpdateBlogCategoryDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<BlogCategoryResponseDto> 
                { 
                    statusCode = 400,
                    message = "Invalid request data",
                    data = null
                });
            }

            var userIdClaim = User.FindFirst("userId")?.Value 
                           ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiResponse<BlogCategoryResponseDto> 
                { 
                    statusCode = 401,
                    message = "User not authenticated",
                    data = null
                });
            }

            // Check if user is Super Admin
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.strUserGUID.ToString() == userIdClaim);

            if (user == null)
            {
                return Unauthorized(new ApiResponse<BlogCategoryResponseDto>
                {
                    statusCode = 401,
                    message = "User not found",
                    data = null
                });
            }

            // Get user's role
            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(r => r.strUserRoleGUID == user.strRoleGUID);

            var isSuperAdmin = IsSuperAdminRole(userRole?.strRoleName);
            if (!isSuperAdmin)
            {
                return StatusCode(403, new ApiResponse<BlogCategoryResponseDto>
                {
                    statusCode = 403,
                    message = "Only Super Admin can update blog categories",
                    data = null
                });
            }

            try
            {
                string? imagePath = null;
                if (dto.strCategoryImage != null)
                {
                    imagePath = await _fileUploadService.SaveFileAsync(dto.strCategoryImage, "blog-categories");
                }

                var category = await _categoryService.UpdateCategoryAsync(id, dto, userIdClaim);
                
                if (category == null)
                {
                    return NotFound(new ApiResponse<BlogCategoryResponseDto>
                    {
                        statusCode = 404,
                        message = "Category not found",
                        data = null
                    });
                }

                // Update with image path if file was uploaded
                if (imagePath != null)
                {
                    category.strCategoryImage = imagePath;
                }
                
                return Ok(new ApiResponse<BlogCategoryResponseDto>
                {
                    statusCode = 200,
                    message = "Category updated successfully",
                    data = category
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<BlogCategoryResponseDto>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteCategory(string id)
        {
            var userIdClaim = User.FindFirst("userId")?.Value 
                           ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new ApiResponse<bool> 
                { 
                    statusCode = 401,
                    message = "User not authenticated",
                    data = false
                });
            }

            // Check if user is Super Admin
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.strUserGUID.ToString() == userIdClaim);

            if (user == null)
            {
                return Unauthorized(new ApiResponse<bool>
                {
                    statusCode = 401,
                    message = "User not found",
                    data = false
                });
            }

            // Get user's role
            var userRole = await _context.UserRoles
                .FirstOrDefaultAsync(r => r.strUserRoleGUID == user.strRoleGUID);

            var isSuperAdmin = IsSuperAdminRole(userRole?.strRoleName);
            if (!isSuperAdmin)
            {
                return StatusCode(403, new ApiResponse<bool>
                {
                    statusCode = 403,
                    message = "Only Super Admin can delete blog categories",
                    data = false
                });
            }

            try
            {
                var success = await _categoryService.DeleteCategoryAsync(id);
                
                if (!success)
                {
                    return NotFound(new ApiResponse<bool>
                    {
                        statusCode = 404,
                        message = "Category not found",
                        data = false
                    });
                }
                
                return Ok(new ApiResponse<bool>
                {
                    statusCode = 200,
                    message = "Category deleted successfully",
                    data = true
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<bool>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = false
                });
            }
        }

        private static bool IsSuperAdminRole(string? roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return false;
            }

            // Normalize to handle both "SuperAdmin" and "Super Admin" role names
            var normalized = roleName.Replace(" ", string.Empty, StringComparison.OrdinalIgnoreCase);
            return string.Equals(normalized, "SuperAdmin", StringComparison.OrdinalIgnoreCase);
        }
    }
}
