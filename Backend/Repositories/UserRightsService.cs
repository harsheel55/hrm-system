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
    /// Service for managing user rights (per-role menu permissions).
    /// </summary>
    public class UserRightsService : IUserRightsService
    {
        private readonly AppDbContext _context;

        public UserRightsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserRightResponseDto?> GetByIdAsync(Guid userRightId)
        {
            var entity = await _context.UserRights.FindAsync(userRightId);
            return entity == null ? null : MapToDto(entity);
        }

        public async Task<IEnumerable<UserRightResponseDto>> GetByRoleAsync(Guid roleId)
        {
            var rights = await _context.UserRights
                .Where(r => r.strUserRoleGUID == roleId)
                .OrderBy(r => r.strMenuGUID)
                .ToListAsync();

            return rights.Select(MapToDto);
        }

        public async Task<UserRightResponseDto> CreateAsync(CreateUserRightDto dto, Guid? actorId = null)
        {
            var auditActor = actorId ?? SystemConstants.SYSTEM_USER_GUID;

            // Ensure combination of role+menu is unique
            var exists = await _context.UserRights.AnyAsync(r =>
                r.strUserRoleGUID == dto.strUserRoleGUID &&
                r.strMenuGUID == dto.strMenuGUID);

            if (exists)
            {
                throw new InvalidOperationException("User rights for this role and menu already exist.");
            }

            var now = DateTime.UtcNow;
            var entity = new UserRight
            {
                strUserRightGUID = Guid.NewGuid(),
                strUserRoleGUID = dto.strUserRoleGUID,
                strMenuGUID = dto.strMenuGUID,
                bolCanView = dto.bolCanView,
                bolCanEdit = dto.bolCanEdit,
                bolCanSave = dto.bolCanSave,
                bolCanDelete = dto.bolCanDelete,
                bolCanPrint = dto.bolCanPrint,
                bolCanExport = dto.bolCanExport,
                bolCanImport = dto.bolCanImport,
                bolCanApprove = dto.bolCanApprove,
                dtCreatedOn = now,
                strCreatedByGUID = auditActor,
                dtUpdatedOn = now,
                strUpdatedByGUID = auditActor
            };

            _context.UserRights.Add(entity);
            await _context.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task<UserRightResponseDto?> UpdateAsync(Guid userRightId, CreateUserRightDto dto, Guid? actorId = null)
        {
            var auditActor = actorId ?? SystemConstants.SYSTEM_USER_GUID;

            var entity = await _context.UserRights.FindAsync(userRightId);
            if (entity == null)
            {
                return null;
            }

            // Check for duplicate combination if role/menu changed
            if (entity.strUserRoleGUID != dto.strUserRoleGUID || entity.strMenuGUID != dto.strMenuGUID)
            {
                var duplicate = await _context.UserRights.AnyAsync(r =>
                    r.strUserRightGUID != userRightId &&
                    r.strUserRoleGUID == dto.strUserRoleGUID &&
                    r.strMenuGUID == dto.strMenuGUID);

                if (duplicate)
                {
                    throw new InvalidOperationException("User rights for this role and menu already exist.");
                }
            }

            entity.strUserRoleGUID = dto.strUserRoleGUID;
            entity.strMenuGUID = dto.strMenuGUID;
            entity.bolCanView = dto.bolCanView;
            entity.bolCanEdit = dto.bolCanEdit;
            entity.bolCanSave = dto.bolCanSave;
            entity.bolCanDelete = dto.bolCanDelete;
            entity.bolCanPrint = dto.bolCanPrint;
            entity.bolCanExport = dto.bolCanExport;
            entity.bolCanImport = dto.bolCanImport;
            entity.bolCanApprove = dto.bolCanApprove;
            entity.dtUpdatedOn = DateTime.UtcNow;
            entity.strUpdatedByGUID = auditActor;

            await _context.SaveChangesAsync();

            return MapToDto(entity);
        }

        public async Task<bool> DeleteAsync(Guid userRightId)
        {
            var entity = await _context.UserRights.FindAsync(userRightId);
            if (entity == null)
            {
                return false;
            }

            _context.UserRights.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        private static UserRightResponseDto MapToDto(UserRight entity)
        {
            return new UserRightResponseDto
            {
                strUserRightGUID = entity.strUserRightGUID,
                strUserRoleGUID = entity.strUserRoleGUID,
                strMenuGUID = entity.strMenuGUID,
                bolCanView = entity.bolCanView,
                bolCanEdit = entity.bolCanEdit,
                bolCanSave = entity.bolCanSave,
                bolCanDelete = entity.bolCanDelete,
                bolCanPrint = entity.bolCanPrint,
                bolCanExport = entity.bolCanExport,
                bolCanImport = entity.bolCanImport,
                bolCanApprove = entity.bolCanApprove,
                strCreatedByGUID = entity.strCreatedByGUID,
                dtCreatedOn = entity.dtCreatedOn,
                strUpdatedByGUID = entity.strUpdatedByGUID,
                dtUpdatedOn = entity.dtUpdatedOn
            };
        }
    }
}

