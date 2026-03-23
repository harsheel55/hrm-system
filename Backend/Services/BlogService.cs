using Backend.Data;
using Backend.DTOs;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class BlogService : IBlogService
    {
        private readonly AppDbContext _context;

        public BlogService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BlogResponseDto>> GetAllBlogsAsync(bool includeInactive = false)
        {
            var query = _context.Blogs.Include(b => b.Category).AsQueryable();

            if (!includeInactive)
            {
                query = query.Where(b => b.bolIsActive);
            }

            var blogs = await query
                .OrderByDescending(b => b.dtCreatedOn)
                .Select(b => new BlogResponseDto
                {
                    strBlogGUID = b.strBlogGUID,
                    strCategoryGUID = b.strCategoryGUID,
                    strCategoryName = b.Category != null ? b.Category.strCategoryName : null,
                    strBlogSlug = b.strBlogSlug,
                    strBlogTitle = b.strBlogTitle,
                    strShortDescription = b.strShortDescription,
                    strFullContent = b.strFullContent,
                    strFeaturedImage = b.strFeaturedImage,
                    strMetaTitle = b.strMetaTitle,
                    strMetaDescription = b.strMetaDescription,
                    strMetaKeywords = b.strMetaKeywords,
                    dtPublishDate = b.dtPublishDate,
                    bolIsPublished = b.bolIsPublished,
                    bolIsFeatured = b.bolIsFeatured,
                    bolIsActive = b.bolIsActive,
                    strCreatedByGUID = b.strCreatedByGUID,
                    dtCreatedOn = b.dtCreatedOn,
                    strUpdatedByGUID = b.strUpdatedByGUID,
                    dtUpdatedOn = b.dtUpdatedOn
                })
                .ToListAsync();

            return blogs;
        }

        public async Task<BlogResponseDto?> GetBlogByIdAsync(string blogGuid)
        {
            var blog = await _context.Blogs
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.strBlogGUID == blogGuid);

            if (blog == null)
            {
                return null;
            }

            return new BlogResponseDto
            {
                strBlogGUID = blog.strBlogGUID,
                strCategoryGUID = blog.strCategoryGUID,
                strCategoryName = blog.Category?.strCategoryName,
                strBlogSlug = blog.strBlogSlug,
                strBlogTitle = blog.strBlogTitle,
                strShortDescription = blog.strShortDescription,
                strFullContent = blog.strFullContent,
                strFeaturedImage = blog.strFeaturedImage,
                strMetaTitle = blog.strMetaTitle,
                strMetaDescription = blog.strMetaDescription,
                strMetaKeywords = blog.strMetaKeywords,
                dtPublishDate = blog.dtPublishDate,
                bolIsPublished = blog.bolIsPublished,
                bolIsFeatured = blog.bolIsFeatured,
                bolIsActive = blog.bolIsActive,
                strCreatedByGUID = blog.strCreatedByGUID,
                dtCreatedOn = blog.dtCreatedOn,
                strUpdatedByGUID = blog.strUpdatedByGUID,
                dtUpdatedOn = blog.dtUpdatedOn
            };
        }

        public async Task<BlogResponseDto?> GetBlogBySlugAsync(string slug)
        {
            var blog = await _context.Blogs
                .Include(b => b.Category)
                .FirstOrDefaultAsync(b => b.strBlogSlug == slug);

            if (blog == null)
            {
                return null;
            }

            return new BlogResponseDto
            {
                strBlogGUID = blog.strBlogGUID,
                strCategoryGUID = blog.strCategoryGUID,
                strCategoryName = blog.Category?.strCategoryName,
                strBlogSlug = blog.strBlogSlug,
                strBlogTitle = blog.strBlogTitle,
                strShortDescription = blog.strShortDescription,
                strFullContent = blog.strFullContent,
                strFeaturedImage = blog.strFeaturedImage,
                strMetaTitle = blog.strMetaTitle,
                strMetaDescription = blog.strMetaDescription,
                strMetaKeywords = blog.strMetaKeywords,
                dtPublishDate = blog.dtPublishDate,
                bolIsPublished = blog.bolIsPublished,
                bolIsFeatured = blog.bolIsFeatured,
                bolIsActive = blog.bolIsActive,
                strCreatedByGUID = blog.strCreatedByGUID,
                dtCreatedOn = blog.dtCreatedOn,
                strUpdatedByGUID = blog.strUpdatedByGUID,
                dtUpdatedOn = blog.dtUpdatedOn
            };
        }

        public async Task<BlogResponseDto> CreateBlogAsync(CreateBlogDto dto, string createdByGuid)
        {
            // Check if slug already exists
            var existingBlog = await _context.Blogs.FirstOrDefaultAsync(b => b.strBlogSlug == dto.strBlogSlug);
            if (existingBlog != null)
            {
                throw new InvalidOperationException("A blog with this slug already exists");
            }

            // Validate category if provided
            if (!string.IsNullOrEmpty(dto.strCategoryGUID))
            {
                var categoryExists = await _context.BlogCategories.AnyAsync(c => c.strCategoryGUID == dto.strCategoryGUID);
                if (!categoryExists)
                {
                    throw new InvalidOperationException("Invalid category");
                }
            }

            var blog = new Blog
            {
                strBlogGUID = Guid.NewGuid().ToString(),
                strCategoryGUID = dto.strCategoryGUID,
                strBlogSlug = dto.strBlogSlug,
                strBlogTitle = dto.strBlogTitle,
                strShortDescription = dto.strShortDescription,
                strFullContent = dto.strFullContent,
                strFeaturedImage = string.Empty,
                strMetaTitle = dto.strMetaTitle,
                strMetaDescription = dto.strMetaDescription,
                strMetaKeywords = dto.strMetaKeywords,
                dtPublishDate = dto.dtPublishDate,
                bolIsPublished = dto.bolIsPublished,
                bolIsFeatured = dto.bolIsFeatured,
                bolIsActive = dto.bolIsActive,
                strCreatedByGUID = createdByGuid,
                dtCreatedOn = DateTime.UtcNow
            };

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return new BlogResponseDto
            {
                strBlogGUID = blog.strBlogGUID,
                strCategoryGUID = blog.strCategoryGUID,
                strBlogSlug = blog.strBlogSlug,
                strBlogTitle = blog.strBlogTitle,
                strShortDescription = blog.strShortDescription,
                strFullContent = blog.strFullContent,
                strFeaturedImage = blog.strFeaturedImage,
                strMetaTitle = blog.strMetaTitle,
                strMetaDescription = blog.strMetaDescription,
                strMetaKeywords = blog.strMetaKeywords,
                dtPublishDate = blog.dtPublishDate,
                bolIsPublished = blog.bolIsPublished,
                bolIsFeatured = blog.bolIsFeatured,
                bolIsActive = blog.bolIsActive,
                strCreatedByGUID = blog.strCreatedByGUID,
                dtCreatedOn = blog.dtCreatedOn
            };
        }

        public async Task<BlogResponseDto?> UpdateBlogAsync(string blogGuid, UpdateBlogDto dto, string updatedByGuid)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.strBlogGUID == blogGuid);
            if (blog == null)
            {
                return null;
            }

            // Check slug uniqueness if being updated
            if (!string.IsNullOrEmpty(dto.strBlogSlug) && dto.strBlogSlug != blog.strBlogSlug)
            {
                var slugExists = await _context.Blogs.AnyAsync(b => b.strBlogSlug == dto.strBlogSlug && b.strBlogGUID != blogGuid);
                if (slugExists)
                {
                    throw new InvalidOperationException("A blog with this slug already exists");
                }
                blog.strBlogSlug = dto.strBlogSlug;
            }

            // Validate category if being updated
            if (dto.strCategoryGUID != null && dto.strCategoryGUID != blog.strCategoryGUID)
            {
                if (!string.IsNullOrEmpty(dto.strCategoryGUID))
                {
                    var categoryExists = await _context.BlogCategories.AnyAsync(c => c.strCategoryGUID == dto.strCategoryGUID);
                    if (!categoryExists)
                    {
                        throw new InvalidOperationException("Invalid category");
                    }
                }
                blog.strCategoryGUID = dto.strCategoryGUID;
            }

            // Update fields if provided
            if (!string.IsNullOrEmpty(dto.strBlogTitle)) blog.strBlogTitle = dto.strBlogTitle;
            if (dto.strShortDescription != null) blog.strShortDescription = dto.strShortDescription;
            if (dto.strFullContent != null) blog.strFullContent = dto.strFullContent;
            if (dto.strMetaTitle != null) blog.strMetaTitle = dto.strMetaTitle;
            if (dto.strMetaDescription != null) blog.strMetaDescription = dto.strMetaDescription;
            if (dto.strMetaKeywords != null) blog.strMetaKeywords = dto.strMetaKeywords;
            if (dto.dtPublishDate.HasValue) blog.dtPublishDate = dto.dtPublishDate;
            if (dto.bolIsPublished.HasValue) blog.bolIsPublished = dto.bolIsPublished.Value;
            if (dto.bolIsFeatured.HasValue) blog.bolIsFeatured = dto.bolIsFeatured.Value;
            if (dto.bolIsActive.HasValue) blog.bolIsActive = dto.bolIsActive.Value;

            blog.strUpdatedByGUID = updatedByGuid;
            blog.dtUpdatedOn = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return new BlogResponseDto
            {
                strBlogGUID = blog.strBlogGUID,
                strCategoryGUID = blog.strCategoryGUID,
                strBlogSlug = blog.strBlogSlug,
                strBlogTitle = blog.strBlogTitle,
                strShortDescription = blog.strShortDescription,
                strFullContent = blog.strFullContent,
                strFeaturedImage = blog.strFeaturedImage,
                strMetaTitle = blog.strMetaTitle,
                strMetaDescription = blog.strMetaDescription,
                strMetaKeywords = blog.strMetaKeywords,
                dtPublishDate = blog.dtPublishDate,
                bolIsPublished = blog.bolIsPublished,
                bolIsFeatured = blog.bolIsFeatured,
                bolIsActive = blog.bolIsActive,
                strCreatedByGUID = blog.strCreatedByGUID,
                dtCreatedOn = blog.dtCreatedOn,
                strUpdatedByGUID = blog.strUpdatedByGUID,
                dtUpdatedOn = blog.dtUpdatedOn
            };
        }

        public async Task<bool> DeleteBlogAsync(string blogGuid)
        {
            var blog = await _context.Blogs.FirstOrDefaultAsync(b => b.strBlogGUID == blogGuid);
            if (blog == null)
            {
                return false;
            }

            _context.Blogs.Remove(blog);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<BlogResponseDto>> GetPublishedBlogsAsync()
        {
            var blogs = await _context.Blogs
                .Include(b => b.Category)
                .Where(b => b.bolIsPublished && b.bolIsActive)
                .OrderByDescending(b => b.dtPublishDate ?? b.dtCreatedOn)
                .Select(b => new BlogResponseDto
                {
                    strBlogGUID = b.strBlogGUID,
                    strCategoryGUID = b.strCategoryGUID,
                    strCategoryName = b.Category != null ? b.Category.strCategoryName : null,
                    strBlogSlug = b.strBlogSlug,
                    strBlogTitle = b.strBlogTitle,
                    strShortDescription = b.strShortDescription,
                    strFullContent = b.strFullContent,
                    strFeaturedImage = b.strFeaturedImage,
                    strMetaTitle = b.strMetaTitle,
                    strMetaDescription = b.strMetaDescription,
                    strMetaKeywords = b.strMetaKeywords,
                    dtPublishDate = b.dtPublishDate,
                    bolIsPublished = b.bolIsPublished,
                    bolIsFeatured = b.bolIsFeatured,
                    bolIsActive = b.bolIsActive,
                    strCreatedByGUID = b.strCreatedByGUID,
                    dtCreatedOn = b.dtCreatedOn,
                    strUpdatedByGUID = b.strUpdatedByGUID,
                    dtUpdatedOn = b.dtUpdatedOn
                })
                .ToListAsync();

            return blogs;
        }

        public async Task<IEnumerable<BlogResponseDto>> GetFeaturedBlogsAsync()
        {
            var blogs = await _context.Blogs
                .Include(b => b.Category)
                .Where(b => b.bolIsFeatured && b.bolIsPublished && b.bolIsActive)
                .OrderByDescending(b => b.dtPublishDate ?? b.dtCreatedOn)
                .Select(b => new BlogResponseDto
                {
                    strBlogGUID = b.strBlogGUID,
                    strCategoryGUID = b.strCategoryGUID,
                    strCategoryName = b.Category != null ? b.Category.strCategoryName : null,
                    strBlogSlug = b.strBlogSlug,
                    strBlogTitle = b.strBlogTitle,
                    strShortDescription = b.strShortDescription,
                    strFullContent = b.strFullContent,
                    strFeaturedImage = b.strFeaturedImage,
                    strMetaTitle = b.strMetaTitle,
                    strMetaDescription = b.strMetaDescription,
                    strMetaKeywords = b.strMetaKeywords,
                    dtPublishDate = b.dtPublishDate,
                    bolIsPublished = b.bolIsPublished,
                    bolIsFeatured = b.bolIsFeatured,
                    bolIsActive = b.bolIsActive,
                    strCreatedByGUID = b.strCreatedByGUID,
                    dtCreatedOn = b.dtCreatedOn,
                    strUpdatedByGUID = b.strUpdatedByGUID,
                    dtUpdatedOn = b.dtUpdatedOn
                })
                .ToListAsync();

            return blogs;
        }

        public async Task<IEnumerable<BlogResponseDto>> GetBlogsByCategoryAsync(string categoryGuid)
        {
            var blogs = await _context.Blogs
                .Include(b => b.Category)
                .Where(b => b.strCategoryGUID == categoryGuid && b.bolIsActive)
                .OrderByDescending(b => b.dtCreatedOn)
                .Select(b => new BlogResponseDto
                {
                    strBlogGUID = b.strBlogGUID,
                    strCategoryGUID = b.strCategoryGUID,
                    strCategoryName = b.Category != null ? b.Category.strCategoryName : null,
                    strBlogSlug = b.strBlogSlug,
                    strBlogTitle = b.strBlogTitle,
                    strShortDescription = b.strShortDescription,
                    strFullContent = b.strFullContent,
                    strFeaturedImage = b.strFeaturedImage,
                    strMetaTitle = b.strMetaTitle,
                    strMetaDescription = b.strMetaDescription,
                    strMetaKeywords = b.strMetaKeywords,
                    dtPublishDate = b.dtPublishDate,
                    bolIsPublished = b.bolIsPublished,
                    bolIsFeatured = b.bolIsFeatured,
                    bolIsActive = b.bolIsActive,
                    strCreatedByGUID = b.strCreatedByGUID,
                    dtCreatedOn = b.dtCreatedOn,
                    strUpdatedByGUID = b.strUpdatedByGUID,
                    dtUpdatedOn = b.dtUpdatedOn
                })
                .ToListAsync();

            return blogs;
        }
    }
}
