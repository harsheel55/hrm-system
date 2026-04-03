import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attendanceService } from "@/services/attendanceService";
import type { AttendanceDashboard, AttendanceWeekDay } from "@/services/attendanceService";
import { Loader2, LogIn, LogOut, Timer, Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function EmployeeAttendancePage() {
  const [data, setData] = useState<AttendanceDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [now, setNow] = useState(new Date());

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
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = async () => {
    try {
      setActionLoading(true);
      if (data?.clock?.isCheckedIn) {
        await attendanceService.checkOut();
      } else {
        await attendanceService.checkIn();
      }
      fetchDashboard();
    } catch (e: any) {
      alert(e.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  const { summary, clock, myWeek, monthlySummary } = data || {
    summary: { present: 0, absent: 0, late: 0, onLeave: 0, attendanceRate: 0 },
    clock: undefined,
    myWeek: [],
    monthlySummary: { daysPresent: 0, workingDays: 0, daysLate: 0, latePercentage: 0, totalHours: 0, avgHoursPerDay: 0, overtimeHours: 0, overtimeDays: 0 }
  };

  const isCheckedIn = clock?.isCheckedIn || false;

  const getLiveElapsed = () => {
    if (!isCheckedIn || !clock?.checkInIso) return clock?.elapsed || "0h 0m";
    const start = new Date(clock.checkInIso);
    const diff = Math.max(0, now.getTime() - start.getTime());
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">My Attendance</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Track your check-ins and monthly performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Session Time</p>
            <p className="text-sm font-mono font-bold flex items-center gap-1.5 justify-end">
              <Timer className="w-3.5 h-3.5 text-emerald-500" />{getLiveElapsed()}
            </p>
          </div>
          <Button 
            onClick={handleAction} 
            disabled={actionLoading}
            className={`min-w-[140px] font-semibold text-white shadow-lg transition-all ${isCheckedIn ? "bg-red-500 hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700"}`}
          >
            {actionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 
             isCheckedIn ? <><LogOut className="w-4 h-4 mr-2" /> Check Out</> : <><LogIn className="w-4 h-4 mr-2" /> Check In</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm dark:bg-gray-900 overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"><CheckCircle2 className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Present</p>
              <p className="text-xl font-bold dark:text-white">{monthlySummary.daysPresent} <span className="text-[10px] font-normal text-muted-foreground">/ {monthlySummary.workingDays}</span></p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm dark:bg-gray-900 overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500"><AlertCircle className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Late</p>
              <p className="text-xl font-bold dark:text-white">{monthlySummary.daysLate} <span className="text-[10px] font-normal text-muted-foreground">({monthlySummary.latePercentage}%)</span></p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm dark:bg-gray-900 overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500"><Clock className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Work Hours</p>
              <p className="text-xl font-bold dark:text-white">{monthlySummary.totalHours}h <span className="text-[10px] font-normal text-muted-foreground">({monthlySummary.avgHoursPerDay}h avg)</span></p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm dark:bg-gray-900 overflow-hidden">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-500"><Calendar className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase">Attendance</p>
              <p className="text-xl font-bold dark:text-white">{summary.attendanceRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-0 shadow-sm dark:bg-gray-900 overflow-hidden">
          <CardHeader className="pb-3 border-b dark:border-gray-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Weekly Log</CardTitle>
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-muted-foreground">Mon – Sun</Badge>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-gray-800/50">
                <TableRow>
                  <TableHead className="w-24">Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myWeek.map((entry: AttendanceWeekDay) => {
                  const isToday = entry.day === "Today";
                  return (
                    <TableRow key={entry.date} className={isToday ? "bg-emerald-50/30 dark:bg-emerald-950/20" : ""}>
                      <TableCell className="font-medium">
                        <p className="text-sm">{entry.date}</p>
                        <p className={`text-[10px] ${isToday ? "text-emerald-600 font-bold" : "text-muted-foreground text-xs font-semibold"}`}>{entry.day}</p>
                      </TableCell>
                      <TableCell className="text-sm font-mono">{entry.checkIn}</TableCell>
                      <TableCell className="text-sm font-mono">{entry.checkOut}</TableCell>
                      <TableCell className="text-sm font-semibold">{entry.hours > 0 ? `${entry.hours}h` : '-'}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          className="capitalize px-2 py-0.5 rounded-full"
                          variant={entry.status === 'present' ? 'default' : entry.status === 'late' ? 'secondary' : entry.status === 'absent' ? 'destructive' : 'outline'}
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-0 shadow-sm dark:bg-gray-900">
            <CardHeader className="pb-3 border-b dark:border-gray-800">
              <CardTitle className="text-base font-semibold">Quick Summary</CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
               {[
                 { label: "Overtime Days", value: `${monthlySummary.overtimeDays}`, unit: "days", color: "text-amber-600" },
                 { label: "Total Overtime", value: `${monthlySummary.overtimeHours}`, unit: "hours", color: "text-amber-500" },
                 { label: "Avg Workload", value: monthlySummary.avgHoursPerDay > 8 ? "High" : "Normal", unit: "", color: monthlySummary.avgHoursPerDay > 8 ? "text-red-500" : "text-emerald-500" },
               ].map(item => (
                 <div key={item.label} className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className={`text-sm font-bold ${item.color}`}>{item.value} <span className="text-[10px] font-normal text-muted-foreground">{item.unit}</span></p>
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
