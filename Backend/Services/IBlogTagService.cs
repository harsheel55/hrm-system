using Backend.DTOs;

namespace Backend.Services
{
    public interface IBlogTagService
    {
        Task<IEnumerable<BlogTagResponseDto>> GetAllTagsAsync(bool includeInactive = false);
        Task<BlogTagResponseDto?> GetTagByIdAsync(string tagGuid);
        Task<BlogTagResponseDto?> GetTagBySlugAsync(string slug);
        Task<BlogTagResponseDto> CreateTagAsync(CreateBlogTagDto dto, string createdByGuid);
        Task<BlogTagResponseDto?> UpdateTagAsync(string tagGuid, UpdateBlogTagDto dto, string updatedByGuid);
        Task<bool> DeleteTagAsync(string tagGuid);
    }
}
