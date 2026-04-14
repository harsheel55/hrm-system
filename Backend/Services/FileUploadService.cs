using Backend.DTOs;

namespace Backend.Services
{
    public interface IFileUploadService
    {
        Task<ApiResponse<string>> UploadFileAsync(IFormFile file, string subfolder);
    }

    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _hostingEnvironment;

        public FileUploadService(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<ApiResponse<string>> UploadFileAsync(IFormFile file, string subfolder)
        {
            if (file == null || file.Length == 0)
            {
                return new ApiResponse<string>(400, "No file uploaded.");
            }

            var uploadsFolder = Path.Combine(_hostingEnvironment.WebRootPath, "uploads", subfolder);
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            var uniqueFileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            try
            {
                await using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var fileUrl = $"/uploads/{subfolder}/{uniqueFileName}";
                return new ApiResponse<string>(200, "File uploaded successfully.", fileUrl);
            }
            catch (Exception ex)
            {
                return new ApiResponse<string>(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
