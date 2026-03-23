/*
 * FileUploadService.cs - File Upload Handling Service
 * 
 * This service handles file upload operations for the application.
 * Supports image files (JPG, PNG, GIF, WebP) with validation and size limits.
 * Files are stored in wwwroot/uploads folder with unique filenames.
 */

using Microsoft.AspNetCore.Http;

namespace Backend.Services
{
    /// <summary>
    /// Interface for file upload operations
    /// Provides methods for saving, deleting, and validating image files
    /// </summary>
    public interface IFileUploadService
    {
        /// <summary>
        /// Saves an uploaded file to the specified folder
        /// </summary>
        /// <param name="file">The uploaded file from HTTP request</param>
        /// <param name="folder">Subfolder name within uploads directory (e.g., "profiles", "blogs")</param>
        /// <returns>Relative path to saved file (e.g., "/uploads/profiles/guid_filename.jpg")</returns>
        Task<string> SaveFileAsync(IFormFile file, string folder);
        
        /// <summary>
        /// Deletes a file from the server
        /// </summary>
        /// <param name="filePath">Relative path to the file</param>
        /// <returns>True if deleted successfully, false otherwise</returns>
        Task<bool> DeleteFileAsync(string filePath);
        
        /// <summary>
        /// Validates if uploaded file is a valid image
        /// </summary>
        /// <param name="file">The file to validate</param>
        /// <returns>True if valid, false otherwise</returns>
        bool IsValidImageFile(IFormFile file);
    }

    /// <summary>
    /// Implementation of file upload service
    /// Handles image file validation, storage, and deletion
    /// </summary>
    public class FileUploadService : IFileUploadService
    {
        private readonly IWebHostEnvironment _environment;  // Provides access to web root path
        private readonly IConfiguration _configuration;      // Application configuration
        private const long MaxFileSize = 5242880;            // Maximum file size: 5 MB (5 * 1024 * 1024 bytes)
        private readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };  // Allowed image formats

        /// <summary>
        /// Constructor: Initializes file upload service with dependencies
        /// </summary>
        /// <param name="environment">Web hosting environment for path resolution</param>
        /// <param name="configuration">Application configuration</param>
        public FileUploadService(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _environment = environment;
            _configuration = configuration;
        }

        /// <summary>
        /// Saves an uploaded file to the server with validation
        /// </summary>
        /// <param name="file">The file to save</param>
        /// <param name="folder">Target folder within uploads directory</param>
        /// <returns>Relative path to saved file</returns>
        /// <exception cref="ArgumentException">Thrown if file is empty or invalid</exception>
        public async Task<string> SaveFileAsync(IFormFile file, string folder)
        {
            // Validate file is not null or empty
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is empty");
            }

            // Validate file type and size
            if (!IsValidImageFile(file))
            {
                throw new ArgumentException("Invalid image file. Allowed formats: JPG, PNG, GIF, WebP. Max size: 5MB");
            }

            // Construct path to uploads folder (e.g., wwwroot/uploads/profiles)
            var uploadsFolder = Path.Combine(_environment.WebRootPath ?? "wwwroot", "uploads", folder);
            
            // Create directory if it doesn't exist
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }

            // Generate unique filename using GUID to prevent name collisions
            var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);

            // Save file to disk asynchronously
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Return relative path for storage in database (e.g., /uploads/profiles/guid_image.jpg)
            return $"/uploads/{folder}/{uniqueFileName}";
        }

        /// <summary>
        /// Deletes a file from the server's file system
        /// </summary>
        /// <param name="filePath">Relative path to the file (e.g., /uploads/profiles/image.jpg)</param>
        /// <returns>True if file was deleted successfully, false if file doesn't exist or error occurred</returns>
        public async Task<bool> DeleteFileAsync(string filePath)
        {
            // Return false if path is null or empty
            if (string.IsNullOrEmpty(filePath))
            {
                return false;
            }

            try
            {
                // Convert relative path to absolute file system path
                var fullPath = Path.Combine(_environment.WebRootPath ?? "wwwroot", filePath.TrimStart('/'));
                
                // Check if file exists before attempting deletion
                if (File.Exists(fullPath))
                {
                    File.Delete(fullPath);
                    return true;
                }

                return false;  // File doesn't exist
            }
            catch (Exception)
            {
                // Return false if any error occurs during deletion
                // Could be permissions, file in use, etc.
                return false;
            }
        }

        /// <summary>
        /// Validates if uploaded file is a valid image file
        /// Checks file size, extension, and file signature (magic bytes) to prevent fake extensions
        /// </summary>
        /// <param name="file">The file to validate</param>
        /// <returns>True if file is a valid image, false otherwise</returns>
        public bool IsValidImageFile(IFormFile file)
        {
            // Check if file exists and has content
            if (file == null || file.Length == 0)
            {
                return false;
            }

            // Check file size limit (5MB)
            if (file.Length > MaxFileSize)
            {
                return false;
            }

            // Check file extension
            var extension = Path.GetExtension(file.FileName).ToLower();
            if (!AllowedExtensions.Contains(extension))
            {
                return false;
            }

            // Verify file signature (magic bytes) to prevent fake extensions
            // This checks the actual file content, not just the extension
            using (var stream = file.OpenReadStream())
            {
                var buffer = new byte[12];  // Read first 12 bytes to check file signature
                stream.ReadExactly(buffer, 0, 12);

                // Check for JPEG signature (FF D8)
                if (buffer[0] == 0xFF && buffer[1] == 0xD8)
                {
                    return extension == ".jpg" || extension == ".jpeg";
                }

                // Check for PNG signature (89 50 4E 47)
                if (buffer[0] == 0x89 && buffer[1] == 0x50 && buffer[2] == 0x4E && buffer[3] == 0x47)
                {
                    return extension == ".png";
                }

                // Check for GIF signature (47 49 46)
                if (buffer[0] == 0x47 && buffer[1] == 0x49 && buffer[2] == 0x46)
                {
                    return extension == ".gif";
                }

                // Check for WebP signature (RIFF....WEBP)
                if (buffer[0] == 0x52 && buffer[1] == 0x49 && buffer[2] == 0x46 && buffer[3] == 0x46 &&
                    buffer[8] == 0x57 && buffer[9] == 0x45 && buffer[10] == 0x42 && buffer[11] == 0x50)
                {
                    return extension == ".webp";
                }
            }

            // File signature doesn't match any allowed format
            return false;
        }
    }
}
