import { useState, useEffect } from 'react';
import { rightsService } from '../../services/rights.service';
import { roleService } from '../../services/role.service';
import { menuService } from '../../services/menu.service';
import type {
  UserRoleResponseDto,
  MenuResponseDto,
} from '../../types/api.types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Lock, Loader2, Save, Eye, Plus, Edit, Trash } from 'lucide-react';

interface RightPermission {
  menuGUID: string;
  menuName: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  existingRightGUID?: string;
}

export default function UserRightsPage() {
  const [roles, setRoles] = useState<UserRoleResponseDto[]>([]);
  const [menus, setMenus] = useState<MenuResponseDto[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [permissions, setPermissions] = useState<RightPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedRoleId && menus.length > 0) {
      loadRightsForRole(selectedRoleId);
    }
  }, [selectedRoleId, menus]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rolesResponse, menusResponse] = await Promise.all([
        roleService.getAllRoles(),
        menuService.getAllMenus(),
      ]);
      setRoles(rolesResponse.data.filter(r => r.bolIsActive));
      setMenus(menusResponse.data.filter(m => m.bolIsActive));
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRightsForRole = async (roleId: string) => {
    try {
      const response = await rightsService.getRightsByRole(roleId);
      const existingRights = response.data;

      const permissionsMap: { [key: string]: RightPermission } = {};
      
      existingRights.forEach((right) => {
        if (right.strMenuGUID) {
          permissionsMap[right.strMenuGUID] = {
            menuGUID: right.strMenuGUID,
            menuName: right.strMenuName || '',
            canView: right.bolCanView,
            canCreate: right.bolCanCreate,
            canEdit: right.bolCanEdit,
            canDelete: right.bolCanDelete,
            existingRightGUID: right.strUserRightGUID,
          };
        }
      });

      const allPermissions = menus.map((menu) => {
        if (permissionsMap[menu.strMenuGUID]) {
          return permissionsMap[menu.strMenuGUID];
        }
        return {
          menuGUID: menu.strMenuGUID,
          menuName: menu.strMenuName,
          canView: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
        };
      });

      setPermissions(allPermissions);
    } catch (error) {
      console.error('Failed to load rights:', error);
    }
  };

  const updatePermission = (menuGUID: string, field: keyof RightPermission, value: boolean) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.menuGUID === menuGUID) {
          const updated = { ...p, [field]: value };
          // Auto-enable view when enabling any other permission
          if (field !== 'canView' && value && !p.canView) {
            updated.canView = true;
          }
          return updated;
        }
        return p;
      })
    );
  };

  const handleSaveAll = async () => {
    if (!selectedRoleId) return;

    setIsSaving(true);
    try {
      // Save each permission
      await Promise.all(
        permissions.map(async (perm) => {
          const hasAnyPermission = perm.canView || perm.canCreate || perm.canEdit || perm.canDelete;
          
          if (hasAnyPermission) {
            if (perm.existingRightGUID) {
              // Update existing right
              await rightsService.updateRight(perm.existingRightGUID, {
                bolCanView: perm.canView,
                bolCanCreate: perm.canCreate,
                bolCanEdit: perm.canEdit,
                bolCanDelete: perm.canDelete,
              });
            } else {
              // Create new right
              await rightsService.createRight({
                strUserRoleGUID: selectedRoleId,
                strMenuGUID: perm.menuGUID,
                bolCanView: perm.canView,
                bolCanCreate: perm.canCreate,
                bolCanEdit: perm.canEdit,
                bolCanDelete: perm.canDelete,
              });
            }
          } else if (perm.existingRightGUID) {
            // Delete right if all permissions are false
            await rightsService.deleteRight(perm.existingRightGUID);
          }
        })
      );
      
      // Reload to reflect changes
      await loadRightsForRole(selectedRoleId);
      alert('Permissions saved successfully');
    } catch (error: any) {
      alert('Failed to save permissions: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Rights Management</h1>
          <p className="text-muted-foreground mt-1">Configure role-based menu permissions</p>
        </div>
        {selectedRoleId && (
          <Button onClick={handleSaveAll} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save All Permissions
              </>
            )}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Role Permissions
          </CardTitle>
          <CardDescription>Select a role to configure its menu access permissions</CardDescription>
          <div className="mt-4">
            <Label>Select Role</Label>
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a role..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.strUserRoleGUID} value={role.strUserRoleGUID}>
                    {role.strRoleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!selectedRoleId ? (
            <div className="text-center py-12 text-muted-foreground">
              <Lock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>Select a role to manage permissions</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Menu Item</TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4" />
                        View
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Edit className="h-4 w-4" />
                        Edit
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Trash className="h-4 w-4" />
                        Delete
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((perm) => (
                    <TableRow key={perm.menuGUID}>
                      <TableCell className="font-medium">{perm.menuName}</TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={perm.canView}
                          onCheckedChange={(checked) =>
                            updatePermission(perm.menuGUID, 'canView', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={perm.canCreate}
                          onCheckedChange={(checked) =>
                            updatePermission(perm.menuGUID, 'canCreate', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={perm.canEdit}
                          onCheckedChange={(checked) =>
                            updatePermission(perm.menuGUID, 'canEdit', checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Checkbox
                          checked={perm.canDelete}
                          onCheckedChange={(checked) =>
                            updatePermission(perm.menuGUID, 'canDelete', checked as boolean)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
