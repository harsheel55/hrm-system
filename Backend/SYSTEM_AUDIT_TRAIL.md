# System Created Records - Audit Trail Pattern

## Overview
Records created by the system during initialization have special `strCreatedByGUID` and `strUpdatedByGUID` values to distinguish them from user-created records.

## System User GUID
**GUID**: `11111111-1111-1111-1111-111111111111`

This special GUID represents "SYSTEM" and is used for:
- System-created roles (Admin, SuperAdmin)
- System-created menus (User, Menu, UserRole, UserRights)
- Initial bootstrap data
- Automated system processes

## Implementation

### Constants
Located in `Backend/Common/SystemConstants.cs`:
```csharp
public static readonly Guid SYSTEM_USER_GUID = new Guid("11111111-1111-1111-1111-111111111111");
public static readonly Guid SUPERADMIN_ROLE_GUID = new Guid("22222222-2222-2222-2222-222222222222");
public static readonly Guid ADMIN_ROLE_GUID = new Guid("97cef90c-2c9f-4535-9a8c-f8f5894cfad3");
```

### Usage in Services

**UserRoleService** - When creating system roles:
```csharp
var role = new UserRole
{
    ...
    bolSystemCreated = true,
    strCreatedByGUID = SystemConstants.SYSTEM_USER_GUID,
    strUpdatedByGUID = SystemConstants.SYSTEM_USER_GUID,
    ...
};
```

**UserService** - When creating initial admin users:
```csharp
var user = new User
{
    ...
    bolSystemCreated = true,
    strCreatedByGUID = SystemConstants.SYSTEM_USER_GUID,
    ...
};
```

**MenuService** - System menus are created with:
```csharp
await EnsureSystemMenusAsync(SystemConstants.SYSTEM_USER_GUID);
```

### Database Updates
System-created roles have been updated:
```sql
-- System-created roles
UPDATE mstUserRole
SET strCreatedByGUID = '11111111-1111-1111-1111-111111111111',
    strUpdatedByGUID = '11111111-1111-1111-1111-111111111111'
WHERE bolSystemCreated = 1;
```

## Benefits

1. **Clear Audit Trail**: Distinguish between system-generated and user-created records
2. **System Integrity**: Identify critical system records that should not be deleted
3. **Traceability**: Know which records were created during bootstrap vs. normal operations
4. **Compliance**: Meet audit requirements for tracking record origins

## Tables Affected

- ✅ `mstUserRole` - Has `bolSystemCreated`, `strCreatedByGUID`, `strUpdatedByGUID`
- ✅ `mstUser` - Has `bolSystemCreated`, `strCreatedByGUID`, `strUpdatedByGUID`
- ✅ `mstMenu` - Has `strCreatedByGUID`, `strUpdatedByGUID` (no bolSystemCreated yet)

## Future Enhancements

Consider adding `bolSystemCreated` to `mstMenu` table to also flag system menus.
