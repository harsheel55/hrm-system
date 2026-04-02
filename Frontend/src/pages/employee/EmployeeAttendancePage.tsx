import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { attendanceService } from '@/services/attendanceService';
import type { AttendanceDashboard, AttendanceWeekDay } from '@/services/attendanceService';
import { Loader2, LogIn, LogOut } from 'lucide-react';

export default function EmployeeAttendancePage() {
  const [data, setData] = useState<AttendanceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await attendanceService.getDashboard({});
      setData(res);
    } catch (e: any) {
      console.error(e.response?.data?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleAction = async () => {
    try {
      setActionLoading(true);
      if (data?.clock?.isCheckedIn) {
        await attendanceService.checkOut();
        alert("Checked out successfully");
      } else {
        await attendanceService.checkIn();
        alert("Checked in successfully");
      }
      fetchDashboard();
    } catch (e: any) {
      alert(e.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !data) {
    return <div className="min-h-full flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  const { summary, clock, myWeek } = data || {
    summary: { present: 0, absent: 0, late: 0, onLeave: 0, attendanceRate: 0 },
    clock: undefined,
    myWeek: []
  };

  const isCheckedIn = clock?.isCheckedIn || false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Attendance</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">Track your daily attendance and working hours.</p>
        </div>
        <Button 
          onClick={handleAction} 
          disabled={actionLoading}
          variant={isCheckedIn ? "destructive" : "default"}
        >
          {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 
           isCheckedIn ? <><LogOut className="w-4 h-4 mr-2" /> Mark Check-Out</> : <><LogIn className="w-4 h-4 mr-2" /> Mark Check-In</>}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Monthly Present</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{summary.present}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Late Marks</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{summary.late}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-slate-500">Attendance Rate</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{summary.attendanceRate}%</p>
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
            {myWeek.map((entry: AttendanceWeekDay) => (
              <TableRow key={entry.date}>
                <TableCell>{entry.date} - {entry.day}</TableCell>
                <TableCell>{entry.checkIn}</TableCell>
                <TableCell>{entry.checkOut}</TableCell>
                <TableCell>{entry.hours > 0 ? `${entry.hours}h` : '-'}</TableCell>
                <TableCell>
                  <Badge variant={entry.status === 'present' ? 'default' : entry.status === 'absent' ? 'destructive' : 'secondary'}>
                    {entry.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {myWeek.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">No records found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
