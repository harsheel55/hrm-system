import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle2, Clock3, FileClock, UserRound } from 'lucide-react';

const quickStats = [
  { title: 'Today Status', value: 'Checked In', icon: CheckCircle2, tone: 'text-emerald-600' },
  { title: 'Work Hours', value: '06h 42m', icon: Clock3, tone: 'text-blue-600' },
  { title: 'Pending Leaves', value: '1 Request', icon: FileClock, tone: 'text-amber-600' },
  { title: 'Manager', value: 'Tom Cook', icon: UserRound, tone: 'text-violet-600' },
];

export default function EmployeeOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Employee Dashboard</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          View your daily status, leave balance, and tasks in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((item) => (
          <Card key={item.title} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.title}</p>
                <p className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{item.value}</p>
              </div>
              <item.icon className={`h-5 w-5 ${item.tone}`} />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Today Timeline</h2>
            <Badge variant="secondary">Live</Badge>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between rounded-md bg-slate-50 p-3 dark:bg-slate-900/50">
              <span>Check In</span>
              <span className="font-medium">09:14 AM</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-50 p-3 dark:bg-slate-900/50">
              <span>Break Duration</span>
              <span className="font-medium">00:28</span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-slate-50 p-3 dark:bg-slate-900/50">
              <span>Expected Check Out</span>
              <span className="font-medium">06:00 PM</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h2>
          <div className="mt-4 space-y-2">
            <Button className="w-full justify-start" variant="outline">
              <CalendarDays className="mr-2 h-4 w-4" /> Apply Leave
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock3 className="mr-2 h-4 w-4" /> Mark Attendance
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <UserRound className="mr-2 h-4 w-4" /> Update Profile
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
