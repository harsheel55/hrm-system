/*
 * BlogTag.cs - Blog Tag Entity Model
 * 
 * Represents a tag for labeling and categorizing blog posts.
 * Tags provide flexible, multi-dimensional organization (unlike categories).
 * Multiple tags can be assigned to a single blog post.
 */

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    /// <summary>
    /// BlogTag entity for tagging/labeling blog posts
    /// Mapped to mstBlogTag table in database
    /// </summary>
    [Table("mstBlogTag")]
    public class BlogTag
    {
        /// <summary>
        /// Unique identifier for the tag (Primary Key)
        /// </summary>
        [Key]
        [Column("strTagGUID")]
        [MaxLength(36)]
        public string strTagGUID { get; set; } = Guid.NewGuid().ToString();

        /// <summary>
        /// Display name of the tag
        /// Example: "C#", "Tutorial", "Beginner Friendly"
        /// </summary>
        [Column("strTagName")]
        [Required]
        [MaxLength(100)]
        public string strTagName { get; set; } = string.Empty;

        /// <summary>
        /// URL-friendly slug for the tag
        /// Used in URLs (e.g., /tag/csharp-tutorial)
        /// Must be unique
        /// </summary>
        [Column("strTagSlug")]
        [Required]
        [MaxLength(100)]
        public string strTagSlug { get; set; } = string.Empty;

        /// <summary>
        /// Indicates if tag is active
        /// Inactive tags cannot be assigned to new posts
        /// Default: true
        /// </summary>
        [Column("bolIsActive")]
        public bool bolIsActive { get; set; } = true;

        /// <summary>
        /// GUID of the user who created this tag
        /// For audit trail purposes
        /// </summary>
        [Column("strCreatedByGUID")]
        [MaxLength(36)]
        public string? strCreatedByGUID { get; set; }

        /// <summary>
        /// Timestamp when tag was created
        /// Default: Current UTC time
        /// </summary>
        [Column("dtCreatedOn")]
        public DateTime dtCreatedOn { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// GUID of the user who last updated this tag
        /// For audit trail purposes
        /// </summary>
        [Column("strUpdatedByGUID")]
        [MaxLength(36)]
        public string? strUpdatedByGUID { get; set; }

        /// <summary>
        /// Timestamp when tag was last updated
        /// </summary>
        [Column("dtUpdatedOn")]
        public DateTime? dtUpdatedOn { get; set; }
    }
}
