import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Users,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Calendar,
  Home,
  FileText,
  Settings,
  Clock,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  Timer,
  Search,
  Download,
  Wifi,
  Coffee,
} from "lucide-react";

type AttendanceStatus = "present" | "absent" | "late" | "half-day" | "on-leave";

interface Employee {
  id: number;
  name: string;
  avatar: string;
  department: string;
  role: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  hoursWorked: number;
  overtime: number;
}

interface WeekDay {
  date: string;
  day: string;
  status: AttendanceStatus;
  checkIn: string;
  checkOut: string;
  hours: number;
}

const employees: Employee[] = [
  { id: 1, name: "Sarah Johnson", avatar: "SJ", department: "Engineering", role: "Senior Dev", checkIn: "09:02", checkOut: null, status: "present", hoursWorked: 5.8, overtime: 0 },
  { id: 2, name: "Michael Chen", avatar: "MC", department: "Design", role: "UI Designer", checkIn: "09:45", checkOut: null, status: "late", hoursWorked: 5.1, overtime: 0 },
  { id: 3, name: "Emily Rodriguez", avatar: "ER", department: "Marketing", role: "Mktg Lead", checkIn: null, checkOut: null, status: "absent", hoursWorked: 0, overtime: 0 },
  { id: 4, name: "James Kim", avatar: "JK", department: "Sales", role: "Sales Rep", checkIn: "08:55", checkOut: null, status: "present", hoursWorked: 6.0, overtime: 1.0 },
  { id: 5, name: "Aisha Patel", avatar: "AP", department: "HR", role: "HR Manager", checkIn: null, checkOut: null, status: "on-leave", hoursWorked: 0, overtime: 0 },
  { id: 6, name: "David Park", avatar: "DP", department: "Engineering", role: "Backend Dev", checkIn: "08:30", checkOut: null, status: "present", hoursWorked: 7.4, overtime: 1.4 },
  { id: 7, name: "Lisa Wang", avatar: "LW", department: "Finance", role: "Analyst", checkIn: "09:10", checkOut: null, status: "present", hoursWorked: 5.6, overtime: 0 },
  { id: 8, name: "Tom Harris", avatar: "TH", department: "Sales", role: "Sales Lead", checkIn: "10:15", checkOut: null, status: "late", hoursWorked: 4.0, overtime: 0 },
  { id: 9, name: "Nina Gupta", avatar: "NG", department: "Engineering", role: "QA Engineer", checkIn: "09:00", checkOut: "13:30", status: "half-day", hoursWorked: 4.5, overtime: 0 },
  { id: 10, name: "Carlos Diaz", avatar: "CD", department: "Marketing", role: "Content Writer", checkIn: "08:58", checkOut: null, status: "present", hoursWorked: 6.0, overtime: 0 },
];

const myWeek: WeekDay[] = [
  { date: "Mar 19", day: "Mon", status: "present", checkIn: "08:55", checkOut: "18:02", hours: 9.1 },
  { date: "Mar 20", day: "Tue", status: "present", checkIn: "09:01", checkOut: "18:15", hours: 9.2 },
  { date: "Mar 21", day: "Wed", status: "late", checkIn: "09:52", checkOut: "18:30", hours: 8.6 },
  { date: "Mar 22", day: "Thu", status: "present", checkIn: "08:48", checkOut: "17:58", hours: 9.2 },
  { date: "Mar 23", day: "Fri", status: "present", checkIn: "08:50", checkOut: "17:45", hours: 8.9 },
  { date: "Mar 24", day: "Sat", status: "absent", checkIn: "-", checkOut: "-", hours: 0 },
  { date: "Mar 25", day: "Today", status: "present", checkIn: "09:03", checkOut: "-", hours: 5.8 },
];

const statusConfig: Record<AttendanceStatus, { label: string; color: string; dot: string; icon: React.ReactNode }> = {
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

function CheckInClock() {
  const [checkedIn, setCheckedIn] = useState(true);
  const now = "09:03 AM";
  const elapsed = "5h 49m";

  return (
    <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-600 to-teal-700 text-white dark:from-emerald-700 dark:to-teal-800">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-emerald-100 text-sm">Today — Wed, Mar 25</p>
            <p className="text-2xl font-bold mt-0.5">2:52 PM</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-100 text-xs">Time Worked</p>
            <p className="text-xl font-bold flex items-center gap-1.5 justify-end mt-0.5">
              <Timer className="w-4 h-4" />{elapsed}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5 flex-1">
            <LogIn className="w-3.5 h-3.5 text-emerald-200" />
            <div>
              <p className="text-[10px] text-emerald-200">Check In</p>
              <p className="text-sm font-bold">{now}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 flex-1">
            <LogOut className="w-3.5 h-3.5 text-emerald-200" />
            <div>
              <p className="text-[10px] text-emerald-200">Check Out</p>
              <p className="text-sm font-bold">—</p>
            </div>
          </div>
        </div>
        <Button
          className={`w-full font-semibold ${checkedIn ? "bg-red-500 hover:bg-red-600 text-white" : "bg-white text-emerald-700 hover:bg-emerald-50 dark:bg-gray-200 dark:text-emerald-800 dark:hover:bg-gray-300"}`}
          onClick={() => setCheckedIn(!checkedIn)}
        >
          {checkedIn ? <><LogOut className="w-4 h-4 mr-2" />Check Out</> : <><LogIn className="w-4 h-4 mr-2" />Check In</>}
        </Button>
        <p className="text-[10px] text-emerald-200 text-center mt-2 flex items-center justify-center gap-1">
          <Wifi className="w-3 h-3" />Office network detected
        </p>
      </CardContent>
    </Card>
  );
}

function EmployeeRow({ emp }: { emp: Employee }) {
  const s = statusConfig[emp.status];
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
        {emp.checkIn ? (
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

  const present = employees.filter(e => e.status === "present").length;
  const absent = employees.filter(e => e.status === "absent").length;
  const late = employees.filter(e => e.status === "late").length;
  const onLeave = employees.filter(e => e.status === "on-leave").length;

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === "all" || e.department.toLowerCase() === filterDept;
    return matchSearch && matchDept;
  });

  const attendanceRate = Math.round((present / employees.length) * 100);

  const barData = [
    { day: "M", present: 42, late: 3, absent: 3 },
    { day: "T", present: 44, late: 2, absent: 2 },
    { day: "W", present: 40, late: 5, absent: 3 },
    { day: "T", present: 45, late: 2, absent: 1 },
    { day: "F", present: 43, late: 3, absent: 2 },
    { day: "S", present: 5, late: 0, absent: 43 },
    { day: "S", present: present, late: late, absent: absent + onLeave },
  ];
  const maxBar = 48;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-900 border-b dark:border-b-gray-800 px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold dark:text-gray-100">Attendance Management</h1>
            <p className="text-xs text-muted-foreground">Track check-ins, hours, and team presence</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"><Bell className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Present Today" value={present} subtitle={`${attendanceRate}% attendance rate`} icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} accent="bg-emerald-50 dark:bg-gray-800" />
            <StatCard title="Late Arrivals" value={late} subtitle="After 9:15 AM" icon={<AlertCircle className="w-4 h-4 text-amber-500" />} accent="bg-amber-50 dark:bg-gray-800" />
            <StatCard title="Absent" value={absent} subtitle="Not checked in" icon={<XCircle className="w-4 h-4 text-red-500" />} accent="bg-red-50 dark:bg-gray-800" />
            <StatCard title="On Leave" value={onLeave} subtitle="Approved leave" icon={<Calendar className="w-4 h-4 text-violet-500" />} accent="bg-violet-50 dark:bg-gray-800" />
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
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-4">
                  <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <CardHeader className="pb-3 pt-4 px-5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold dark:text-gray-200">All Employees — March 25</CardTitle>
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
                              <SelectItem value="engineering">Engineering</SelectItem>
                              <SelectItem value="design">Design</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-4">
                      <div className="flex text-xs text-muted-foreground px-2 mb-1 gap-3">
                        <span className="flex-1">Employee</span>
                        <span className="hidden sm:block">Check In</span>
                        <span className="hidden md:block w-16 text-center">Hours</span>
                        <span className="w-24 text-center">Status</span>
                      </div>
                      {filtered.map(e => <EmployeeRow key={e.id} emp={e} />)}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <CheckInClock />

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
                              strokeDasharray={`${attendanceRate * 2.51} 251`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">{attendanceRate}%</p>
                            <p className="text-[10px] text-muted-foreground">Present</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-2">
                        {(["present", "late", "absent", "on-leave"] as AttendanceStatus[]).map(s => {
                          const count = employees.filter(e => e.status === s).length;
                          const cfg = statusConfig[s];
                          return (
                            <div key={s} className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                              <span className="text-xs text-muted-foreground flex-1">{cfg.label}</span>
                              <span className="text-xs font-semibold dark:text-gray-300">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* MY ATTENDANCE TAB */}
            <TabsContent value="my" className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader className="pb-3 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold dark:text-gray-200">My Weekly Log — Alex Miller</CardTitle>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:text-gray-400 dark:hover:bg-gray-800"><ChevronLeft className="w-3.5 h-3.5" /></Button>
                        <span>Mar 19 – 25</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 dark:text-gray-400 dark:hover:bg-gray-800"><ChevronRight className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="space-y-2">
                      {myWeek.map(day => {
                        const s = statusConfig[day.status];
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
                        { label: "Days Present", value: "19", total: "21 working days", color: "text-emerald-600 dark:text-emerald-400" },
                        { label: "Days Late", value: "2", total: "9.5% of days", color: "text-amber-600 dark:text-amber-400" },
                        { label: "Total Hours", value: "171h", total: "Avg 9.0h / day", color: "text-blue-600 dark:text-blue-400" },
                        { label: "Overtime", value: "12h", total: "Across 4 days", color: "text-violet-600 dark:text-violet-400" },
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

                  <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold dark:text-gray-200">Avg Arrival Time</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-3xl font-bold text-center py-3 dark:text-gray-100">09:04</p>
                      <p className="text-xs text-center text-muted-foreground">Average check-in this month</p>
                      <div className="mt-3 p-2.5 bg-emerald-50 dark:bg-emerald-900/50 rounded-lg text-center">
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">4 min before cutoff</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Office opens at 9:00 AM</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* WEEKLY REPORT TAB */}
            <TabsContent value="weekly" className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader className="pb-3 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold dark:text-gray-200">Weekly Overview — Mar 19–25</CardTitle>
                      <div className="flex items-center gap-3 text-xs dark:text-gray-400">
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" />Present</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />Late</span>
                        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" />Absent</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    {/* Bar chart */}
                    <div className="flex items-end gap-3 h-40 mt-2">
                      {barData.map((d, i) => (
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
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      {[
                        { label: "Avg Present", value: "43.4", unit: "/48", color: "text-emerald-600 dark:text-emerald-400" },
                        { label: "Avg Late", value: "2.1", unit: "/day", color: "text-amber-600 dark:text-amber-400" },
                        { label: "Peak Absence", value: "Sat", unit: "off-day", color: "text-red-500 dark:text-red-400" },
                      ].map(stat => (
                        <div key={stat.label} className="text-center p-3 bg-muted/40 dark:bg-gray-800/50 rounded-xl">
                          <p className="text-xs text-muted-foreground">{stat.label}</p>
                          <p className={`text-xl font-bold ${stat.color}`}>{stat.value}<span className="text-xs text-muted-foreground ml-1">{stat.unit}</span></p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <CardTitle className="text-sm font-semibold dark:text-gray-200">Department Attendance</CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    {[
                      { dept: "Engineering", rate: 92, count: "11/12" },
                      { dept: "Design", rate: 88, count: "7/8" },
                      { dept: "Marketing", rate: 75, count: "6/8" },
                      { dept: "Sales", rate: 83, count: "5/6" },
                      { dept: "HR", rate: 90, count: "9/10" },
                      { dept: "Finance", rate: 100, count: "4/4" },
                    ].map(d => (
                      <div key={d.dept}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold dark:text-gray-300">{d.dept}</span>
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
              <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader className="pb-3 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold dark:text-gray-200">Overtime Log — March 2026</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="flex text-xs text-muted-foreground px-2 mb-2 gap-3">
                      <span className="flex-1">Employee</span>
                      <span className="w-24 text-center">OT This Week</span>
                      <span className="w-24 text-center">OT This Month</span>
                      <span className="w-20 text-right">Status</span>
                    </div>
                    {employees.filter(e => e.status !== "absent" && e.status !== "on-leave").map(e => {
                      const monthOT = +(Math.random() * 15 + 1).toFixed(1);
                      const weekOT = e.overtime;
                      return (
                        <div key={e.id} className="flex items-center gap-3 py-2.5 border-b dark:border-b-gray-800 last:border-0 px-2">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-muted dark:bg-gray-700 dark:text-gray-300">{e.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate dark:text-gray-200">{e.name}</p>
                            <p className="text-xs text-muted-foreground">{e.department}</p>
                          </div>
                          <div className="w-24 text-center">
                            <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{weekOT > 0 ? `+${weekOT}h` : "—"}</p>
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

                <div className="space-y-4">
                  <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold dark:text-gray-200">Overtime Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-3">
                      {[
                        { label: "Daily limit", value: "2 hours", icon: "⏱" },
                        { label: "Weekly limit", value: "10 hours", icon: "📅" },
                        { label: "Monthly limit", value: "20 hours", icon: "📊" },
                        { label: "Rate multiplier", value: "1.5×", icon: "💰" },
                      ].map(p => (
                        <div key={p.label} className="flex items-center justify-between py-2 border-b dark:border-b-gray-800 last:border-0">
                          <span className="text-xs text-muted-foreground">{p.icon} {p.label}</span>
                          <span className="text-sm font-bold dark:text-gray-300">{p.value}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold dark:text-gray-200">This Month Total</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-2">
                      <div className="text-center py-2">
                        <p className="text-3xl font-bold text-amber-600 dark:text-amber-500">87h</p>
                        <p className="text-xs text-muted-foreground mt-1">Team overtime hours</p>
                      </div>
                      <div className="p-2.5 bg-amber-50 dark:bg-amber-900/50 rounded-lg">
                        <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold text-center">3 employees nearing limit</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
