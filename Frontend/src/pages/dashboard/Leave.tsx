import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Bell,
  Loader2,
} from "lucide-react";

import { leaveService, type LeaveRequest as ApiLeaveRequest } from "@/services/leave.service";
import { userService } from "@/services/user.service";

type LeaveStatus = "pending" | "approved" | "rejected";
type LeaveType = "Annual" | "Sick" | "Personal" | "Maternity" | "Unpaid" | "Annual Leave" | "Sick Leave" | "Paternity";

interface UILeaveRequest {
  id: string;
  employee: string;
  department: string;
  avatar: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

const leaveBalances = [
  { type: "Annual Leave", used: 8, total: 20, color: "bg-violet-500", light: "bg-violet-100", text: "text-violet-700" },
  { type: "Sick Leave", used: 2, total: 10, color: "bg-blue-500", light: "bg-blue-100", text: "text-blue-700" },
  { type: "Personal Leave", used: 1, total: 5, color: "bg-emerald-500", light: "bg-emerald-100", text: "text-emerald-700" },
  { type: "Unpaid Leave", used: 0, total: 30, color: "bg-amber-500", light: "bg-amber-100", text: "text-amber-700" },
];

const calendarData = [
  { name: "Sarah J.", days: [7, 8, 9, 10, 11], color: "bg-violet-200 text-violet-800" },
  { name: "Aisha P.", days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30], color: "bg-rose-200 text-rose-800" },
  { name: "Michael C.", days: [], color: "bg-blue-200 text-blue-800" },
];

const statusConfig: Record<LeaveStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <AlertCircle className="w-3.5 h-3.5" /> },
  approved: { label: "Approved", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200", icon: <XCircle className="w-3.5 h-3.5" /> },
};

const typeColors: Record<string, string> = {
  "Annual Leave": "bg-violet-100 text-violet-700",
  Annual: "bg-violet-100 text-violet-700",
  "Sick Leave": "bg-blue-100 text-blue-700",
  Sick: "bg-blue-100 text-blue-700",
  Personal: "bg-emerald-100 text-emerald-700",
  Maternity: "bg-rose-100 text-rose-700",
  Paternity: "bg-rose-100 text-rose-700",
  Unpaid: "bg-gray-100 text-gray-700",
};

function StatCard({ title, value, subtitle, icon, trend }: { title: string; value: string | number; subtitle: string; icon: React.ReactNode; trend?: string }) {
  return (
    <Card className="border-0 shadow-sm dark:bg-gray-800">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-muted dark:bg-gray-700">{icon}</div>
        </div>
        {trend && <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{trend}</p>}
      </CardContent>
    </Card>
  );
}

function LeaveRequestRow({ req, onApprove, onReject }: { req: UILeaveRequest; onApprove?: (id: string) => void; onReject?: (id: string) => void }) {
  const status = statusConfig[req.status];
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0 dark:border-gray-700 hover:bg-muted/30 px-2 rounded-lg transition-colors">
      <Avatar className="w-9 h-9 flex-shrink-0">
        <AvatarFallback className="text-xs font-semibold bg-muted dark:bg-gray-700 dark:text-gray-300">{req.avatar}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate">{req.employee}</p>
          <span className="text-xs text-muted-foreground hidden sm:block">· {req.department}</span>
        </div>
        <p className="text-xs text-muted-foreground">{req.startDate} → {req.endDate} · {req.days}d</p>
      </div>
      <span className={`hidden md:flex text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[req.type] || "bg-gray-100 text-gray-700"}`}>{req.type}</span>
      <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${status?.color || "bg-gray-100"}`}>
        {status?.icon}{status?.label || req.status}
      </span>
      {req.status === "pending" && onApprove && onReject && (
        <div className="flex gap-1.5">
          <Button size="sm" variant="ghost" className="h-7 px-2.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/50" onClick={() => onApprove(req.id)}>
            <CheckCircle2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50" onClick={() => onReject(req.id)}>
            <XCircle className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function mapApiToUI(apiObj: ApiLeaveRequest, usersList: any[] = []): UILeaveRequest {
  const userMatch = usersList.find(u => u.strEmail?.toLowerCase() === apiObj.email?.toLowerCase());
  const fullName = userMatch?.strUserName || (apiObj.email ? apiObj.email.split("@")[0] : "Employee");
  const avatar = fullName.substring(0, 2).toUpperCase();
  
  return {
    id: apiObj.id,
    employee: userMatch?.strUserName || (fullName.charAt(0).toUpperCase() + fullName.slice(1)),
    department: "Organization",
    avatar,
    type: apiObj.leaveType as LeaveType,
    startDate: new Date(apiObj.startDate).toLocaleDateString(),
    endDate: new Date(apiObj.endDate).toLocaleDateString(),
    days: apiObj.days,
    reason: apiObj.reason,
    status: apiObj.status as LeaveStatus,
    appliedOn: new Date(apiObj.createdAt).toLocaleDateString()
  };
}

function ApplyLeaveDialog({ onSubmit }: { onSubmit: () => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    if (!startDate || !endDate || !reason) return;
    setIsSubmitting(true);
    try {
      await leaveService.createRequest({
        leaveType: type,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        reason,
      });
      setOpen(false);
      onSubmit();
      setType('Annual Leave');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (error) {
      console.error('Failed to submit leave', error);
      alert('Failed to submit leave request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white shadow-sm">
          <Plus className="w-4 h-4" /> Apply for Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="grid gap-1.5">
            <Label>Leave Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                <SelectItem value="Personal">Personal Leave</SelectItem>
                <SelectItem value="Maternity">Maternity Leave</SelectItem>
                <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Reason</Label>
            <Textarea placeholder="Briefly describe the reason..." className="resize-none" rows={3} value={reason} onChange={e => setReason(e.target.value)} />
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Submit Request</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function LeaveManagement() {
  const [requests, setRequests] = useState<UILeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [month] = useState("April 2026");
  const [totalEmployees, setTotalEmployees] = useState(0);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [leaveRes, userRes] = await Promise.all([
        leaveService.getAllRequests(),
        userService.getAllUsers()
      ]);
      
      const usersList = userRes.data || [];
      if (userRes.data) {
        setTotalEmployees(userRes.data.length);
      }
      
      if (leaveRes.data) {
        setRequests(leaveRes.data.map((req: ApiLeaveRequest) => mapApiToUI(req, usersList)));
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pending = requests.filter(r => r.status === "pending").length;
  const approved = requests.filter(r => r.status === "approved").length;
  const onLeaveToday = requests.filter(r => r.status === "approved" && new Date(r.startDate) <= new Date() && new Date(r.endDate) >= new Date()).length;

  const handleApprove = async (id: string) => {
    try {
      await leaveService.approveRequest(id);
      loadRequests();
    } catch(err) {
      console.error("Failed to approve", err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await leaveService.rejectRequest(id);
      loadRequests();
    } catch(err) {
      console.error("Failed to reject", err);
    }
  };

  const filtered = filterStatus === "all" ? requests : requests.filter(r => r.status === filterStatus);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const aprilDays = Array.from({ length: 30 }, (_, i) => i + 1);
  const firstDayOffset = 3; // April 1, 2026 is Wednesday

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Leave Management</h1>
            <p className="text-xs text-muted-foreground">Manage leave requests and balances</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              {pending > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-violet-600 rounded-full"></span>}
            </Button>
            <ApplyLeaveDialog onSubmit={loadData} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Pending Requests" value={pending} subtitle="Awaiting review" icon={<AlertCircle className="w-4 h-4 text-amber-500" />} />
            <StatCard title="Approved This Month" value={approved} subtitle="March 2026" icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} trend="2 more than last month" />
            <StatCard title="On Leave Today" value={onLeaveToday} subtitle={`Out of ${totalEmployees} employees`} icon={<User className="w-4 h-4 text-violet-500" />} />
            <StatCard title="Total Employees" value={totalEmployees} subtitle="System registered users" icon={<Users className="w-4 h-4 text-blue-500" />} />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm h-9">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="requests" className="text-xs">
                Requests {pending > 0 && <span className="ml-1.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">{pending}</span>}
              </TabsTrigger>
              <TabsTrigger value="balances" className="text-xs">Leave Balances</TabsTrigger>
              <TabsTrigger value="calendar" className="text-xs">Calendar</TabsTrigger>
            </TabsList>

            {/* OVERVIEW TAB */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 border-0 shadow-sm dark:bg-gray-800">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Recent Requests</CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs text-violet-600 h-7" onClick={() => setActiveTab("requests")}>View all</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    {requests.slice(0, 4).map(r => (
                      <LeaveRequestRow key={r.id} req={r} onApprove={handleApprove} onReject={handleReject} />
                    ))}
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card className="border-0 shadow-sm dark:bg-gray-800">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">Your Balance</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-3">
                      {leaveBalances.map(b => (
                        <div key={b.type} className="space-y-1.5">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">{b.type}</span>
                            <span className="font-semibold">{b.total - b.used} left</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                            <div className={`${b.color} h-1.5 rounded-full`} style={{ width: `${(b.used / b.total) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm dark:bg-gray-800">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">On Leave Today</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-2">
                      {requests.filter(r => r.status === "approved").slice(0, 3).map(r => (
                        <div key={r.id} className="flex items-center gap-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="text-xs bg-muted dark:bg-gray-700 dark:text-gray-300">{r.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xs font-semibold">{r.employee.split(" ")[0]}</p>
                            <p className="text-xs text-muted-foreground">{r.type} · {r.days}d</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* REQUESTS TAB */}
            <TabsContent value="requests" className="mt-4">
              <Card className="border-0 shadow-sm dark:bg-gray-800">
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">All Leave Requests</CardTitle>
                    <div className="flex gap-2">
                      {(["all", "pending", "approved", "rejected"] as const).map(s => (
                        <Button
                          key={s}
                          size="sm"
                          variant={filterStatus === s ? "default" : "outline"}
                          className={`h-7 text-xs capitalize ${filterStatus === s ? "bg-violet-600 hover:bg-violet-700" : "dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"}`}
                          onClick={() => setFilterStatus(s)}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  {filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No requests found</p>
                  ) : (
                    filtered.map(r => (
                      <LeaveRequestRow key={r.id} req={r} onApprove={handleApprove} onReject={handleReject} />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* BALANCES TAB */}
            <TabsContent value="balances" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm dark:bg-gray-800">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">My Leave Balance — Alex Miller</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-4">
                    {leaveBalances.map(b => (
                      <div key={b.type} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${b.light} ${b.text}`}>{b.type}</span>
                          <span className="text-sm font-bold">{b.total - b.used} <span className="text-muted-foreground font-normal text-xs">/ {b.total} days</span></span>
                        </div>
                        <Progress value={(b.used / b.total) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">{b.used} used · {b.total - b.used} remaining</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm dark:bg-gray-800">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Team Balance Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <div className="space-y-3">
                      {requests.map(r => (
                        <div key={r.id} className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="text-xs bg-muted dark:bg-gray-700 dark:text-gray-300">{r.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-semibold truncate">{r.employee}</p>
                              <span className="text-xs text-muted-foreground">{20 - Math.floor(Math.random() * 10)} / 20d</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                              <div className="bg-violet-400 h-1.5 rounded-full" style={{ width: `${30 + Math.floor(Math.random() * 50)}%` }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CALENDAR TAB */}
            <TabsContent value="calendar" className="mt-4">
              <Card className="border-0 shadow-sm dark:bg-gray-800">
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">{month} — Leave Calendar</CardTitle>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ChevronLeft className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  {/* Legend */}
                  <div className="flex gap-3 mb-4 flex-wrap">
                    {calendarData.map(e => (
                      <span key={e.name} className={`text-xs px-2.5 py-1 rounded-full font-medium ${e.color}`}>{e.name}</span>
                    ))}
                  </div>
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {weekDays.map(d => (
                      <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-1">{d}</div>
                    ))}
                    {Array.from({ length: firstDayOffset }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {aprilDays.map(day => {
                      const onLeave = calendarData.filter(e => e.days.includes(day));
                      const isToday = day === 25;
                      return (
                        <div
                          key={day}
                          className={`relative min-h-[52px] p-1 rounded-lg border text-center transition-colors hover:bg-muted/50 ${isToday ? "border-violet-400 bg-violet-50 dark:bg-violet-900/30" : "border-transparent"}`}
                        >
                          <span className={`text-xs font-semibold block mb-0.5 ${isToday ? "text-violet-700 dark:text-violet-300" : "text-foreground"}`}>{day}</span>
                          <div className="space-y-0.5">
                            {onLeave.slice(0, 2).map(e => (
                              <div key={e.name} className={`text-[10px] px-1 rounded-sm truncate ${e.color}`}>{e.name.split(" ")[0]}</div>
                            ))}
                            {onLeave.length > 2 && <div className="text-[10px] text-muted-foreground">+{onLeave.length - 2}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
