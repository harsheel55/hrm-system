/*
 * UserRole.cs - User Role Entity Model
 * 
 * Represents a role/permission group in the system.
 * Users are assigned roles which determine their access level and permissions.
 * Examples: SuperAdmin, Admin, Editor, Viewer
 */

using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// UserRole entity representing a role/permission group
    /// Roles are assigned to users to control access and permissions
    /// </summary>
    public class UserRole
    {
        /// <summary>
        /// Unique identifier for the role (Primary Key)
        /// </summary>
        [Key]
        public Guid strUserRoleGUID { get; set; }
        
        /// <summary>
        /// Display name of the role
        /// Example: "Super Admin", "Administrator", "Editor"
        /// </summary>
        public string strRoleName { get; set; } = string.Empty;
        
        /// <summary>
        /// Description of the role's purpose and permissions
        /// </summary>
        public string strDesc { get; set; } = string.Empty;
        
        /// <summary>
        /// Indicates if the role is active
        /// Inactive roles cannot be assigned to users
        /// Default: true
        /// </summary>
        public bool bolIsActive { get; set; } = true;
        
        /// <summary>
        /// Indicates if this role was created by the system (bootstrap/seed data)
        /// System-created roles (like SuperAdmin) cannot be deleted
        /// Default: false
        /// </summary>
        public bool bolSystemCreated { get; set; } = false;
        
        /// <summary>
        /// GUID of the user who created this role
        /// For audit trail purposes
        /// </summary>
        public Guid? strCreatedByGUID { get; set; }
        
        /// <summary>
        /// Timestamp when this role was created
        /// Default: Current UTC time
        /// </summary>
        public DateTime dtCreatedOn { get; set; } = DateTime.UtcNow;
        
        /// <summary>
        /// GUID of the user who last updated this role
        /// For audit trail purposes
        /// </summary>
        public Guid? strUpdatedByGUID { get; set; }
        
        /// <summary>
        /// Timestamp when this role was last updated
        /// Default: Current UTC time
        /// </summary>
        public DateTime dtUpdatedOn { get; set; } = DateTime.UtcNow;
    }
}
