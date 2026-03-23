using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.DTOs;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    /// <summary>
    /// REST API controller for managing user rights (role-based menu permissions).
    /// Base route: /api/userrights
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserRightsController : ControllerBase
    {
        private readonly IUserRightsService _userRightsService;

        public UserRightsController(IUserRightsService userRightsService)
        {
            _userRightsService = userRightsService;
        }

        /// <summary>
        /// GET: /api/userrights/{id}
        /// Get a specific user right record by its GUID.
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ApiResponse<object>>> GetById(Guid id)
        {
            var right = await _userRightsService.GetByIdAsync(id);
            if (right == null)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "User right not found",
                    data = null
                };
                return NotFound(notFound);
            }

            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "User right retrieved successfully",
                data = right
            };
            return Ok(response);
        }

        /// <summary>
        /// GET: /api/userrights/role/{roleId}
        /// Get all user rights for a specific role.
        /// </summary>
        [HttpGet("role/{roleId:guid}")]
        public async Task<ActionResult<ApiResponse<object>>> GetByRole(Guid roleId)
        {
            var rights = await _userRightsService.GetByRoleAsync(roleId);
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "User rights retrieved successfully",
                data = rights
            };
            return Ok(response);
        }

        /// <summary>
        /// POST: /api/userrights
        /// Create a new user right record.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<object>>> Create([FromBody] CreateUserRightDto dto)
        {
            try
            {
                Guid? actorId = null;
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (Guid.TryParse(userIdClaim, out var parsed))
                {
                    actorId = parsed;
                }

                var created = await _userRightsService.CreateAsync(dto, actorId);
                var response = new ApiResponse<object>
                {
                    statusCode = 201,
                    message = "User right created successfully",
                    data = created
                };
                return CreatedAtAction(nameof(GetById), new { id = created.strUserRightGUID }, response);
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
        /// PUT: /api/userrights/{id}
        /// Update an existing user right record.
        /// </summary>
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ApiResponse<object>>> Update(Guid id, [FromBody] CreateUserRightDto dto)
        {
            try
            {
                Guid? actorId = null;
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (Guid.TryParse(userIdClaim, out var parsed))
                {
                    actorId = parsed;
                }

                var updated = await _userRightsService.UpdateAsync(id, dto, actorId);
                if (updated == null)
                {
                    var notFound = new ApiResponse<object>
                    {
                        statusCode = 404,
                        message = "User right not found",
                        data = null
                    };
                    return NotFound(notFound);
                }

                var response = new ApiResponse<object>
                {
                    statusCode = 200,
                    message = "User right updated successfully",
                    data = updated
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
        /// DELETE: /api/userrights/{id}
        /// Delete a user right record.
        /// </summary>
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<ApiResponse<object>>> Delete(Guid id)
        {
            var deleted = await _userRightsService.DeleteAsync(id);
            if (!deleted)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "User right not found",
                    data = null
                };
                return NotFound(notFound);
            }

            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "User right deleted successfully",
                data = null
            };
            return Ok(response);
        }
    }
}

