using System;

namespace Backend.Common
{
    /// <summary>
    /// System-wide constants for the application
    /// </summary>
    public static class SystemConstants
    {
        /// <summary>
        /// Special GUID representing "SYSTEM" for records created/updated by the system itself
        /// Used for system-created roles, initial admin users, and other bootstrap data
        /// This distinguishes system-generated records from user-created ones
        /// </summary>
        public static readonly Guid SYSTEM_USER_GUID = new Guid("11111111-1111-1111-1111-111111111111");

        /// <summary>
        /// SuperAdmin Role GUID (fixed for system consistency)
        /// </summary>
        public static readonly Guid SUPERADMIN_ROLE_GUID = new Guid("22222222-2222-2222-2222-222222222222");

        /// <summary>
        /// Admin Role GUID (fixed for system consistency)
        /// </summary>
        public static readonly Guid ADMIN_ROLE_GUID = new Guid("97cef90c-2c9f-4535-9a8c-f8f5894cfad3");
    }
}
