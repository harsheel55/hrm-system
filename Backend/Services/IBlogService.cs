using Backend.DTOs;

namespace Backend.Services
{
    public interface IBlogService
    {
        Task<IEnumerable<BlogResponseDto>> GetAllBlogsAsync(bool includeInactive = false);
        Task<BlogResponseDto?> GetBlogByIdAsync(string blogGuid);
        Task<BlogResponseDto?> GetBlogBySlugAsync(string slug);
        Task<BlogResponseDto> CreateBlogAsync(CreateBlogDto dto, string createdByGuid);
        Task<BlogResponseDto?> UpdateBlogAsync(string blogGuid, UpdateBlogDto dto, string updatedByGuid);
        Task<bool> DeleteBlogAsync(string blogGuid);
        Task<IEnumerable<BlogResponseDto>> GetPublishedBlogsAsync();
        Task<IEnumerable<BlogResponseDto>> GetFeaturedBlogsAsync();
        Task<IEnumerable<BlogResponseDto>> GetBlogsByCategoryAsync(string categoryGuid);
    }
}
