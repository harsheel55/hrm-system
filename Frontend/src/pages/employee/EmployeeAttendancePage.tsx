import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const entries = [
  { date: '2026-03-31', checkIn: '09:05', checkOut: '18:03', hours: '08:31', status: 'Present' },
  { date: '2026-03-30', checkIn: '09:22', checkOut: '18:10', hours: '08:12', status: 'Present' },
  { date: '2026-03-29', checkIn: '-', checkOut: '-', hours: '-', status: 'Weekend' },
  { date: '2026-03-28', checkIn: '10:01', checkOut: '18:11', hours: '07:36', status: 'Late' },
];

export default function EmployeeAttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Attendance</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Track your daily attendance and working hours.</p>
        </div>
        <Button>Mark Check-In</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Monthly Present</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">20</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Late Marks</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">2</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Average Hours</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">8h 07m</p>
        </Card>
      </div>

      <Card className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.date}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.checkIn}</TableCell>
                <TableCell>{entry.checkOut}</TableCell>
                <TableCell>{entry.hours}</TableCell>
                <TableCell>
                  <Badge variant={entry.status === 'Present' ? 'default' : 'secondary'}>{entry.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
