using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BlogTagController : ControllerBase
    {
        private readonly IBlogTagService _tagService;

        public BlogTagController(IBlogTagService tagService)
        {
            _tagService = tagService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<IEnumerable<BlogTagResponseDto>>>> GetAllTags([FromQuery] bool includeInactive = false)
        {
            var tags = await _tagService.GetAllTagsAsync(includeInactive);
            return Ok(new ApiResponse<IEnumerable<BlogTagResponseDto>>
            {
                statusCode = 200,
                message = "Tags retrieved successfully",
                data = tags
            });
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<BlogTagResponseDto>>> GetTagById(string id)
        {
            var tag = await _tagService.GetTagByIdAsync(id);
            
            if (tag == null)
            {
                return NotFound(new ApiResponse<BlogTagResponseDto>
                {
                    statusCode = 404,
                    message = "Tag not found",
                    data = null
                });
            }
            
            return Ok(new ApiResponse<BlogTagResponseDto>
            {
                statusCode = 200,
                message = "Tag retrieved successfully",
                data = tag
            });
        }

        [HttpGet("slug/{slug}")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<BlogTagResponseDto>>> GetTagBySlug(string slug)
        {
            var tag = await _tagService.GetTagBySlugAsync(slug);
            
            if (tag == null)
            {
                return NotFound(new ApiResponse<BlogTagResponseDto>
                {
                    statusCode = 404,
                    message = "Tag not found",
                    data = null
                });
            }
            
            return Ok(new ApiResponse<BlogTagResponseDto>
            {
                statusCode = 200,
                message = "Tag retrieved successfully",
                data = tag
            });
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<BlogTagResponseDto>>> CreateTag([FromBody] CreateBlogTagDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<BlogTagResponseDto> 
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
                return Unauthorized(new ApiResponse<BlogTagResponseDto> 
                { 
                    statusCode = 401,
                    message = "User not authenticated",
                    data = null
                });
            }

            try
            {
                var tag = await _tagService.CreateTagAsync(dto, userIdClaim);
                return CreatedAtAction(nameof(GetTagById), new { id = tag.strTagGUID }, 
                    new ApiResponse<BlogTagResponseDto>
                    {
                        statusCode = 201,
                        message = "Tag created successfully",
                        data = tag
                    });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<BlogTagResponseDto>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<BlogTagResponseDto>>> UpdateTag(string id, [FromBody] UpdateBlogTagDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new ApiResponse<BlogTagResponseDto> 
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
                return Unauthorized(new ApiResponse<BlogTagResponseDto> 
                { 
                    statusCode = 401,
                    message = "User not authenticated",
                    data = null
                });
            }

            try
            {
                var tag = await _tagService.UpdateTagAsync(id, dto, userIdClaim);
                
                if (tag == null)
                {
                    return NotFound(new ApiResponse<BlogTagResponseDto>
                    {
                        statusCode = 404,
                        message = "Tag not found",
                        data = null
                    });
                }
                
                return Ok(new ApiResponse<BlogTagResponseDto>
                {
                    statusCode = 200,
                    message = "Tag updated successfully",
                    data = tag
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new ApiResponse<BlogTagResponseDto>
                {
                    statusCode = 400,
                    message = ex.Message,
                    data = null
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteTag(string id)
        {
            var success = await _tagService.DeleteTagAsync(id);
            
            if (!success)
            {
                return NotFound(new ApiResponse<bool>
                {
                    statusCode = 404,
                    message = "Tag not found",
                    data = false
                });
            }
            
            return Ok(new ApiResponse<bool>
            {
                statusCode = 200,
                message = "Tag deleted successfully",
                data = true
            });
        }
    }
}
