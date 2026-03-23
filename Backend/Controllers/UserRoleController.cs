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
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserRoleController : ControllerBase
    {
        private readonly IUserRoleService _userRoleService;

        public UserRoleController(IUserRoleService userRoleService)
        {
            _userRoleService = userRoleService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<object>>> GetAllRoles()
        {
            var roles = await _userRoleService.GetAllRolesAsync();
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "Roles retrieved successfully",
                data = roles
            };
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> GetRoleById(Guid id)
        {
            var role = await _userRoleService.GetRoleByIdAsync(id);
            if (role == null)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "Role not found",
                    data = null
                };
                return NotFound(notFound);
            }
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "Role retrieved successfully",
                data = role
            };
            return Ok(response);
        }

        [HttpGet("name/{roleName}")]
        public async Task<ActionResult<ApiResponse<object>>> GetRoleByName(string roleName)
        {
            var role = await _userRoleService.GetRoleByNameAsync(roleName);
            if (role == null)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "Role not found",
                    data = null
                };
                return NotFound(notFound);
            }
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "Role retrieved successfully",
                data = role
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<object>>> CreateRole([FromBody] CreateUserRoleDto createRoleDto)
        {
            try
            {
                var role = await _userRoleService.CreateRoleAsync(createRoleDto);
                var response = new ApiResponse<object>
                {
                    statusCode = 201,
                    message = "Role created successfully",
                    data = role
                };
                return CreatedAtAction(nameof(GetRoleById), new { id = role.strUserRoleGUID }, response);
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

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> UpdateRole(Guid id, [FromBody] UpdateUserRoleDto updateRoleDto)
        {
            try
            {
                var role = await _userRoleService.UpdateRoleAsync(id, updateRoleDto);
                if (role == null)
                {
                    var notFound = new ApiResponse<object>
                    {
                        statusCode = 404,
                        message = "Role not found",
                        data = null
                    };
                    return NotFound(notFound);
                }
                var response = new ApiResponse<object>
                {
                    statusCode = 200,
                    message = "Role updated successfully",
                    data = role
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

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteRole(Guid id)
        {
            var result = await _userRoleService.DeleteRoleAsync(id);
            if (!result)
            {
                var notFound = new ApiResponse<object>
                {
                    statusCode = 404,
                    message = "Role not found",
                    data = null
                };
                return NotFound(notFound);
            }
            var response = new ApiResponse<object>
            {
                statusCode = 200,
                message = "Role deleted successfully",
                data = new { }
            };
            return Ok(response);
        }
    }
}
