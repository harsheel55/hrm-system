using System;

namespace Backend.DTOs
{
    /// <summary>
    /// DTO for creating a new menu item
    /// Contains only writable fields (excludes audit fields and GUID)
    /// </summary>
    public class CreateMenuDto
    {
        // Parent menu GUID (null if this is a root menu)
        public Guid? strParentMenuGUID { get; set; }

        // Menu display name (required)
        public string strMenuName { get; set; } = string.Empty;

        // Sequence number for ordering menus
        public double dblSeqNo { get; set; }

        // URL/Route for navigation
        public string strPath { get; set; } = string.Empty;

        // Key identifier for menu mapping
        public string strMapKey { get; set; } = string.Empty;

        // Menu position (TOP_NAV, SIDEBAR, etc.)
        public string strMenuPositions { get; set; } = string.Empty;

        // Does this menu have children?
        public bool bolHasSubMenu { get; set; }

        // Icon name for UI
        public string strIconName { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for updating an existing menu item
    /// All fields are optional (partial update pattern)
    /// </summary>
    public class UpdateMenuDto
    {
        // Optional: Update parent menu
        public Guid? strParentMenuGUID { get; set; }

        // Optional: Update menu name
        public string? strMenuName { get; set; }

        // Optional: Update sequence order
        public double? dblSeqNo { get; set; }

        // Optional: Update navigation path
        public string? strPath { get; set; }

        // Optional: Update map key
        public string? strMapKey { get; set; }

        // Optional: Update menu position
        public string? strMenuPositions { get; set; }

        // Optional: Update submenu flag
        public bool? bolHasSubMenu { get; set; }

        // Optional: Update icon
        public string? strIconName { get; set; }

        // Optional: Enable/disable menu
        public bool? bolIsActive { get; set; }
    }

    /// <summary>
    /// DTO for menu response (returned from API)
    /// Contains all readable fields including audit trail
    /// </summary>
    public class MenuResponseDto
    {
        // Menu unique identifier
        public Guid strMenuGUID { get; set; }

        // Parent menu GUID
        public Guid? strParentMenuGUID { get; set; }

        // Menu name
        public string strMenuName { get; set; } = string.Empty;

        // Sequence number for ordering
        public double dblSeqNo { get; set; }

        // Navigation path
        public string strPath { get; set; } = string.Empty;

        // Map key identifier
        public string strMapKey { get; set; } = string.Empty;

        // Menu position
        public string strMenuPositions { get; set; } = string.Empty;

        // Has submenu flag
        public bool bolHasSubMenu { get; set; }

        // Icon name
        public string strIconName { get; set; } = string.Empty;

        // Is active flag
        public bool bolIsActive { get; set; }

        // Audit: Created by GUID
        public Guid? strCreatedByGUID { get; set; }

        // Audit: Created on timestamp
        public DateTime dtCreatedOn { get; set; }

        // Audit: Updated by GUID
        public Guid? strUpdatedByGUID { get; set; }

        // Audit: Updated on timestamp
        public DateTime dtUpdateOn { get; set; }
    }
}
