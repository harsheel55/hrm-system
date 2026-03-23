/*
 * BlogDtos.cs - Data Transfer Objects for Blog Operations
 * 
 * Contains DTOs for blog post CRUD operations and responses.
 * Includes support for file uploads (featured images) and SEO metadata.
 * Separate DTOs for create, update, and response operations.
 */

using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Backend.DTOs
{
    // === BLOG DTOs ===
    
    /// <summary>
    /// DTO for creating a new blog post
    /// Supports featured image upload and full blog metadata
    /// </summary>
    public class CreateBlogDto
    {
        /// <summary>
        /// GUID of the category to assign (optional)
        /// </summary>
        public string? strCategoryGUID { get; set; }

        /// <summary>
        /// URL-friendly slug for the blog post
        /// Used in URLs (must be unique)
        /// Required field
        /// </summary>
        [Required]
        [MaxLength(255)]
        public string strBlogSlug { get; set; } = string.Empty;

        /// <summary>
        /// Display title of the blog post
        /// Required field
        /// </summary>
        [Required]
        [MaxLength(500)]
        public string strBlogTitle { get; set; } = string.Empty;

        /// <summary>
        /// Short summary/excerpt (optional)
        /// Displayed in blog listings
        /// </summary>
        [MaxLength(1000)]
        public string? strShortDescription { get; set; }

        /// <summary>
        /// Full HTML content of the blog post (optional)
        /// </summary>
        public string? strFullContent { get; set; }

        /// <summary>
        /// Featured/cover image file upload (optional)
        /// Accepted formats: JPG, PNG, GIF, WebP (max 5MB)
        /// </summary>
        public IFormFile? strFeaturedImage { get; set; }

        /// <summary>
        /// SEO meta title (optional)
        /// </summary>
        [MaxLength(255)]
        public string? strMetaTitle { get; set; }

        /// <summary>
        /// SEO meta description (optional)
        /// </summary>
        [MaxLength(500)]
        public string? strMetaDescription { get; set; }

        /// <summary>
        /// SEO meta keywords (optional)
        /// </summary>
        [MaxLength(500)]
        public string? strMetaKeywords { get; set; }

        /// <summary>
        /// Scheduled publish date (optional)
        /// </summary>
        public DateTime? dtPublishDate { get; set; }

        /// <summary>
        /// Whether blog post is published
        /// Default: false (draft state)
        /// </summary>
        public bool bolIsPublished { get; set; } = false;

        /// <summary>
        /// Whether blog post is featured
        /// Default: false
        /// </summary>
        public bool bolIsFeatured { get; set; } = false;

        /// <summary>
        /// Whether blog post is active
        /// Default: true
        /// </summary>
        public bool bolIsActive { get; set; } = true;
    }

    /// <summary>
    /// DTO for updating an existing blog post
    /// All fields are optional - only provided fields will be updated
    /// </summary>
    public class UpdateBlogDto
    {
        public string? strCategoryGUID { get; set; }

        [MaxLength(255)]
        public string? strBlogSlug { get; set; }

        [MaxLength(500)]
        public string? strBlogTitle { get; set; }

        [MaxLength(1000)]
        public string? strShortDescription { get; set; }

        public string? strFullContent { get; set; }

        public IFormFile? strFeaturedImage { get; set; }

        [MaxLength(255)]
        public string? strMetaTitle { get; set; }

        [MaxLength(500)]
        public string? strMetaDescription { get; set; }

        [MaxLength(500)]
        public string? strMetaKeywords { get; set; }

        public DateTime? dtPublishDate { get; set; }

        public bool? bolIsPublished { get; set; }

        public bool? bolIsFeatured { get; set; }

        public bool? bolIsActive { get; set; }
    }

    public class BlogResponseDto
    {
        public string strBlogGUID { get; set; } = string.Empty;
        public string? strCategoryGUID { get; set; }
        public string? strCategoryName { get; set; }
        public string strBlogSlug { get; set; } = string.Empty;
        public string strBlogTitle { get; set; } = string.Empty;
        public string? strShortDescription { get; set; }
        public string? strFullContent { get; set; }
        public string? strFeaturedImage { get; set; }
        public string? strMetaTitle { get; set; }
        public string? strMetaDescription { get; set; }
        public string? strMetaKeywords { get; set; }
        public DateTime? dtPublishDate { get; set; }
        public bool bolIsPublished { get; set; }
        public bool bolIsFeatured { get; set; }
        public bool bolIsActive { get; set; }
        public string? strCreatedByGUID { get; set; }
        public DateTime dtCreatedOn { get; set; }
        public string? strUpdatedByGUID { get; set; }
        public DateTime? dtUpdatedOn { get; set; }
    }

    // Blog Category DTOs
    public class CreateBlogCategoryDto
    {
        [Required]
        [MaxLength(255)]
        public string strCategoryName { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string strCategorySlug { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? strCategoryDescription { get; set; }

        public IFormFile? strCategoryImage { get; set; }

        [MaxLength(255)]
        public string? strMetaTitle { get; set; }

        [MaxLength(500)]
        public string? strMetaDescription { get; set; }

        [MaxLength(500)]
        public string? strMetaKeywords { get; set; }

        public int intDisplayOrder { get; set; } = 0;

        public bool bolIsActive { get; set; } = true;
    }

    public class UpdateBlogCategoryDto
    {
        [MaxLength(255)]
        public string? strCategoryName { get; set; }

        [MaxLength(255)]
        public string? strCategorySlug { get; set; }

        [MaxLength(1000)]
        public string? strCategoryDescription { get; set; }

        public IFormFile? strCategoryImage { get; set; }

        [MaxLength(255)]
        public string? strMetaTitle { get; set; }

        [MaxLength(500)]
        public string? strMetaDescription { get; set; }

        [MaxLength(500)]
        public string? strMetaKeywords { get; set; }

        public int? intDisplayOrder { get; set; }

        public bool? bolIsActive { get; set; }
    }

    public class BlogCategoryResponseDto
    {
        public string strCategoryGUID { get; set; } = string.Empty;
        public string strCategoryName { get; set; } = string.Empty;
        public string strCategorySlug { get; set; } = string.Empty;
        public string? strCategoryDescription { get; set; }
        public string? strCategoryImage { get; set; }
        public string? strMetaTitle { get; set; }
        public string? strMetaDescription { get; set; }
        public string? strMetaKeywords { get; set; }
        public int intDisplayOrder { get; set; }
        public bool bolIsActive { get; set; }
        public string? strCreatedByGUID { get; set; }
        public DateTime dtCreatedOn { get; set; }
        public string? strUpdatedByGUID { get; set; }
        public DateTime? dtUpdatedOn { get; set; }
    }

    // Blog Tag DTOs
    public class CreateBlogTagDto
    {
        [Required]
        [MaxLength(100)]
        public string strTagName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string strTagSlug { get; set; } = string.Empty;

        public bool bolIsActive { get; set; } = true;
    }

    public class UpdateBlogTagDto
    {
        [MaxLength(100)]
        public string? strTagName { get; set; }

        [MaxLength(100)]
        public string? strTagSlug { get; set; }

        public bool? bolIsActive { get; set; }
    }

    public class BlogTagResponseDto
    {
        public string strTagGUID { get; set; } = string.Empty;
        public string strTagName { get; set; } = string.Empty;
        public string strTagSlug { get; set; } = string.Empty;
        public bool bolIsActive { get; set; }
        public string? strCreatedByGUID { get; set; }
        public DateTime dtCreatedOn { get; set; }
        public string? strUpdatedByGUID { get; set; }
        public DateTime? dtUpdatedOn { get; set; }
    }
}
