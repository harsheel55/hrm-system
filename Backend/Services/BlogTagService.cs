using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class BlogTagService : IBlogTagService
    {
        private readonly AppDbContext _context;

        public BlogTagService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BlogTagResponseDto>> GetAllTagsAsync(bool includeInactive = false)
        {
            var query = _context.BlogTags.AsQueryable();

            if (!includeInactive)
            {
                query = query.Where(t => t.bolIsActive);
            }

            var tags = await query
                .OrderBy(t => t.strTagName)
                .Select(t => new BlogTagResponseDto
                {
                    strTagGUID = t.strTagGUID,
                    strTagName = t.strTagName,
                    strTagSlug = t.strTagSlug,
                    bolIsActive = t.bolIsActive,
                    strCreatedByGUID = t.strCreatedByGUID,
                    dtCreatedOn = t.dtCreatedOn,
                    strUpdatedByGUID = t.strUpdatedByGUID,
                    dtUpdatedOn = t.dtUpdatedOn
                })
                .ToListAsync();

            return tags;
        }

        public async Task<BlogTagResponseDto?> GetTagByIdAsync(string tagGuid)
        {
            var tag = await _context.BlogTags
                .FirstOrDefaultAsync(t => t.strTagGUID == tagGuid);

            if (tag == null)
            {
                return null;
            }

            return new BlogTagResponseDto
            {
                strTagGUID = tag.strTagGUID,
                strTagName = tag.strTagName,
                strTagSlug = tag.strTagSlug,
                bolIsActive = tag.bolIsActive,
                strCreatedByGUID = tag.strCreatedByGUID,
                dtCreatedOn = tag.dtCreatedOn,
                strUpdatedByGUID = tag.strUpdatedByGUID,
                dtUpdatedOn = tag.dtUpdatedOn
            };
        }

        public async Task<BlogTagResponseDto?> GetTagBySlugAsync(string slug)
        {
            var tag = await _context.BlogTags
                .FirstOrDefaultAsync(t => t.strTagSlug == slug);

            if (tag == null)
            {
                return null;
            }

            return new BlogTagResponseDto
            {
                strTagGUID = tag.strTagGUID,
                strTagName = tag.strTagName,
                strTagSlug = tag.strTagSlug,
                bolIsActive = tag.bolIsActive,
                strCreatedByGUID = tag.strCreatedByGUID,
                dtCreatedOn = tag.dtCreatedOn,
                strUpdatedByGUID = tag.strUpdatedByGUID,
                dtUpdatedOn = tag.dtUpdatedOn
            };
        }

        public async Task<BlogTagResponseDto> CreateTagAsync(CreateBlogTagDto dto, string createdByGuid)
        {
            // Check if slug already exists
            var existingTag = await _context.BlogTags
                .FirstOrDefaultAsync(t => t.strTagSlug == dto.strTagSlug);

            if (existingTag != null)
            {
                throw new InvalidOperationException("A tag with this slug already exists");
            }

            var tag = new BlogTag
            {
                strTagGUID = Guid.NewGuid().ToString(),
                strTagName = dto.strTagName,
                strTagSlug = dto.strTagSlug,
                bolIsActive = dto.bolIsActive,
                strCreatedByGUID = createdByGuid,
                dtCreatedOn = DateTime.UtcNow
            };

            _context.BlogTags.Add(tag);
            await _context.SaveChangesAsync();

            return new BlogTagResponseDto
            {
                strTagGUID = tag.strTagGUID,
                strTagName = tag.strTagName,
                strTagSlug = tag.strTagSlug,
                bolIsActive = tag.bolIsActive,
                strCreatedByGUID = tag.strCreatedByGUID,
                dtCreatedOn = tag.dtCreatedOn
            };
        }

        public async Task<BlogTagResponseDto?> UpdateTagAsync(string tagGuid, UpdateBlogTagDto dto, string updatedByGuid)
        {
            var tag = await _context.BlogTags
                .FirstOrDefaultAsync(t => t.strTagGUID == tagGuid);

            if (tag == null)
            {
                return null;
            }

            // Check slug uniqueness if being updated
            if (!string.IsNullOrEmpty(dto.strTagSlug) && dto.strTagSlug != tag.strTagSlug)
            {
                var slugExists = await _context.BlogTags
                    .AnyAsync(t => t.strTagSlug == dto.strTagSlug && t.strTagGUID != tagGuid);

                if (slugExists)
                {
                    throw new InvalidOperationException("A tag with this slug already exists");
                }
                tag.strTagSlug = dto.strTagSlug;
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(dto.strTagName)) tag.strTagName = dto.strTagName;
            if (dto.bolIsActive.HasValue) tag.bolIsActive = dto.bolIsActive.Value;

            tag.strUpdatedByGUID = updatedByGuid;
            tag.dtUpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new BlogTagResponseDto
            {
                strTagGUID = tag.strTagGUID,
                strTagName = tag.strTagName,
                strTagSlug = tag.strTagSlug,
                bolIsActive = tag.bolIsActive,
                strCreatedByGUID = tag.strCreatedByGUID,
                dtCreatedOn = tag.dtCreatedOn,
                strUpdatedByGUID = tag.strUpdatedByGUID,
                dtUpdatedOn = tag.dtUpdatedOn
            };
        }

        public async Task<bool> DeleteTagAsync(string tagGuid)
        {
            var tag = await _context.BlogTags
                .FirstOrDefaultAsync(t => t.strTagGUID == tagGuid);

            if (tag == null)
            {
                return false;
            }

            _context.BlogTags.Remove(tag);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
