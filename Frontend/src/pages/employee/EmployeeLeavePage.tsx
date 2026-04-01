import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const leaveHistory = [
  { type: 'Casual Leave', from: '2026-03-12', to: '2026-03-12', status: 'Approved' },
  { type: 'Sick Leave', from: '2026-03-04', to: '2026-03-05', status: 'Approved' },
  { type: 'Earned Leave', from: '2026-04-09', to: '2026-04-10', status: 'Pending' },
];

export default function EmployeeLeavePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Leave</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">View your leave balance and request history.</p>
        </div>
        <Button>Apply Leave</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5 space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">Casual Leave</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-white">6 / 12 left</p>
          <Progress value={50} />
        </Card>
        <Card className="p-5 space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">Sick Leave</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-white">4 / 8 left</p>
          <Progress value={50} />
        </Card>
        <Card className="p-5 space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">Earned Leave</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-white">10 / 15 left</p>
          <Progress value={66} />
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Requests</h2>
        <div className="mt-4 space-y-3">
          {leaveHistory.map((leave, index) => (
            <div key={`${leave.type}-${index}`} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{leave.type}</p>
                <p className="text-sm text-slate-500">{leave.from} to {leave.to}</p>
              </div>
              <Badge variant={leave.status === 'Approved' ? 'default' : 'secondary'}>{leave.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
