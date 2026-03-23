using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BlogController : ControllerBase
    {
        private readonly IBlogService _blogService;
        private readonly IFileUploadService _fileUploadService;

        public BlogController(IBlogService blogService, IFileUploadService fileUploadService)
        {
            _blogService = blogService;
            _fileUploadService = fileUploadService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<BlogResponseDto>>>> GetAllBlogs([FromQuery] bool includeInactive = false)
        {
            var blogs = await _blogService.GetAllBlogsAsync(includeInactive);
            return Ok(new ApiResponse<IEnumerable<BlogResponseDto>>
            {
                statusCode = 200,
                message = "Blogs retrieved successfully",
                data = blogs
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<BlogResponseDto>>> GetBlogById(string id)
        {
            var blog = await _blogService.GetBlogByIdAsync(id);
            
            if (blog == null)
            {
                return NotFound(new ApiResponse<BlogResponseDto>
                {
                    statusCode = 404,
                    message = "Blog not found",
                    data = null
                });
            }
            
            return Ok(new ApiResponse<BlogResponseDto>
            {
                statusCode = 200,
                message = "Blog retrieved successfully",
                data = blog
            });
        }

        [HttpGet("slug/{slug}")]
        public async Task<ActionResult<ApiResponse<BlogResponseDto>>> GetBlogBySlug(string slug)
        {
            var blog = await _blogService.GetBlogBySlugAsync(slug);
            
            if (blog == null)
            {
                return NotFound(new ApiResponse<BlogResponseDto>
                {
                    statusCode = 404,
                    message = "Blog not found",
                    data = null
                });
            }
            
            return Ok(new ApiResponse<BlogResponseDto>
            {
                statusCode = 200,
                message = "Blog retrieved successfully",
                data = blog
            });
        }

        [HttpGet("published")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<IEnumerable<BlogResponseDto>>>> GetPublishedBlogs()
        {
            var blogs = await _blogService.GetPublishedBlogsAsync();
            return Ok(new ApiResponse<IEnumerable<BlogResponseDto>>
            {
                statusCode = 200,
                message = "Published blogs retrieved successfully",
                data = blogs
            });
        }

        [HttpGet("featured")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<IEnumerable<BlogResponseDto>>>> GetFeaturedBlogs()
        {
            var blogs = await _blogService.GetFeaturedBlogsAsync();
            return Ok(new ApiResponse<IEnumerable<BlogResponseDto>>
            {
                statusCode = 200,
                message = "Featured blogs retrieved successfully",
                data = blogs
            });
        }

        [HttpGet("category/{categoryGuid}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<BlogResponseDto>>>> GetBlogsByCategory(string categoryGuid)
        {
            var blogs = await _blogService.GetBlogsByCategoryAsync(categoryGuid);
            return Ok(new ApiResponse<IEnumerable<BlogResponseDto>>
            {
                statusCode = 200,
                message = "Blogs by category retrieved successfully",
                data = blogs
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<BlogResponseDto>>> CreateBlog([FromForm] CreateBlogDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<BlogResponseDto> 
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
                return Unauthorized(new ApiResponse<BlogResponseDto> 
                { 
                    statusCode = 401,
                    message = "User not authenticated",
                    data = null
                });
            }

            try
            {
                string? imagePath = null;
                if (dto.strFeaturedImage != null)
                {
                    imagePath = await _fileUploadService.SaveFileAsync(dto.strFeaturedImage, "blog-featured");
                }

                var blog = await _blogService.CreateBlogAsync(dto, userIdClaim);
                
                // Update with image path if file was uploaded
                if (imagePath != null)
                {
                    blog.strFeaturedImage = imagePath;
                }

                return CreatedAtAction(nameof(GetBlogById), new { id = blog.strBlogGUID }, 
                    new ApiResponse<BlogResponseDto>
                    {
                        statusCode = 201,
                        message = "Blog created successfully",
                        data = blog
                    });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<BlogResponseDto>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<BlogResponseDto>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<BlogResponseDto>>> UpdateBlog(string id, [FromForm] UpdateBlogDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<BlogResponseDto> 
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
                return Unauthorized(new ApiResponse<BlogResponseDto> 
                { 
                    statusCode = 401,
                    message = "User not authenticated",
                    data = null
                });
            }

            try
            {
                string? imagePath = null;
                if (dto.strFeaturedImage != null)
                {
                    imagePath = await _fileUploadService.SaveFileAsync(dto.strFeaturedImage, "blog-featured");
                }

                var blog = await _blogService.UpdateBlogAsync(id, dto, userIdClaim);
                
                if (blog == null)
                {
                    return NotFound(new ApiResponse<BlogResponseDto>
                    {
                        statusCode = 404,
                        message = "Blog not found",
                        data = null
                    });
                }

                // Update with image path if file was uploaded
                if (imagePath != null)
                {
                    blog.strFeaturedImage = imagePath;
                }
                
                return Ok(new ApiResponse<BlogResponseDto>
                {
                    statusCode = 200,
                    message = "Blog updated successfully",
                    data = blog
                });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new ApiResponse<BlogResponseDto>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<BlogResponseDto>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteBlog(string id)
        {
            var success = await _blogService.DeleteBlogAsync(id);
            
            if (!success)
            {
                return NotFound(new ApiResponse<bool>
                {
                    statusCode = 404,
                    message = "Blog not found",
                    data = false
                });
            }
            
            return Ok(new ApiResponse<bool>
            {
                statusCode = 200,
                message = "Blog deleted successfully",
                data = true
            });
        }
    }
}
