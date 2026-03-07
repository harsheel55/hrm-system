import { useState, useEffect } from 'react';
import { roleService } from '../../services/role.service';
import type { UserRoleResponseDto, CreateUserRoleDto, UpdateUserRoleDto } from '../../types/api.types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Plus, Search, Pencil, Trash2, Shield, Loader2, Lock } from 'lucide-react';

export default function RoleManagementPage() {
  const [roles, setRoles] = useState<UserRoleResponseDto[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<UserRoleResponseDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRoleResponseDto | null>(null);
  const [deleteRole, setDeleteRole] = useState<UserRoleResponseDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateUserRoleDto | UpdateUserRoleDto>({
    strRoleName: '',
    strDescription: '',
    bolIsActive: true,
  });

  useEffect(() => {
    loadRoles();
  }, []);

  useEffect(() => {
    const filtered = roles.filter((role) =>
      role.strRoleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.strDescription?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [searchQuery, roles]);

  const loadRoles = async () => {
    setIsLoading(true);
    try {
      const response = await roleService.getAllRoles();
      setRoles(response.data);
      setFilteredRoles(response.data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = () => {
    setSelectedRole(null);
    setFormData({
      strRoleName: '',
      strDescription: '',
      bolIsActive: true,
    });
    setError(null);
    setIsFormOpen(true);
  };

  const handleEditRole = (role: UserRoleResponseDto) => {
    setSelectedRole(role);
    setFormData({
      strRoleName: role.strRoleName,
      strDescription: role.strDescription || '',
      bolIsActive: role.bolIsActive,
    });
    setError(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (role: UserRoleResponseDto) => {
    setDeleteRole(role);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteRole) return;

    setIsDeleting(true);
    try {
      await roleService.deleteRole(deleteRole.strUserRoleGUID);
      setRoles(roles.filter((r) => r.strUserRoleGUID !== deleteRole.strUserRoleGUID));
      setDeleteRole(null);
    } catch (error: any) {
      alert('Failed to delete role: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (selectedRole) {
        await roleService.updateRole(selectedRole.strUserRoleGUID, formData);
      } else {
        await roleService.createRole(formData as CreateUserRoleDto);
      }
      setIsFormOpen(false);
      loadRoles();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold text-foreground">Role Management</h1>
          <p className="text-muted-foreground mt-1">Manage user roles and permissions</p>
        </div>
        <Button onClick={handleAddRole} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            All Roles
          </CardTitle>
          <CardDescription>Total: {roles.length} roles</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>System Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No roles found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.strUserRoleGUID}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-purple-600" />
                          {role.strRoleName}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {role.strDescription || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={role.bolIsActive ? 'default' : 'secondary'}
                          className={
                            role.bolIsActive
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-muted text-muted-foreground border-border'
                          }
                        >
                          {role.bolIsActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {role.bolSystemCreated && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            <Lock className="h-3 w-3 mr-1" />
                            System
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(role.dtCreatedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditRole(role)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!role.bolSystemCreated && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(role)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Role Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
            <DialogDescription>
              {selectedRole ? 'Update role information' : 'Create a new user role'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="strRoleName">Role Name *</Label>
              <Input
                id="strRoleName"
                value={formData.strRoleName}
                onChange={(e) => setFormData({ ...formData, strRoleName: e.target.value })}
                placeholder="e.g., Administrator, Manager"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="strDescription">Description</Label>
              <Textarea
                id="strDescription"
                value={formData.strDescription}
                onChange={(e) => setFormData({ ...formData, strDescription: e.target.value })}
                placeholder="Brief description of the role..."
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="bolIsActive"
                checked={formData.bolIsActive}
                onCheckedChange={(checked) => setFormData({ ...formData, bolIsActive: checked })}
                disabled={isSubmitting}
              />
              <Label htmlFor="bolIsActive">Active Role</Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {selectedRole ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>{selectedRole ? 'Update Role' : 'Create Role'}</>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRole} onOpenChange={() => setDeleteRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the role <strong>{deleteRole?.strRoleName}</strong>.
              This action cannot be undone and might affect users with this role.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
