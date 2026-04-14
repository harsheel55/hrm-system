import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { userService } from '../../services/user.service';
import type { UserResponseDto, UserRoleResponseDto } from '../../types/api.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Loader2 } from 'lucide-react';

const userSchema = z.object({
  strUserName: z.string().min(1, 'Name is required'),
  strEmail: z.string().email('Invalid email address'),
  strPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
  strPhoneNo: z.string().optional(),
  dDob: z.string().optional(),
  strRoleGUID: z.string().optional(),
  strPreferredLanguage: z.string().optional(),
  bolIsActive: z.boolean().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponseDto | null;
  roles: UserRoleResponseDto[];
  onSuccess: () => void;
}

export default function UserFormDialog({
  open,
  onOpenChange,
  user,
  roles,
  onSuccess,
}: UserFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const roleMap = new Map<string, UserRoleResponseDto>();
  roles
    .filter((role) => role.strRoleName === 'HR' || role.strRoleName === 'Employee')
    .forEach((role) => {
      const key = role.strRoleName.trim().toLowerCase();
      if (!roleMap.has(key)) {
        roleMap.set(key, role);
      }
    });
  const allowedRoles = Array.from(roleMap.values());

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      strUserName: '',
      strEmail: '',
      strPassword: '',
      strPhoneNo: '',
      strPreferredLanguage: 'en',
      bolIsActive: true,
    },
  });

  const selectedRole = watch('strRoleGUID');
  const isActive = watch('bolIsActive');

  useEffect(() => {
    if (user) {
      reset({
        strUserName: user.strUserName,
        strEmail: user.strEmail,
        strPhoneNo: user.strPhoneNo || '',
        dDob: user.dDob?.split('T')[0] || '',
        strRoleGUID: user.strRoleGUID || '',
        strPreferredLanguage: user.strPreferredLanguage || 'en',
        bolIsActive: user.bolIsActive,
      });
    } else {
      reset({
        strUserName: '',
        strEmail: '',
        strPassword: '',
        strPhoneNo: '',
        dDob: '',
        strRoleGUID: '',
        strPreferredLanguage: 'en',
        bolIsActive: true,
      });
    }
    setProfileImage(null);
    setError(null);
  }, [user, reset, open]);

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (user) {
        // Update existing user
        await userService.updateUser(user.strUserGUID, {
          strUserName: data.strUserName,
          strEmail: data.strEmail,
          strPhoneNo: data.strPhoneNo,
          dDob: data.dDob,
          strRoleGUID: data.strRoleGUID,
          strPreferredLanguage: data.strPreferredLanguage,
          bolIsActive: data.bolIsActive ?? true,
          strProfileImage: profileImage || undefined,
        });
      } else {
        // Create new user
        if (!data.strPassword) {
          setError('Password is required for new users');
          setIsSubmitting(false);
          return;
        }

        await userService.createUser({
          strUserName: data.strUserName,
          strEmail: data.strEmail,
          strPassword: data.strPassword,
          strPhoneNo: data.strPhoneNo,
          dDob: data.dDob,
          strRoleGUID: data.strRoleGUID,
          strPreferredLanguage: data.strPreferredLanguage,
          strProfileImage: profileImage || undefined,
        });
      }

      onSuccess();
    } catch (err: any) {
      console.error('Form submission error:', err);
      const errorMessage = err?.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Update user information and permissions'
              : 'Create a new user account with role assignment'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strUserName">Full Name *</Label>
              <Input
                id="strUserName"
                {...register('strUserName')}
                placeholder="John Doe"
                disabled={isSubmitting}
              />
              {errors.strUserName && (
                <p className="text-sm text-red-500">{errors.strUserName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="strEmail">Email *</Label>
              <Input
                id="strEmail"
                type="email"
                {...register('strEmail')}
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
              {errors.strEmail && (
                <p className="text-sm text-red-500">{errors.strEmail.message}</p>
              )}
            </div>
          </div>

          {!user && (
            <div className="space-y-2">
              <Label htmlFor="strPassword">Password *</Label>
              <Input
                id="strPassword"
                type="password"
                {...register('strPassword')}
                placeholder="Minimum 6 characters"
                disabled={isSubmitting}
              />
              {errors.strPassword && (
                <p className="text-sm text-red-500">{errors.strPassword.message}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strPhoneNo">Phone Number</Label>
              <Input
                id="strPhoneNo"
                {...register('strPhoneNo')}
                placeholder="+1234567890"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dDob">Date of Birth</Label>
              <Input
                id="dDob"
                type="date"
                {...register('dDob')}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="strRoleGUID">Role</Label>
              {allowedRoles.length > 0 ? (
                <Select
                  value={selectedRole || ''}
                  onValueChange={(value) => setValue('strRoleGUID', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="strRoleGUID">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedRoles.map((role) => (
                      <SelectItem key={role.strUserRoleGUID} value={role.strUserRoleGUID}>
                        {role.strRoleName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="w-full p-2 border rounded bg-gray-50 text-gray-500 text-sm">
                  No roles available. Create roles in Role Management first.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="strPreferredLanguage">Preferred Language</Label>
              <Select
                value={watch('strPreferredLanguage') || 'en'}
                onValueChange={(value) => setValue('strPreferredLanguage', value)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="strPreferredLanguage">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strProfileImage">Profile Image</Label>
            <Input
              id="strProfileImage"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSubmitting}
            />
            {profileImage && (
              <p className="text-sm text-gray-600">Selected: {profileImage.name}</p>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-2">
              <Switch
                id="bolIsActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue('bolIsActive', checked)}
                disabled={isSubmitting}
              />
              <Label htmlFor="bolIsActive">Active User</Label>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {user ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{user ? 'Update User' : 'Create User'}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
