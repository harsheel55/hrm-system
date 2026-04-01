import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Building2, MapPin, UserCircle2 } from 'lucide-react';

export default function EmployeeProfile() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Your personal and organization details.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <UserCircle2 className="h-12 w-12" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Jane Cooper</h2>
            <p className="text-sm text-slate-500">EMP-2024-0156</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge>Regional Manager</Badge>
              <Badge variant="secondary">Sales & Marketing</Badge>
            </div>
          </div>
          <Button>Edit Profile</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-5 space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">Contact</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Mail className="h-4 w-4" /> jane.cooper@company.com</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Phone className="h-4 w-4" /> +1 (555) 123-4567</div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><MapPin className="h-4 w-4" /> New York, USA</div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="font-semibold text-slate-900 dark:text-white">Organization</h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"><Building2 className="h-4 w-4" /> Headquarters - Floor 12</div>
          <p className="text-sm text-slate-600 dark:text-slate-300">Reporting Manager: Tom Cook</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">Date of Joining: 15 Mar 2020</p>
        </Card>
      </div>
    </div>
  );
}
