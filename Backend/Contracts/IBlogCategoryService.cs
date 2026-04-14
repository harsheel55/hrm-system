using Backend.DTOs;

namespace Backend.Services
{
    public interface IBlogCategoryService
    {
        Task<IEnumerable<BlogCategoryResponseDto>> GetAllCategoriesAsync(bool includeInactive = false);
        Task<BlogCategoryResponseDto?> GetCategoryByIdAsync(string categoryGuid);
        Task<BlogCategoryResponseDto?> GetCategoryBySlugAsync(string slug);
        Task<BlogCategoryResponseDto> CreateCategoryAsync(CreateBlogCategoryDto dto, string createdByGuid);
        Task<BlogCategoryResponseDto?> UpdateCategoryAsync(string categoryGuid, UpdateBlogCategoryDto dto, string updatedByGuid);
        Task<bool> DeleteCategoryAsync(string categoryGuid);
    }
}
