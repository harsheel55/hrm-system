/*
 * Blog.cs - Blog Post Entity Model
 * 
 * Represents a blog post/article in the content management system.
 * Includes SEO metadata, categorization, publishing workflow, and featured status.
 * Supports rich content with featured images and category relationships.
 */

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    /// <summary>
    /// Blog entity representing a blog post/article
    /// Mapped to mstBlog table in database
    /// </summary>
    [Table("mstBlog")]
    public class Blog
    {
        /// <summary>
        /// Unique identifier for the blog post (Primary Key)
        /// </summary>
        [Key]
        [Column("strBlogGUID")]
        [MaxLength(36)]
        public string strBlogGUID { get; set; } = Guid.NewGuid().ToString();

        /// <summary>
        /// Foreign key to BlogCategory
        /// Categorizes the blog post (e.g., Technology, Travel, Food)
        /// </summary>
        [Column("strCategoryGUID")]
        [MaxLength(36)]
        public string? strCategoryGUID { get; set; }

        /// <summary>
        /// URL-friendly slug for the blog post
        /// Used in URLs (e.g., /blog/my-first-post)
        /// Must be unique
        /// </summary>
        [Column("strBlogSlug")]
        [Required]
        [MaxLength(255)]
        public string strBlogSlug { get; set; } = string.Empty;

        /// <summary>
        /// Display title of the blog post
        /// </summary>
        [Column("strBlogTitle")]
        [Required]
        [MaxLength(500)]
        public string strBlogTitle { get; set; } = string.Empty;

        /// <summary>
        /// Short summary/excerpt of the blog post
        /// Displayed in listings and previews
        /// </summary>
        [Column("strShortDescription")]
        [MaxLength(1000)]
        public string? strShortDescription { get; set; }

        /// <summary>
        /// Full HTML content of the blog post
        /// Supports rich text formatting
        /// </summary>
        [Column("strFullContent")]
        public string? strFullContent { get; set; }

        /// <summary>
        /// Path to featured/cover image
        /// Displayed at top of blog post and in listings
        /// </summary>
        [Column("strFeaturedImage")]
        [MaxLength(500)]
        public string? strFeaturedImage { get; set; }

        /// <summary>
        /// SEO meta title for search engines
        /// Shown in browser tab and search results
        /// </summary>
        [Column("strMetaTitle")]
        [MaxLength(255)]
        public string? strMetaTitle { get; set; }

        /// <summary>
        /// SEO meta description for search engines
        /// Shown in search result snippets
        /// </summary>
        [Column("strMetaDescription")]
        [MaxLength(500)]
        public string? strMetaDescription { get; set; }

        /// <summary>
        /// SEO meta keywords for search optimization
        /// Comma-separated keywords
        /// </summary>
        [Column("strMetaKeywords")]
        [MaxLength(500)]
        public string? strMetaKeywords { get; set; }

        /// <summary>
        /// Date and time when blog post should be/was published
        /// Can be set for scheduled publishing
        /// </summary>
        [Column("dtPublishDate")]
        public DateTime? dtPublishDate { get; set; }

        /// <summary>
        /// Indicates if blog post is published and visible to public
        /// Unpublished posts are in draft state
        /// Default: false
        /// </summary>
        [Column("bolIsPublished")]
        public bool bolIsPublished { get; set; } = false;

        /// <summary>
        /// Indicates if blog post is featured
        /// Featured posts may appear in special sections or highlighted areas
        /// Default: false
        /// </summary>
        [Column("bolIsFeatured")]
        public bool bolIsFeatured { get; set; } = false;

        /// <summary>
        /// Indicates if blog post is active
        /// Inactive posts are hidden from public view
        /// Default: true
        /// </summary>
        [Column("bolIsActive")]
        public bool bolIsActive { get; set; } = true;

        /// <summary>
        /// GUID of the user who created this blog post
        /// For audit trail and author attribution
        /// </summary>
        [Column("strCreatedByGUID")]
        [MaxLength(36)]
        public string? strCreatedByGUID { get; set; }

        /// <summary>
        /// Timestamp when blog post was created
        /// Default: Current UTC time
        /// </summary>
        [Column("dtCreatedOn")]
        public DateTime dtCreatedOn { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// GUID of the user who last updated this blog post
        /// For audit trail purposes
        /// </summary>
        [Column("strUpdatedByGUID")]
        [MaxLength(36)]
        public string? strUpdatedByGUID { get; set; }

        /// <summary>
        /// Timestamp when blog post was last updated
        /// </summary>
        [Column("dtUpdatedOn")]
        public DateTime? dtUpdatedOn { get; set; }

        /// <summary>
        /// Navigation property to related BlogCategory entity
        /// Enables easy access to category information
        /// </summary>
        public virtual BlogCategory? Category { get; set; }
    }
}
