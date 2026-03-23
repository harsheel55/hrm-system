/*
 * BlogCategory.cs - Blog Category Entity Model
 * 
 * Represents a category for organizing blog posts.
 * Categories help group related content (e.g., Technology, Travel, Food).
 * Includes SEO metadata and display ordering.
 */

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    /// <summary>
    /// BlogCategory entity for organizing blog posts into categories
    /// Mapped to mstBlogCategory table in database
    /// </summary>
    [Table("mstBlogCategory")]
    public class BlogCategory
    {
        /// <summary>
        /// Unique identifier for the category (Primary Key)
        /// </summary>
        [Key]
        [Column("strCategoryGUID")]
        [MaxLength(36)]
        public string strCategoryGUID { get; set; } = Guid.NewGuid().ToString();

        /// <summary>
        /// Display name of the category
        /// Example: "Technology", "Travel", "Food & Recipes"
        /// </summary>
        [Column("strCategoryName")]
        [Required]
        [MaxLength(255)]
        public string strCategoryName { get; set; } = string.Empty;

        /// <summary>
        /// URL-friendly slug for the category
        /// Used in URLs (e.g., /category/technology)
        /// Must be unique
        /// </summary>
        [Column("strCategorySlug")]
        [Required]
        [MaxLength(255)]
        public string strCategorySlug { get; set; } = string.Empty;

        /// <summary>
        /// Description of the category
        /// Explains what content belongs in this category
        /// </summary>
        [Column("strCategoryDescription")]
        [MaxLength(1000)]
        public string? strCategoryDescription { get; set; }

        /// <summary>
        /// Path to category image/icon
        /// Visual representation of the category
        /// </summary>
        [Column("strCategoryImage")]
        [MaxLength(500)]
        public string? strCategoryImage { get; set; }

        /// <summary>
        /// SEO meta title for category pages
        /// </summary>
        [Column("strMetaTitle")]
        [MaxLength(255)]
        public string? strMetaTitle { get; set; }

        /// <summary>
        /// SEO meta description for category pages
        /// </summary>
        [Column("strMetaDescription")]
        [MaxLength(500)]
        public string? strMetaDescription { get; set; }

        /// <summary>
        /// SEO meta keywords for category pages
        /// </summary>
        [Column("strMetaKeywords")]
        [MaxLength(500)]
        public string? strMetaKeywords { get; set; }

        /// <summary>
        /// Display order for sorting categories
        /// Lower numbers appear first
        /// Default: 0
        /// </summary>
        [Column("intDisplayOrder")]
        public int intDisplayOrder { get; set; } = 0;

        /// <summary>
        /// Indicates if category is active
        /// Inactive categories are hidden from public view
        /// Default: true
        /// </summary>
        [Column("bolIsActive")]
        public bool bolIsActive { get; set; } = true;

        [Column("strCreatedByGUID")]
        [MaxLength(36)]
        public string? strCreatedByGUID { get; set; }

        [Column("dtCreatedOn")]
        public DateTime dtCreatedOn { get; set; } = DateTime.UtcNow;

        [Column("strUpdatedByGUID")]
        [MaxLength(36)]
        public string? strUpdatedByGUID { get; set; }

        [Column("dtUpdatedOn")]
        public DateTime? dtUpdatedOn { get; set; }

        // Navigation property
        public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();
    }
}
