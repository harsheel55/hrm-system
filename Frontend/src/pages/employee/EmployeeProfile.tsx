import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Phone, Building2, MapPin, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userService } from '@/services/user.service';
import { API_BASE_URL } from '@/services/api.config';
import type { UpdateUserDto, UserResponseDto } from '@/types/api.types';

export default function EmployeeProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    dob: '',
    preferredLanguage: 'en',
    location: '',
  });

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'Arabic' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
  ];

  const resolveProfileImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return '';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) return imageUrl;

    const baseUrl = API_BASE_URL.endsWith('/api')
      ? API_BASE_URL.slice(0, -4)
      : API_BASE_URL;

    return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await userService.getUserByEmail(user.email);
        if (response.statusCode === 200 && response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to load employee profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.email]);

  useEffect(() => {
    if (!profile) {
      return;
    }

    setEditForm({
      fullName: profile.strUserName || '',
      phone: profile.strPhoneNo || '',
      dob: profile.dDob ? profile.dDob.split('T')[0] : '',
      preferredLanguage: profile.strPreferredLanguage || 'en',
      location: profile.strLocation || '',
    });
  }, [profile]);

  const displayName = profile?.strUserName || user?.name || 'Employee';
  const displayEmail = profile?.strEmail || user?.email || 'N/A';
  const displayPhone = profile?.strPhoneNo || 'N/A';
  const displayRole = profile?.strRoleName || user?.roleName || 'Employee';
  const displayLanguage = profile?.strPreferredLanguage === 'en'
    ? 'English'
    : profile?.strPreferredLanguage || 'N/A';
  const displayDepartment = profile?.strBankName || 'Not provided';
  const displayLocation = profile?.strLocation || 'Not provided';
  const displayEmployeeId = 'Employee Profile';
  const displayJoiningDate = profile?.dtCreatedDate
    ? new Date(profile.dtCreatedDate).toLocaleDateString()
    : 'N/A';
  const displayModifiedDate = profile?.dtModifiedDate
    ? new Date(profile.dtModifiedDate).toLocaleDateString()
    : 'N/A';
  const profileImageSrc =
    resolveProfileImageUrl(profile?.strProfileImageUrl) ||
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';

  const openEditProfile = () => {
    setEditForm({
      fullName: profile?.strUserName || user?.name || '',
      phone: profile?.strPhoneNo || '',
      dob: profile?.dDob ? profile.dDob.split('T')[0] : '',
      preferredLanguage: profile?.strPreferredLanguage || 'en',
      location: profile?.strLocation || '',
    });
    setProfileImageFile(null);
    setIsEditOpen(true);
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setProfileImageFile(file);
  };

  const handleSaveProfile = async () => {
    if (!profile) {
      return;
    }

    try {
      setIsSaving(true);

      const payload: UpdateUserDto = {
        strUserName: editForm.fullName.trim(),
        strEmail: profile.strEmail,
        strPhoneNo: editForm.phone.trim() || undefined,
        dDob: editForm.dob || undefined,
        strRoleGUID: profile.strRoleGUID,
        strPreferredLanguage: editForm.preferredLanguage,
        strBankName: profile.strBankName,
        strBankAccountNo: profile.strBankAccountNo,
        strTaxBracket: profile.strTaxBracket,
        strLocation: editForm.location.trim() || undefined,
        bolIsActive: profile.bolIsActive,
        strProfileImage: profileImageFile || undefined,
      };

      const response = await userService.updateUser(profile.strUserGUID, payload);
      if (response.statusCode === 200 && response.data) {
        setProfile(response.data);
        setIsEditOpen(false);
        setProfileImageFile(null);
      }
    } catch (error) {
      console.error('Failed to update employee profile', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Loading your profile from the backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Your personal and organization details from the backend.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {profile?.strProfileImageUrl ? (
              <img
                src={profileImageSrc}
                alt={displayName}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <UserCircle2 className="h-12 w-12" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{displayName}</h2>
            <p className="text-sm text-slate-500">{displayEmployeeId}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>{displayRole}</Badge>
              <Badge variant="secondary">{displayLanguage}</Badge>
            </div>
          </div>
          <Button onClick={openEditProfile}>Edit Profile</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-5 space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">Contact</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Mail className="h-4 w-4" /> {displayEmail}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Phone className="h-4 w-4" /> {displayPhone}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><MapPin className="h-4 w-4" /> {displayLocation}</div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">Organization</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Building2 className="h-4 w-4" /> {displayDepartment}</div>
          <p className="text-sm text-slate-600 dark:text-slate-300">Current Role: {displayRole}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Date of Joining: {displayJoiningDate}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Last Updated: {displayModifiedDate}</p>
        </Card>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information from the backend.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={editForm.fullName}
                onChange={(event) => setEditForm((prev) => ({ ...prev, fullName: event.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile?.strEmail || ''} disabled />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(event) => setEditForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={editForm.dob}
                onChange={(event) => setEditForm((prev) => ({ ...prev, dob: event.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="preferredLanguage">Preferred Language</Label>
              <Select
                value={editForm.preferredLanguage}
                onValueChange={(value) => setEditForm((prev) => ({ ...prev, preferredLanguage: value }))}
              >
                <SelectTrigger id="preferredLanguage">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editForm.location}
                onChange={(event) => setEditForm((prev) => ({ ...prev, location: event.target.value }))}
                placeholder="City, Country"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profileImage">Profile Image</Label>
              <Input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
              />
              <p className="text-xs text-muted-foreground">
                {profileImageFile ? profileImageFile.name : 'Leave empty to keep the current image.'}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
