using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    /// <summary>
    /// Menu entity representing application menu items
    /// Supports hierarchical menus (parent-child relationships)
    /// Tracks menu sequence, permissions, and UI configuration
    /// </summary>
    public class Menu
    {
        // Primary Key: Unique identifier for each menu item
        [Key]
        public Guid strMenuGUID { get; set; }

        // Foreign Key: Parent menu GUID (for hierarchical menu structure, null if root menu)
        public Guid? strParentMenuGUID { get; set; }

        // Menu display name (e.g., "User Management", "Dashboard", "Settings")
        public string strMenuName { get; set; } = string.Empty;

        // Sequence number for menu ordering (lower number = higher priority, displayed first)
        public double dblSeqNo { get; set; }

        // URL/Route path for navigation (e.g., "/user", "/dashboard", "/settings/profile")
        public string strPath { get; set; } = string.Empty;

        // Key identifier for menu mapping and references (e.g., "USER_MGMT", "DASHBOARD")
        public string strMapKey { get; set; } = string.Empty;

        // Menu position identifier (e.g., "TOP_NAV", "SIDEBAR", "FOOTER")
        public string strMenuPositions { get; set; } = string.Empty;

        // Flag: Does this menu have sub-menus? (for UI expansion indicators)
        public bool bolHasSubMenu { get; set; }

        // Icon name for UI display (e.g., "fa-users", "fa-dashboard", "fa-cog")
        public string strIconName { get; set; } = string.Empty;

        // Flag: Is this menu visible and active? (enable/disable without deleting)
        public bool bolIsActive { get; set; }

        // Audit: GUID of user who created this menu item
        public Guid? strCreatedByGUID { get; set; }

        // Audit: Timestamp when menu item was created
        public DateTime dtCreatedOn { get; set; }

        // Audit: GUID of user who last updated this menu item
        public Guid? strUpdatedByGUID { get; set; }

        // Audit: Timestamp when menu item was last updated
        public DateTime dtUpdateOn { get; set; }
    }
}
