using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class BlogCategoryService : IBlogCategoryService
    {
        private readonly AppDbContext _context;

        public BlogCategoryService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BlogCategoryResponseDto>> GetAllCategoriesAsync(bool includeInactive = false)
        {
            var query = _context.BlogCategories.AsQueryable();

            if (!includeInactive)
            {
                query = query.Where(c => c.bolIsActive);
            }

            var categories = await query
                .OrderBy(c => c.intDisplayOrder)
                .ThenBy(c => c.strCategoryName)
                .Select(c => new BlogCategoryResponseDto
                {
                    strCategoryGUID = c.strCategoryGUID,
                    strCategoryName = c.strCategoryName,
                    strCategorySlug = c.strCategorySlug,
                    strCategoryDescription = c.strCategoryDescription,
                    strCategoryImage = c.strCategoryImage,
                    strMetaTitle = c.strMetaTitle,
                    strMetaDescription = c.strMetaDescription,
                    strMetaKeywords = c.strMetaKeywords,
                    intDisplayOrder = c.intDisplayOrder,
                    bolIsActive = c.bolIsActive,
                    strCreatedByGUID = c.strCreatedByGUID,
                    dtCreatedOn = c.dtCreatedOn,
                    strUpdatedByGUID = c.strUpdatedByGUID,
                    dtUpdatedOn = c.dtUpdatedOn
                })
                .ToListAsync();

            return categories;
        }

        public async Task<BlogCategoryResponseDto?> GetCategoryByIdAsync(string categoryGuid)
        {
            var category = await _context.BlogCategories
                .FirstOrDefaultAsync(c => c.strCategoryGUID == categoryGuid);

            if (category == null)
            {
                return null;
            }

            return new BlogCategoryResponseDto
            {
                strCategoryGUID = category.strCategoryGUID,
                strCategoryName = category.strCategoryName,
                strCategorySlug = category.strCategorySlug,
                strCategoryDescription = category.strCategoryDescription,
                strCategoryImage = category.strCategoryImage,
                strMetaTitle = category.strMetaTitle,
                strMetaDescription = category.strMetaDescription,
                strMetaKeywords = category.strMetaKeywords,
                intDisplayOrder = category.intDisplayOrder,
                bolIsActive = category.bolIsActive,
                strCreatedByGUID = category.strCreatedByGUID,
                dtCreatedOn = category.dtCreatedOn,
                strUpdatedByGUID = category.strUpdatedByGUID,
                dtUpdatedOn = category.dtUpdatedOn
            };
        }

        public async Task<BlogCategoryResponseDto?> GetCategoryBySlugAsync(string slug)
        {
            var category = await _context.BlogCategories
                .FirstOrDefaultAsync(c => c.strCategorySlug == slug);

            if (category == null)
            {
                return null;
            }

            return new BlogCategoryResponseDto
            {
                strCategoryGUID = category.strCategoryGUID,
                strCategoryName = category.strCategoryName,
                strCategorySlug = category.strCategorySlug,
                strCategoryDescription = category.strCategoryDescription,
                strCategoryImage = category.strCategoryImage,
                strMetaTitle = category.strMetaTitle,
                strMetaDescription = category.strMetaDescription,
                strMetaKeywords = category.strMetaKeywords,
                intDisplayOrder = category.intDisplayOrder,
                bolIsActive = category.bolIsActive,
                strCreatedByGUID = category.strCreatedByGUID,
                dtCreatedOn = category.dtCreatedOn,
                strUpdatedByGUID = category.strUpdatedByGUID,
                dtUpdatedOn = category.dtUpdatedOn
            };
        }

        public async Task<BlogCategoryResponseDto> CreateCategoryAsync(CreateBlogCategoryDto dto, string createdByGuid)
        {
            // Check if slug already exists
            var existingCategory = await _context.BlogCategories
                .FirstOrDefaultAsync(c => c.strCategorySlug == dto.strCategorySlug);

            if (existingCategory != null)
            {
                throw new InvalidOperationException("A category with this slug already exists");
            }

            var category = new BlogCategory
            {
                strCategoryGUID = Guid.NewGuid().ToString(),
                strCategoryName = dto.strCategoryName,
                strCategorySlug = dto.strCategorySlug,
                strCategoryDescription = dto.strCategoryDescription,
                strCategoryImage = string.Empty,
                strMetaTitle = dto.strMetaTitle,
                strMetaDescription = dto.strMetaDescription,
                strMetaKeywords = dto.strMetaKeywords,
                intDisplayOrder = dto.intDisplayOrder,
                bolIsActive = dto.bolIsActive,
                strCreatedByGUID = createdByGuid,
                dtCreatedOn = DateTime.UtcNow
            };

            _context.BlogCategories.Add(category);
            await _context.SaveChangesAsync();

            return new BlogCategoryResponseDto
            {
                strCategoryGUID = category.strCategoryGUID,
                strCategoryName = category.strCategoryName,
                strCategorySlug = category.strCategorySlug,
                strCategoryDescription = category.strCategoryDescription,
                strCategoryImage = category.strCategoryImage,
                strMetaTitle = category.strMetaTitle,
                strMetaDescription = category.strMetaDescription,
                strMetaKeywords = category.strMetaKeywords,
                intDisplayOrder = category.intDisplayOrder,
                bolIsActive = category.bolIsActive,
                strCreatedByGUID = category.strCreatedByGUID,
                dtCreatedOn = category.dtCreatedOn
            };
        }

        public async Task<BlogCategoryResponseDto?> UpdateCategoryAsync(string categoryGuid, UpdateBlogCategoryDto dto, string updatedByGuid)
        {
            var category = await _context.BlogCategories
                .FirstOrDefaultAsync(c => c.strCategoryGUID == categoryGuid);

            if (category == null)
            {
                return null;
            }

            // Check slug uniqueness if being updated
            if (!string.IsNullOrEmpty(dto.strCategorySlug) && dto.strCategorySlug != category.strCategorySlug)
            {
                var slugExists = await _context.BlogCategories
                    .AnyAsync(c => c.strCategorySlug == dto.strCategorySlug && c.strCategoryGUID != categoryGuid);

                if (slugExists)
                {
                    throw new InvalidOperationException("A category with this slug already exists");
                }
                category.strCategorySlug = dto.strCategorySlug;
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(dto.strCategoryName)) category.strCategoryName = dto.strCategoryName;
            if (dto.strCategoryDescription != null) category.strCategoryDescription = dto.strCategoryDescription;
            if (dto.strMetaTitle != null) category.strMetaTitle = dto.strMetaTitle;
            if (dto.strMetaDescription != null) category.strMetaDescription = dto.strMetaDescription;
            if (dto.strMetaKeywords != null) category.strMetaKeywords = dto.strMetaKeywords;
            if (dto.intDisplayOrder.HasValue) category.intDisplayOrder = dto.intDisplayOrder.Value;
            if (dto.bolIsActive.HasValue) category.bolIsActive = dto.bolIsActive.Value;

            category.strUpdatedByGUID = updatedByGuid;
            category.dtUpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new BlogCategoryResponseDto
            {
                strCategoryGUID = category.strCategoryGUID,
                strCategoryName = category.strCategoryName,
                strCategorySlug = category.strCategorySlug,
                strCategoryDescription = category.strCategoryDescription,
                strCategoryImage = category.strCategoryImage,
                strMetaTitle = category.strMetaTitle,
                strMetaDescription = category.strMetaDescription,
                strMetaKeywords = category.strMetaKeywords,
                intDisplayOrder = category.intDisplayOrder,
                bolIsActive = category.bolIsActive,
                strCreatedByGUID = category.strCreatedByGUID,
                dtCreatedOn = category.dtCreatedOn,
                strUpdatedByGUID = category.strUpdatedByGUID,
                dtUpdatedOn = category.dtUpdatedOn
            };
        }

        public async Task<bool> DeleteCategoryAsync(string categoryGuid)
        {
            var category = await _context.BlogCategories
                .FirstOrDefaultAsync(c => c.strCategoryGUID == categoryGuid);

            if (category == null)
            {
                return false;
            }

            // Check if category is used by any blogs
            var blogsWithCategory = await _context.Blogs
                .AnyAsync(b => b.strCategoryGUID == categoryGuid);

            if (blogsWithCategory)
            {
                throw new InvalidOperationException("Cannot delete category as it is being used by one or more blogs");
            }

            _context.BlogCategories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}

