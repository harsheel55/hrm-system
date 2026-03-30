import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Sun,
  Moon,
  Sunset,
  Copy,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type ShiftType = "morning" | "afternoon" | "night" | "off";

interface Shift {
  type: ShiftType;
  start: string;
  end: string;
  role: string;
}

interface Employee {
  id: number;
  name: string;
  avatar: string;
  department: string;
  role: string;
  shifts: Record<string, Shift | null>; // key = day index "0"–"6"
  hoursTotal: number;
  maxHours: number;
}

const shiftDefs: Record<ShiftType, { label: string; start: string; end: string; color: string; bg: string; border: string; icon: React.ReactNode; hours: number }> = {
  morning:   { label: "Morning",   start: "06:00", end: "14:00", color: "text-amber-700 dark:text-amber-300",  bg: "bg-amber-50 dark:bg-amber-950",   border: "border-amber-200 dark:border-amber-800/50",  icon: <Sun className="w-3 h-3" />,    hours: 8 },
  afternoon: { label: "Afternoon", start: "14:00", end: "22:00", color: "text-blue-700 dark:text-blue-300",   bg: "bg-blue-50 dark:bg-blue-950",    border: "border-blue-200 dark:border-blue-800/50",   icon: <Sunset className="w-3 h-3" />, hours: 8 },
  night:     { label: "Night",     start: "22:00", end: "06:00", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-50 dark:bg-violet-950",  border: "border-violet-200 dark:border-violet-800/50", icon: <Moon className="w-3 h-3" />,   hours: 8 },
  off:       { label: "Day Off",   start: "",      end: "",      color: "text-gray-400 dark:text-gray-500",   bg: "bg-gray-50 dark:bg-gray-800/50",    border: "border-gray-200 dark:border-gray-700/50",   icon: null,                           hours: 0 },
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dates = ["Mar 24", "Mar 25", "Mar 26", "Mar 27", "Mar 28", "Mar 29", "Mar 30"];
const todayIdx = 1;

const initialEmployees: Employee[] = [
  { id: 1,  name: "Sarah Johnson",  avatar: "SJ", department: "Engineering", role: "Senior Dev",     hoursTotal: 40, maxHours: 40, shifts: { "0": { type: "morning",   start: "06:00", end: "14:00", role: "Senior Dev" }, "1": { type: "morning",   start: "06:00", end: "14:00", role: "Senior Dev" }, "2": { type: "morning",   start: "06:00", end: "14:00", role: "Senior Dev" }, "3": { type: "morning",   start: "06:00", end: "14:00", role: "Senior Dev" }, "4": { type: "morning",   start: "06:00", end: "14:00", role: "Senior Dev" }, "5": null, "6": null } },
  { id: 2,  name: "Michael Chen",  avatar: "MC", department: "Design",       role: "UI Designer",    hoursTotal: 40, maxHours: 40, shifts: { "0": { type: "morning",   start: "06:00", end: "14:00", role: "UI Designer" }, "1": { type: "morning",   start: "06:00", end: "14:00", role: "UI Designer" }, "2": null, "3": { type: "afternoon", start: "14:00", end: "22:00", role: "UI Designer" }, "4": { type: "afternoon", start: "14:00", end: "22:00", role: "UI Designer" }, "5": { type: "afternoon", start: "14:00", end: "22:00", role: "UI Designer" }, "6": null } },
  { id: 3,  name: "Emily Rodriguez",avatar: "ER", department: "Marketing",   role: "Mktg Lead",      hoursTotal: 32, maxHours: 40, shifts: { "0": { type: "afternoon", start: "14:00", end: "22:00", role: "Mktg Lead" }, "1": { type: "afternoon", start: "14:00", end: "22:00", role: "Mktg Lead" }, "2": { type: "afternoon", start: "14:00", end: "22:00", role: "Mktg Lead" }, "3": { type: "afternoon", start: "14:00", end: "22:00", role: "Mktg Lead" }, "4": null, "5": null, "6": null } },
  { id: 4,  name: "James Kim",     avatar: "JK", department: "Sales",        role: "Sales Rep",      hoursTotal: 40, maxHours: 40, shifts: { "0": { type: "morning",   start: "06:00", end: "14:00", role: "Sales Rep" }, "1": { type: "morning",   start: "06:00", end: "14:00", role: "Sales Rep" }, "2": { type: "morning",   start: "06:00", end: "14:00", role: "Sales Rep" }, "3": { type: "morning",   start: "06:00", end: "14:00", role: "Sales Rep" }, "4": { type: "morning",   start: "06:00", end: "14:00", role: "Sales Rep" }, "5": null, "6": null } },
  { id: 5,  name: "David Park",    avatar: "DP", department: "Engineering",  role: "Backend Dev",    hoursTotal: 48, maxHours: 40, shifts: { "0": { type: "night",     start: "22:00", end: "06:00", role: "Backend Dev" }, "1": { type: "night",     start: "22:00", end: "06:00", role: "Backend Dev" }, "2": { type: "night",     start: "22:00", end: "06:00", role: "Backend Dev" }, "3": { type: "night",     start: "22:00", end: "06:00", role: "Backend Dev" }, "4": { type: "night",     start: "22:00", end: "06:00", role: "Backend Dev" }, "5": { type: "night",     start: "22:00", end: "06:00", role: "Backend Dev" }, "6": null } },
  { id: 6,  name: "Lisa Wang",     avatar: "LW", department: "Finance",      role: "Analyst",        hoursTotal: 40, maxHours: 40, shifts: { "0": { type: "morning",   start: "06:00", end: "14:00", role: "Analyst" }, "1": { type: "morning",   start: "06:00", end: "14:00", role: "Analyst" }, "2": { type: "morning",   start: "06:00", end: "14:00", role: "Analyst" }, "3": { type: "morning",   start: "06:00", end: "14:00", role: "Analyst" }, "4": { type: "morning",   start: "06:00", end: "14:00", role: "Analyst" }, "5": null, "6": null } },
  { id: 7,  name: "Tom Harris",    avatar: "TH", department: "Sales",        role: "Sales Lead",     hoursTotal: 24, maxHours: 40, shifts: { "0": { type: "afternoon", start: "14:00", end: "22:00", role: "Sales Lead" }, "1": { type: "afternoon", start: "14:00", end: "22:00", role: "Sales Lead" }, "2": { type: "afternoon", start: "14:00", end: "22:00", role: "Sales Lead" }, "3": null, "4": null, "5": null, "6": null } },
  { id: 8,  name: "Nina Gupta",    avatar: "NG", department: "Engineering",  role: "QA Engineer",    hoursTotal: 40, maxHours: 40, shifts: { "0": null, "1": { type: "morning",   start: "06:00", end: "14:00", role: "QA Engineer" }, "2": { type: "morning",   start: "06:00", end: "14:00", role: "QA Engineer" }, "3": { type: "morning",   start: "06:00", end: "14:00", role: "QA Engineer" }, "4": { type: "morning",   start: "06:00", end: "14:00", role: "QA Engineer" }, "5": { type: "morning",   start: "06:00", end: "14:00", role: "QA Engineer" }, "6": null } },
];

function ShiftCell({ shift, isToday, onClick }: { shift: Shift | null | undefined; isToday: boolean; onClick: () => void }) {
  if (!shift) {
    return (
      <button
        onClick={onClick}
        className={`w-full h-14 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors group ${isToday ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-800/50 dark:bg-emerald-950/30" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
      >
        <Plus className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors" />
      </button>
    );
  }
  const def = shiftDefs[shift.type];
  if (shift.type === "off") {
    return (
      <button onClick={onClick} className={`w-full h-14 rounded-lg border flex flex-col items-center justify-center gap-0.5 ${def.bg} ${def.border} ${isToday ? "ring-1 ring-emerald-400 dark:ring-emerald-600" : ""} hover:opacity-80 transition-opacity`}>
        <span className={`text-xs font-medium ${def.color}`}>Day Off</span>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`w-full h-14 rounded-lg border flex flex-col items-start justify-center px-2 gap-0.5 ${def.bg} ${def.border} ${isToday ? "ring-1 ring-emerald-400 dark:ring-emerald-600" : ""} hover:opacity-80 transition-opacity`}
    >
      <span className={`flex items-center gap-1 text-xs font-semibold ${def.color}`}>{def.icon}{def.label}</span>
      <span className={`text-[10px] ${def.color} opacity-80`}>{def.start}–{def.end}</span>
    </button>
  );
}

function AddShiftDialog({ employeeName, day, current, onSave }: { employeeName: string; day: string; current: Shift | null | undefined; onSave: (shift: Shift | null) => void }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ShiftType>(current?.type ?? "morning");

  const handleSave = () => {
    if (type === "off") { onSave({ type: "off", start: "", end: "", role: "" }); }
    else {
      const def = shiftDefs[type];
      onSave({ type, start: def.start, end: def.end, role: "" });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="w-full h-full absolute inset-0 cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle className="text-sm">{employeeName} — {day}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="grid gap-1.5">
            <Label className="text-xs">Shift Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["morning", "afternoon", "night", "off"] as ShiftType[]).map(t => {
                const def = shiftDefs[t];
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors ${type === t ? `${def.bg} ${def.border} ${def.color}` : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300"}`}
                  >
                    {def.icon}<span>{def.label}</span>
                    {t !== "off" && <span className="ml-auto opacity-60 text-[10px]">{def.start}–{def.end}</span>}
                  </button>
                );
              })}
            </div>
          </div>
          {type !== "off" && (
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">Start</Label>
                <Input type="time" defaultValue={shiftDefs[type].start} className="text-xs h-8" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">End</Label>
                <Input type="time" defaultValue={shiftDefs[type].end} className="text-xs h-8" />
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            {current && <Button variant="outline" size="sm" className="gap-1 text-red-500 hover:text-red-600 dark:hover:text-red-400" onClick={() => { onSave(null); setOpen(false); }}><Trash2 className="w-3.5 h-3.5" />Clear</Button>}
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-white" onClick={handleSave}>Save Shift</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ShiftPlanner() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [activeTab, setActiveTab] = useState("weekly");
  const [weekLabel] = useState("Mar 24 – 30, 2026");

  const updateShift = (empId: number, dayIdx: string, shift: Shift | null) => {
    setEmployees(prev => prev.map(e => {
      if (e.id !== empId) return e;
      const newShifts = { ...e.shifts, [dayIdx]: shift };
      const total = Object.values(newShifts).reduce((sum, s) => sum + (s ? shiftDefs[s.type].hours : 0), 0);
      return { ...e, shifts: newShifts, hoursTotal: total };
    }));
  };

  // Per-day shift counts
  const dayMeta = days.map((_, di) => {
    const morning   = employees.filter(e => e.shifts[String(di)]?.type === "morning").length;
    const afternoon = employees.filter(e => e.shifts[String(di)]?.type === "afternoon").length;
    const night     = employees.filter(e => e.shifts[String(di)]?.type === "night").length;
    return { morning, afternoon, night, total: morning + afternoon + night };
  });

  const overtimeCount = employees.filter(e => e.hoursTotal > e.maxHours).length;
  const totalCoverage = Math.round((employees.reduce((s, e) => s + e.hoursTotal, 0) / (employees.length * 40)) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Shift Planner</h1>
            <p className="text-xs text-muted-foreground">Schedule and manage team shifts</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm"><Bell className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
              <Copy className="w-3.5 h-3.5" /> Copy Last Week
            </Button>
            <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-white text-xs h-8">
              <CheckCircle2 className="w-3.5 h-3.5" /> Publish Schedule
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Stat strip */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Scheduled This Week", value: `${employees.length * 5}`, sub: "total shifts", color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950" },
              { label: "Coverage Rate", value: `${totalCoverage}%`, sub: "vs target hours", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950" },
              { label: "Overtime Alerts", value: overtimeCount, sub: `employee${overtimeCount !== 1 ? "s" : ""} over 40h`, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950" },
              { label: "Open Slots Today", value: "3", sub: "need coverage", color: "text-red-500", bg: "bg-red-50 dark:bg-red-950" },
            ].map(s => (
              <Card key={s.label} className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-tight">{s.label}</p>
                    <p className="text-[11px] text-muted-foreground">{s.sub}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm h-9">
              <TabsTrigger value="weekly" className="text-xs">Weekly Schedule</TabsTrigger>
              <TabsTrigger value="daily" className="text-xs">Daily View</TabsTrigger>
              <TabsTrigger value="coverage" className="text-xs">Coverage Analysis</TabsTrigger>
            </TabsList>

            {/* WEEKLY SCHEDULE */}
            <TabsContent value="weekly" className="mt-4">
              <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Week of {weekLabel}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ChevronLeft className="w-4 h-4" /></Button>
                      <span className="text-xs text-muted-foreground">{weekLabel}</span>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  {/* Column headers */}
                  <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: "160px repeat(7, 1fr) 56px" }}>
                    <div />
                    {days.map((d, i) => (
                      <div key={d} className={`text-center ${i === todayIdx ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                        <p className={`text-xs font-bold ${i === todayIdx ? "text-emerald-600 dark:text-emerald-400" : ""}`}>{d}</p>
                        <p className={`text-[10px] ${i === todayIdx ? "text-emerald-500 dark:text-emerald-500" : "text-muted-foreground"}`}>{dates[i]}</p>
                        <div className="flex justify-center gap-0.5 mt-1">
                          {dayMeta[i].morning > 0 && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Morning" />}
                          {dayMeta[i].afternoon > 0 && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" title="Afternoon" />}
                          {dayMeta[i].night > 0 && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" title="Night" />}
                        </div>
                      </div>
                    ))}
                    <div className="text-center text-xs text-muted-foreground font-semibold">Hrs</div>
                  </div>

                  {/* Employee rows */}
                  <div className="space-y-1.5">
                    {employees.map(emp => (
                      <div key={emp.id} className="grid gap-2 items-center" style={{ gridTemplateColumns: "160px repeat(7, 1fr) 56px" }}>
                        {/* Employee info */}
                        <div className="flex items-center gap-2 pr-2">
                          <Avatar className="w-7 h-7 flex-shrink-0">
                            <AvatarFallback className="text-[10px] font-semibold bg-muted dark:bg-gray-800">{emp.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{emp.name.split(" ")[0]}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{emp.role}</p>
                          </div>
                        </div>

                        {/* Shift cells */}
                        {days.map((_, di) => (
                          <div key={di} className="relative">
                            <ShiftCell
                              shift={emp.shifts[String(di)]}
                              isToday={di === todayIdx}
                              onClick={() => {}}
                            />
                            <AddShiftDialog
                              employeeName={emp.name}
                              day={`${days[di]}, ${dates[di]}`}
                              current={emp.shifts[String(di)]}
                              onSave={(shift) => updateShift(emp.id, String(di), shift)}
                            />
                          </div>
                        ))}

                        {/* Hours */}
                        <div className="text-center">
                          <p className={`text-xs font-bold ${emp.hoursTotal > emp.maxHours ? "text-amber-600" : "text-foreground"}`}>{emp.hoursTotal}h</p>
                          {emp.hoursTotal > emp.maxHours && <AlertTriangle className="w-3 h-3 text-amber-500 mx-auto mt-0.5" />}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Day totals row */}
                  <div className="grid gap-2 mt-3 pt-3 border-t dark:border-gray-800" style={{ gridTemplateColumns: "160px repeat(7, 1fr) 56px" }}>
                    <p className="text-xs font-semibold text-muted-foreground text-right pr-2">Daily Total</p>
                    {days.map((_, di) => (
                      <div key={di} className="text-center">
                        <p className="text-xs font-bold">{dayMeta[di].total}</p>
                        <p className="text-[10px] text-muted-foreground">staff</p>
                      </div>
                    ))}
                    <div />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DAILY VIEW */}
            <TabsContent value="daily" className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader className="pb-3 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Tuesday, March 25 — Today</CardTitle>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ChevronLeft className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><ChevronRight className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    {/* Timeline */}
                    <div className="relative">
                      {/* Time axis */}
                      <div className="flex text-[10px] text-muted-foreground mb-3">
                        {["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"].map(t => (
                          <div key={t} className="flex-1 text-center">{t}</div>
                        ))}
                      </div>
                      {/* Now line */}
                      <div className="absolute top-7 bottom-0 border-l-2 border-red-400 border-dashed z-10" style={{ left: "37%" }}>
                        <span className="absolute -top-1 -translate-x-1/2 text-[10px] bg-red-400 text-white px-1 rounded font-semibold">NOW</span>
                      </div>

                      <div className="space-y-2 relative">
                        {employees.map(emp => {
                          const shift = emp.shifts["1"];
                          if (!shift || shift.type === "off") return (
                            <div key={emp.id} className="flex items-center gap-3 py-1">
                              <Avatar className="w-7 h-7 flex-shrink-0"><AvatarFallback className="text-[10px] bg-muted dark:bg-gray-800">{emp.avatar}</AvatarFallback></Avatar>
                              <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center px-3"><p className="text-xs text-gray-400 dark:text-gray-500">{shift ? "Day Off" : "No Shift"}</p></div>
                            </div>
                          );
                          const def = shiftDefs[shift.type];
                          const startH = parseInt(shift.start.split(":")[0]);
                          const endH = shift.type === "night" ? 30 : parseInt(shift.end.split(":")[0]);
                          const dayStart = 6;
                          const daySpan = 18;
                          const left = `${((startH - dayStart) / daySpan) * 100}%`;
                          const width = `${((endH - startH) / daySpan) * 100}%`;
                          return (
                            <div key={emp.id} className="flex items-center gap-3 py-1">
                              <Avatar className="w-7 h-7 flex-shrink-0"><AvatarFallback className="text-[10px] bg-muted dark:bg-gray-800">{emp.avatar}</AvatarFallback></Avatar>
                              <div className="flex-1 relative h-8">
                                <div className={`absolute h-8 rounded-lg border flex items-center px-2 gap-1.5 ${def.bg} ${def.border}`} style={{ left, width }}>
                                  <span className={`text-[10px] font-semibold ${def.color}`}>{emp.name.split(" ")[0]}</span>
                                  <span className={`text-[10px] ${def.color} opacity-70`}>{def.start}–{def.end}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">Shift Breakdown Today</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-3">
                      {(["morning", "afternoon", "night"] as ShiftType[]).map(t => {
                        const def = shiftDefs[t];
                        const count = employees.filter(e => e.shifts["1"]?.type === t).length;
                        return (
                          <div key={t} className={`p-3 rounded-xl border ${def.bg} ${def.border}`}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`flex items-center gap-1.5 text-xs font-semibold ${def.color}`}>{def.icon}{def.label}</span>
                              <span className={`text-lg font-bold ${def.color}`}>{count}</span>
                            </div>
                            <p className={`text-[10px] ${def.color} opacity-80`}>{def.start} – {def.end}</p>
                            <div className="flex -space-x-1 mt-2">
                              {employees.filter(e => e.shifts["1"]?.type === t).slice(0, 5).map(e => (
                                <Avatar key={e.id} className="w-6 h-6 border-2 border-white dark:border-gray-900">
                                  <AvatarFallback className="text-[9px] bg-muted dark:bg-gray-800">{e.avatar}</AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm border-amber-200 bg-amber-50/50 dark:bg-amber-950/50 dark:border-amber-800/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Coverage Gap</p>
                          <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">Night shift is understaffed — only 1 person covering. Minimum required: 2.</p>
                          <Button size="sm" className="mt-2 h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-white">Find Cover</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* COVERAGE ANALYSIS */}
            <TabsContent value="coverage" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Hours Distribution This Week</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-3">
                    {employees.map(emp => {
                      const pct = Math.min((emp.hoursTotal / emp.maxHours) * 100, 100);
                      const over = emp.hoursTotal > emp.maxHours;
                      return (
                        <div key={emp.id}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                              <Avatar className="w-5 h-5"><AvatarFallback className="text-[9px] bg-muted dark:bg-gray-800">{emp.avatar}</AvatarFallback></Avatar>
                              <span className="text-xs font-semibold">{emp.name.split(" ")[0]}</span>
                            </div>
                            <span className={`text-xs font-bold ${over ? "text-amber-600" : "text-foreground"}`}>
                              {emp.hoursTotal}h / {emp.maxHours}h {over && <AlertTriangle className="w-3 h-3 inline ml-0.5 text-amber-500" />}
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                            <div className={`h-2 rounded-full ${over ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">Shift Type Split</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="space-y-3">
                        {(["morning", "afternoon", "night"] as ShiftType[]).map(t => {
                          const def = shiftDefs[t];
                          const count = Object.values(employees.reduce((acc, e) => {
                            Object.values(e.shifts).forEach(s => { if (s?.type === t) acc[t] = (acc[t] || 0) + 1; });
                            return acc;
                          }, {} as Record<string, number>)).reduce((a, b) => a + b, 0);
                          const total = employees.length * 7;
                          return (
                            <div key={t}>
                              <div className="flex justify-between text-xs mb-1">
                                <span className={`flex items-center gap-1.5 font-semibold ${def.color}`}>{def.icon}{def.label}</span>
                                <span className="text-muted-foreground">{count} shifts</span>
                              </div>
                              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                                <div className={`h-2 rounded-full ${t === "morning" ? "bg-amber-400" : t === "afternoon" ? "bg-blue-400" : "bg-violet-400"}`} style={{ width: `${(count / total) * 100 * 2}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">Alerts & Conflicts</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-2">
                      {[
                        { type: "warning", msg: "David Park: 8h overtime this week" },
                        { type: "error",   msg: "Night shift Sat: 0 staff scheduled" },
                        { type: "warning", msg: "Tom Harris: only 24h — below minimum" },
                        { type: "info",    msg: "Emily Rodriguez: shift gap Wednesday" },
                      ].map((a, i) => (
                        <div key={i} className={`flex items-start gap-2 p-2.5 rounded-lg text-xs ${a.type === "error" ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300" : a.type === "warning" ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300" : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"}`}>
                          {a.type === "error" ? <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> : a.type === "warning" ? <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> : <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />}
                          <span>{a.msg}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">Shift Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-2">
                      {[
                        { name: "Michael Chen", req: "Swap Thu afternoon → morning", avatar: "MC" },
                        { name: "Tom Harris",   req: "Extra shift Sunday morning",    avatar: "TH" },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center gap-2 py-2 border-b dark:border-gray-800 last:border-0">
                          <Avatar className="w-7 h-7"><AvatarFallback className="text-[10px] bg-muted dark:bg-gray-800">{r.avatar}</AvatarFallback></Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold">{r.name}</p>
                            <p className="text-[10px] text-muted-foreground">{r.req}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-6 px-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"><CheckCircle2 className="w-3.5 h-3.5" /></Button>
                            <Button size="sm" variant="ghost" className="h-6 px-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><XCircle className="w-3.5 h-3.5" /></Button>
                          </div>
                        </div>
                      ))}
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

