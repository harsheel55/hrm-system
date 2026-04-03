import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  Timer,
  Search,
  Download,
  Wifi,
  Coffee,
  Loader2
} from "lucide-react";
import { attendanceService } from "@/services/attendanceService";
import type {
  AttendanceDashboard,
  AttendanceEmployee,
  AttendanceClock
} from "@/services/attendanceService";

const statusConfig: Record<string, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
  present: { label: "Present", color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800", dot: "bg-emerald-500", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  absent: { label: "Absent", color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-400 dark:border-red-800", dot: "bg-red-500", icon: <XCircle className="w-3.5 h-3.5" /> },
  late: { label: "Late", color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800", dot: "bg-amber-400", icon: <AlertCircle className="w-3.5 h-3.5" /> },
  "half-day": { label: "Half Day", color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800", dot: "bg-blue-400", icon: <Coffee className="w-3.5 h-3.5" /> },
  "on-leave": { label: "On Leave", color: "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/50 dark:text-violet-300 dark:border-violet-800", dot: "bg-violet-400", icon: <Calendar className="w-3.5 h-3.5" /> },
};

function StatCard({ title, value, subtitle, icon, accent }: { title: string; value: string | number; subtitle: string; icon: React.ReactNode; accent?: string }) {
  return (
    <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1 dark:text-gray-100">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={`p-2.5 rounded-xl ${accent || "bg-muted"} dark:bg-gray-800`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function CheckInClock({ clock, onRefresh }: { clock?: AttendanceClock, onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = async () => {
    try {
      setLoading(true);
      if (clock?.isCheckedIn) {
        await attendanceService.checkOut();
      } else {
        await attendanceService.checkIn();
      }
      onRefresh();
    } catch (e: any) {
      console.error(e.response?.data?.message || "Action failed");
    } finally {
      setLoading(false);
    }
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

  const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-600 to-teal-700 text-white dark:from-emerald-700 dark:to-teal-800">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-emerald-100 text-sm">Today — {dateStr}</p>
            <p className="text-2xl font-bold mt-0.5">{timeStr}</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-100 text-xs">Time Worked</p>
            <p className="text-xl font-bold flex items-center gap-1.5 justify-end mt-0.5">
              <Timer className="w-4 h-4" />{getLiveElapsed()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 flex-1">
            <LogIn className="w-3.5 h-3.5 text-emerald-200" />
            <div>
              <p className="text-[10px] text-emerald-200">Check In</p>
              <p className="text-sm font-bold">{clock?.checkIn || "--:--"}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 flex-1">
            <LogOut className="w-3.5 h-3.5 text-emerald-200" />
            <div>
              <p className="text-[10px] text-emerald-200">Check Out</p>
              <p className="text-sm font-bold">{clock?.checkOut || "--:--"}</p>
            </div>
          </div>
        </div>
        <Button
          disabled={loading}
          className={`w-full font-semibold ${isCheckedIn ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white text-emerald-700 hover:bg-emerald-50 dark:bg-gray-200 dark:text-emerald-800 dark:hover:bg-gray-300"}`}
          onClick={handleAction}
        >
          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 
           isCheckedIn ? <><LogOut className="w-4 h-4 mr-2" />Check Out</> : <><LogIn className="w-4 h-4 mr-2" />Check In</>}
        </Button>
        <p className="text-[10px] text-emerald-200 text-center mt-2 flex items-center justify-center gap-1">
          <Wifi className="w-3 h-3" />System network detected
        </p>
      </CardContent>
    </Card>
  );
}

function EmployeeRow({ emp }: { emp: AttendanceEmployee }) {
  const s = statusConfig[emp.status] || statusConfig["absent"];
  return (
    <div className="flex items-center gap-3 py-2.5 border-b dark:border-b-gray-800 last:border-0 hover:bg-muted/30 dark:hover:bg-gray-800/50 px-2 rounded-lg transition-colors">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className="text-xs font-semibold bg-muted dark:bg-gray-700 dark:text-gray-300">{emp.avatar}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate dark:text-gray-200">{emp.name}</p>
        <p className="text-xs text-muted-foreground">{emp.department} · {emp.role}</p>
      </div>
      <div className="text-center hidden sm:block">
        {emp.checkIn && emp.checkIn !== "-" ? (
          <p className="text-xs font-semibold flex items-center gap-1 dark:text-gray-300"><LogIn className="w-3 h-3 text-emerald-500" />{emp.checkIn}</p>
        ) : (
          <p className="text-xs text-muted-foreground">—</p>
        )}
      </div>
      <div className="text-center hidden md:block w-16">
        {emp.hoursWorked > 0 ? (
          <div>
            <p className="text-xs font-semibold dark:text-gray-300">{emp.hoursWorked}h</p>
            {emp.overtime > 0 && <p className="text-[10px] text-amber-600 dark:text-amber-400">+{emp.overtime}h OT</p>}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">—</p>
        )}
      </div>
      <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${s.color}`}>
        {s.icon}{s.label}
      </span>
    </div>
  );
}

export default function AttendanceManagement() {
  const [activeTab, setActiveTab] = useState("today");
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AttendanceDashboard | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await attendanceService.getDashboard({ search, department: filterDept });
      setData(res);
    } catch (e: any) {
      console.error(e.response?.data?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [search, filterDept]);

  if (loading && !data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;
  }

  const { summary, clock, employees, myWeek, weeklyBars, departmentAttendance, monthlySummary } = data || {
    summary: { present: 0, absent: 0, late: 0, onLeave: 0, attendanceRate: 0 },
    clock: undefined,
    employees: [],
    myWeek: [],
    weeklyBars: [],
    departmentAttendance: [],
    monthlySummary: { daysPresent: 0, workingDays: 0, daysLate: 0, latePercentage: 0, totalHours: 0, avgHoursPerDay: 0, overtimeHours: 0, overtimeDays: 0 }
  };

  const maxBar = Math.max(...weeklyBars.map(b => b.present + b.late + b.absent), 10);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-b-gray-800 px-6 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold dark:text-gray-100">Attendance Management</h1>
          <p className="text-xs text-muted-foreground">Track check-ins, hours, and team presence</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchDashboard}
            disabled={loading}
            className="h-8 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wifi className="w-3.5 h-3.5" />}
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Present Today" value={summary.present} subtitle={`${summary.attendanceRate}% attendance rate`} icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} accent="bg-emerald-50 dark:bg-gray-800" />
          <StatCard title="Late Arrivals" value={summary.late} subtitle="After 9:15 AM" icon={<AlertCircle className="w-4 h-4 text-amber-500" />} accent="bg-amber-50 dark:bg-gray-800" />
          <StatCard title="Absent" value={summary.absent} subtitle="Not checked in" icon={<XCircle className="w-4 h-4 text-red-500" />} accent="bg-red-50 dark:bg-gray-800" />
          <StatCard title="On Leave" value={summary.onLeave} subtitle="Approved leave" icon={<Calendar className="w-4 h-4 text-violet-500" />} accent="bg-violet-50 dark:bg-gray-800" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm h-9">
            <TabsTrigger value="today" className="text-xs dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100">Today's Attendance</TabsTrigger>
            <TabsTrigger value="my" className="text-xs dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100">My Attendance</TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100">Weekly Report</TabsTrigger>
            <TabsTrigger value="overtime" className="text-xs dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100">Overtime</TabsTrigger>
          </TabsList>

          {/* TODAY TAB */}
          <TabsContent value="today" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="xl:col-span-2 space-y-4">
                <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader className="pb-3 pt-4 px-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <CardTitle className="text-sm font-semibold dark:text-gray-200">Daily Log — {clock?.dateLabel}</CardTitle>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            className="h-7 pl-7 text-xs w-36 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                            placeholder="Search..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                          />
                        </div>
                        <Select value={filterDept} onValueChange={setFilterDept}>
                          <SelectTrigger className="h-7 text-xs w-36 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                            <SelectValue placeholder="Department" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:text-gray-300">
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Design">Design</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="HR">HR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 max-h-[500px] overflow-y-auto">
                    <div className="flex text-xs text-muted-foreground px-2 mb-1 gap-3">
                      <span className="flex-1">Employee</span>
                      <span className="hidden sm:block">Check In</span>
                      <span className="hidden md:block w-16 text-center">Hours</span>
                      <span className="w-24 text-center">Status</span>
                    </div>
                    {employees.map(e => <EmployeeRow key={e.id} emp={e} />)}
                    {employees.length === 0 && <p className="text-center text-xs text-muted-foreground mt-4">No records found.</p>}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <CheckInClock clock={clock} onRefresh={fetchDashboard} />

                <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold dark:text-gray-200">Attendance Rate</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <div className="flex items-center justify-center py-3">
                      <div className="relative w-28 h-28">
                        <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeWidth="12" />
                          <circle
                            cx="50" cy="50" r="40" fill="none"
                            stroke="#10b981" strokeWidth="12"
                            strokeDasharray={`${summary.attendanceRate * 2.51} 251`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{summary.attendanceRate}%</p>
                          <p className="text-[10px] text-muted-foreground">Present</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-2">
                      {(["present", "late", "absent", "on-leave"] as const).map(s => {
                        const count = summary[s === 'on-leave' ? 'onLeave' : s as keyof typeof summary];
                        const cfg = statusConfig[s];
                        return (count as number) > 0 ? (
                          <div key={s} className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                            <span className="text-xs text-muted-foreground flex-1">{cfg.label}</span>
                            <span className="text-xs font-semibold dark:text-gray-300">{count as number}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* MY ATTENDANCE TAB */}
          <TabsContent value="my" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold dark:text-gray-200">My Weekly Log</CardTitle>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:text-gray-400 dark:hover:bg-gray-800"><ChevronLeft className="w-3.5 h-3.5" /></Button>
                      <span>This Week</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:text-gray-400 dark:hover:bg-gray-800"><ChevronRight className="w-3.5 h-3.5" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div className="space-y-2">
                    {myWeek.map(day => {
                      const s = statusConfig[day.status] || statusConfig["absent"];
                      const isToday = day.day === "Today";
                      return (
                        <div key={day.date} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${isToday ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:border-emerald-800" : "border-transparent hover:bg-muted/30 dark:hover:bg-gray-800/50"}`}>
                          <div className="w-14 text-center flex-shrink-0">
                            <p className={`text-xs font-bold ${isToday ? "text-emerald-700 dark:text-emerald-300" : "text-muted-foreground"}`}>{day.day}</p>
                            <p className="text-xs text-muted-foreground">{day.date}</p>
                          </div>
                          <div className="flex-1 grid grid-cols-3 gap-2">
                            <div>
                              <p className="text-[10px] text-muted-foreground">Check In</p>
                              <p className="text-xs font-semibold dark:text-gray-300">{day.checkIn}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground">Check Out</p>
                              <p className="text-xs font-semibold dark:text-gray-300">{day.checkOut}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground">Hours</p>
                              <p className="text-xs font-semibold dark:text-gray-300">{day.hours > 0 ? `${day.hours}h` : "—"}</p>
                            </div>
                          </div>
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${s.color}`}>
                            {s.icon}{s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                 <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold dark:text-gray-200">This Month Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    {[
                      { label: "Days Present", value: `${monthlySummary.daysPresent}`, total: `${monthlySummary.workingDays} working days`, color: "text-emerald-600 dark:text-emerald-400" },
                      { label: "Days Late", value: `${monthlySummary.daysLate}`, total: `${monthlySummary.latePercentage}% of days`, color: "text-amber-600 dark:text-amber-400" },
                      { label: "Total Hours", value: `${monthlySummary.totalHours}h`, total: `Avg ${monthlySummary.avgHoursPerDay}h / day`, color: "text-blue-600 dark:text-blue-400" },
                      { label: "Overtime", value: `${monthlySummary.overtimeHours}h`, total: `Across ${monthlySummary.overtimeDays} days`, color: "text-violet-600 dark:text-violet-400" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b dark:border-b-gray-800 last:border-0">
                        <div>
                          <p className="text-xs font-semibold dark:text-gray-300">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground">{item.total}</p>
                        </div>
                        <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* WEEKLY REPORT TAB */}
          <TabsContent value="weekly" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                 <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold dark:text-gray-200">Weekly Overview</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                   <div className="flex items-end gap-3 h-40 mt-2">
                    {weeklyBars.map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex flex-col-reverse gap-0.5" style={{ height: "120px" }}>
                          <div className="w-full bg-emerald-500 rounded-t-sm" style={{ height: `${(d.present / maxBar) * 120}px` }} />
                          <div className="w-full bg-amber-400 rounded-t-sm" style={{ height: `${(d.late / maxBar) * 120}px` }} />
                          <div className="w-full bg-red-400 rounded-t-sm" style={{ height: `${(d.absent / maxBar) * 120}px` }} />
                        </div>
                        <span className={`text-xs font-semibold ${i === 6 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>{d.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" /> Present
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-amber-400" /> Late
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-red-400" /> Absent
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold dark:text-gray-200">Department Attendance</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  {departmentAttendance.map(d => (
                    <div key={d.department}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold dark:text-gray-300">{d.department}</span>
                        <span className="text-muted-foreground">{d.count} · <span className="font-semibold text-foreground dark:text-gray-300">{d.rate}%</span></span>
                      </div>
                      <Progress value={d.rate} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

           {/* OVERTIME TAB */}
           <TabsContent value="overtime" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
               <Card className="lg:col-span-2 border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="pb-3 pt-4 px-5">
                  <CardTitle className="text-sm font-semibold dark:text-gray-200">Overtime Log</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                   <div className="flex text-xs text-muted-foreground px-2 mb-2 gap-3">
                    <span className="flex-1">Employee</span>
                    <span className="w-24 text-center">OT This Week</span>
                    <span className="w-24 text-center">OT This Month</span>
                    <span className="w-20 text-right">Status</span>
                  </div>
                  {employees.filter(e => e.hoursWorked > 0).map(e => {
                    const monthOT = e.overtime * 4; // Mock expansion
                    return (
                      <div key={e.id} className="flex items-center gap-3 py-2.5 border-b dark:border-b-gray-800 last:border-0 px-2">
                         <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="text-xs bg-muted dark:bg-gray-700 dark:text-gray-300">{e.avatar || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate dark:text-gray-200">{e.name}</p>
                          <p className="text-xs text-muted-foreground">{e.department}</p>
                        </div>
                        <div className="w-24 text-center">
                          <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{e.overtime > 0 ? `+${e.overtime}h` : "—"}</p>
                        </div>
                        <div className="w-24 text-center">
                          <p className="text-sm font-bold dark:text-gray-300">{monthOT}h</p>
                        </div>
                        <div className="w-20 text-right">
                           <Badge variant="outline" className={`text-xs ${monthOT > 10 ? "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800" : "border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800"}`}>
                            {monthOT > 10 ? "High" : "Normal"}
                          </Badge>
                        </div>
                      </div>
                    );
                   })}
                </CardContent>
               </Card>
            </div>
           </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
