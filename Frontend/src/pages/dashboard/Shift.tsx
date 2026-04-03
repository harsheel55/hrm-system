import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sun,
  Moon,
  XCircle,
  Loader2,
  Users,
  Calendar as CalendarIcon,
  Edit2
} from "lucide-react";
import { shiftService, type Shift as ShiftType, type ShiftPlannerView } from "@/services/shiftService";
import { format, startOfWeek, addDays, endOfWeek } from "date-fns";

function ShiftCell({ shift, isToday, onClick }: { shift: { shiftGuid?: string; shiftName?: string; color?: string; startTime?: string; endTime?: string } | null | undefined; isToday: boolean; onClick: () => void }) {
  if (!shift?.shiftGuid) {
    return (
      <button
        onClick={onClick}
        className={`w-full h-14 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors group ${isToday ? "border-emerald-200 bg-emerald-50/30 dark:border-emerald-800/50 dark:bg-emerald-950/30" : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
      >
        <Plus className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500 transition-colors" />
      </button>
    );
  }

  const color = shift.color || "#3b82f6";

  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: `${color}15`, borderColor: `${color}40` }}
      className={`w-full h-14 rounded-lg border flex flex-col items-start justify-center px-2 gap-0.5 ${isToday ? "ring-1 ring-emerald-400 dark:ring-emerald-600" : ""} hover:opacity-80 transition-opacity`}
    >
      <span style={{ color }} className="flex items-center gap-1 text-xs font-semibold">
        {shift.shiftName?.toLowerCase().includes("night") ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
        {shift.shiftName}
      </span>
      <span style={{ color }} className="text-[10px] opacity-80">{shift.startTime}–{shift.endTime}</span>
    </button>
  );
}

function AddShiftDialog({ employeeName, day, current, shifts, onSave, children }: { employeeName: string; day: string; current: { shiftGuid?: string } | null | undefined; shifts: ShiftType[]; onSave: (shiftGuid: string) => void, children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<string>(current?.shiftGuid ?? "");

  const handleSave = () => {
    onSave(selectedShift);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <span className="w-full h-full absolute inset-0 cursor-pointer" />}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle className="text-sm">{employeeName} — {day}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="grid gap-1.5">
            <Label className="text-xs">Select Shift</Label>
            <div className="grid grid-cols-1 gap-2">
              {shifts.map(s => (
                <button
                  key={s.shiftGuid}
                  onClick={() => setSelectedShift(s.shiftGuid)}
                  style={selectedShift === s.shiftGuid ? { backgroundColor: `${s.color}20`, borderColor: s.color, color: s.color } : {}}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors ${selectedShift === s.shiftGuid ? "" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300"}`}
                >
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span>{s.name}</span>
                  <span className="ml-auto opacity-60 text-[10px]">{s.startTime}–{s.endTime}</span>
                </button>
              ))}
              <button
                onClick={() => setSelectedShift("")}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-xs font-medium transition-colors ${!selectedShift ? "bg-red-50 border-red-200 text-red-600" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-300"}`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Remove Shift / Off Day</span>
              </button>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-white" onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateShiftDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    startTime: "09:00",
    endTime: "17:00",
    color: "#3b82f6"
  });

  const handleCreate = async () => {
    if (!form.name) return;
    try {
      setLoading(true);
      await shiftService.createShift(form);
      onCreated();
      setOpen(false);
      setForm({ name: "", startTime: "09:00", endTime: "17:00", color: "#3b82f6" });
    } catch (e: any) {
      alert("Failed to create shift");
    } finally {
      setLoading(false);
    }
  };

  const colors = ["#3b82f6", "#10b981", "#fbbf24", "#ef4444", "#8b5cf6", "#f97316"];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-white text-xs h-8">
          <Plus className="w-3.5 h-3.5" /> Create Shift
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>Create New Shift</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Shift Name</Label>
            <Input 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              placeholder="e.g. Standard Morning" 
              className="dark:bg-gray-900"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
                <Label className="text-xs">Start Time</Label>
                <Input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} className="dark:bg-gray-900" />
             </div>
             <div className="space-y-1.5">
                <Label className="text-xs">End Time</Label>
                <Input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} className="dark:bg-gray-900" />
             </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Theme Color</Label>
            <div className="flex gap-2">
              {colors.map(c => (
                <button
                  key={c}
                  onClick={() => setForm({...form, color: c})}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${form.color === c ? 'scale-110 border-white' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
          <Button size="sm" disabled={loading} onClick={handleCreate}>
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <Plus className="w-3.5 h-3.5 mr-2" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ShiftPlanner() {
  const [data, setData] = useState<ShiftPlannerView | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("weekly");
  const [currentDate, setCurrentDate] = useState(new Date());

  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });
  
  const daysInRange = Array.from({ length: 7 }).map((_, i) => addDays(start, i));

  const fetchPlanner = async () => {
    try {
      setLoading(true);
      const fetchStart = activeTab === "weekly" ? start : currentDate;
      const fetchEnd = activeTab === "weekly" ? end : currentDate;
      const res = await shiftService.getPlannerView(format(fetchStart, "yyyy-MM-dd"), format(fetchEnd, "yyyy-MM-dd"));
      setData(res);
    } catch (e: any) {
      console.error("Failed to load shift planner", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanner();
  }, [currentDate, activeTab]);

  const handleAssign = async (userGuid: string, date: string, shiftGuid: string) => {
    try {
      await shiftService.assignShift({ userGuid, date, shiftGuid });
      fetchPlanner();
    } catch (e: any) {
      console.error("Failed to assign shift", e);
    }
  };

  const nextPeriod = () => {
     setCurrentDate(addDays(currentDate, activeTab === "weekly" ? 7 : 1));
  };

  const prevPeriod = () => {
     setCurrentDate(addDays(currentDate, activeTab === "weekly" ? -7 : -1));
  };

  const { availableShifts, rows } = data || { availableShifts: [], rows: [] };
  const periodLabel = activeTab === "weekly" 
    ? `${format(start, "MMM dd")} – ${format(end, "MMM dd, yyyy")}`
    : format(currentDate, "EEEE, MMMM dd, yyyy");

  const getDailySummary = () => {
    if (activeTab !== "daily") return [];
    const summary: Record<string, { count: number, name: string, color: string }> = {};
    rows.forEach(r => {
      const cell = r.days[0];
      if (cell?.shiftGuid) {
        if (!summary[cell.shiftGuid]) {
           summary[cell.shiftGuid] = { count: 0, name: cell.shiftName || "", color: cell.color || "" };
        }
        summary[cell.shiftGuid].count++;
      }
    });
    return Object.values(summary);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Shift Planner</h1>
            <p className="text-xs text-muted-foreground">Schedule and manage team shifts</p>
          </div>
          <div className="flex items-center gap-3">
            <CreateShiftDialog onCreated={fetchPlanner} />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white dark:bg-gray-900 border dark:border-gray-800 shadow-sm h-9">
              <TabsTrigger value="weekly" className="text-xs">Weekly Schedule</TabsTrigger>
              <TabsTrigger value="daily" className="text-xs">Daily Overview</TabsTrigger>
            </TabsList>

            {/* Weekly View */}
            <TabsContent value="weekly" className="mt-4">
              <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Week of {periodLabel}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={prevPeriod}><ChevronLeft className="w-4 h-4" /></Button>
                      <span className="text-xs text-muted-foreground">{periodLabel}</span>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={nextPeriod}><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  {loading && !data ? (
                     <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
                  ) : (
                    <>
                      <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: "180px repeat(7, 1fr) 80px" }}>
                        <div className="text-xs font-semibold text-muted-foreground">Employee</div>
                        {daysInRange.map((d, i) => (
                          <div key={i} className={`text-center ${format(d, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                            <p className="text-xs font-bold">{format(d, "EEE")}</p>
                            <p className="text-[10px]">{format(d, "MMM dd")}</p>
                          </div>
                        ))}
                        <div className="text-center text-xs text-muted-foreground font-semibold">Status</div>
                      </div>

                      <div className="space-y-2">
                        {rows.map(row => (
                          <div key={row.userGuid} className="grid gap-2 items-center" style={{ gridTemplateColumns: "180px repeat(7, 1fr) 80px" }}>
                            <div className="flex items-center gap-2 pr-2">
                              <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarFallback className="text-xs font-bold bg-muted dark:bg-gray-800">
                                  {row.userName.substring(0, 1)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate">{row.userName}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{row.role}</p>
                              </div>
                            </div>

                            {row.days.map((cell, di) => (
                              <div key={di} className="relative group">
                                <ShiftCell
                                  shift={cell}
                                  isToday={cell.date === format(new Date(), "yyyy-MM-dd")}
                                  onClick={() => {}}
                                />
                                <AddShiftDialog
                                  employeeName={row.userName}
                                  day={format(new Date(cell.date + "T00:00:00"), "EEEE, MMM dd")}
                                  current={cell}
                                  shifts={availableShifts}
                                  onSave={(shiftGuid) => handleAssign(row.userGuid, cell.date, shiftGuid)}
                                />
                              </div>
                            ))}

                            <div className="text-center">
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                                Active
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Daily Overview */}
            <TabsContent value="daily" className="mt-4">
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 {/* Left Sidebar - Summary Statistics */}
                 <div className="space-y-4">
                    <Card className="border-0 shadow-sm dark:bg-gray-900">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">Daily Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/50">
                           <div className="flex items-center gap-2">
                             <Users className="w-4 h-4 text-emerald-600" />
                             <span className="text-xs font-medium">Total Staff</span>
                           </div>
                           <span className="text-sm font-bold">{rows.length}</span>
                        </div>
                        <div className="space-y-2 pt-1">
                           <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">Shift Breakdown</p>
                           {getDailySummary().map(s => (
                             <div key={s.name} className="flex justify-between items-center py-2 border-b dark:border-gray-800 last:border-0">
                               <div className="flex items-center gap-2">
                                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                                 <span className="text-xs">{s.name}</span>
                               </div>
                               <span className="text-xs font-bold">{s.count}</span>
                             </div>
                           ))}
                           {getDailySummary().length === 0 && (
                             <p className="text-center text-xs text-muted-foreground py-2">No assignments for today.</p>
                           )}
                        </div>
                      </CardContent>
                    </Card>
                 </div>

                 {/* Main Employee List */}
                 <div className="lg:col-span-3 space-y-4">
                    <Card className="border-0 shadow-sm dark:bg-gray-900">
                      <CardHeader className="pb-2 pt-4 px-5">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4 text-emerald-500" />
                              <CardTitle className="text-sm font-semibold">{periodLabel}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={prevPeriod}><ChevronLeft className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={nextPeriod}><ChevronRight className="w-4 h-4" /></Button>
                            </div>
                         </div>
                      </CardHeader>
                      <CardContent className="px-5 pb-5">
                          {loading ? (
                             <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                               {rows.map(row => {
                                  const cell = row.days[0];
                                  return (
                                    <div key={row.userGuid} className="flex items-center justify-between p-3 rounded-xl border dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:shadow-md transition-shadow">
                                       <div className="flex items-center gap-3">
                                          <Avatar className="w-10 h-10 border dark:border-gray-800">
                                            <AvatarFallback className="text-xs font-bold bg-muted dark:bg-gray-800">
                                              {row.userName.substring(0, 1)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="min-w-0">
                                             <p className="text-sm font-bold truncate">{row.userName}</p>
                                             <p className="text-xs text-muted-foreground truncate">{row.role}</p>
                                          </div>
                                       </div>

                                       <div className="flex items-center gap-2">
                                          {cell?.shiftGuid ? (
                                            <div 
                                              style={{ backgroundColor: `${cell.color}15`, borderColor: `${cell.color}40`, color: cell.color }}
                                              className="flex flex-col items-end gap-0.5 px-3 py-1 rounded-lg border text-[10px] font-bold"
                                            >
                                               <span className="flex items-center gap-1">
                                                 {cell.shiftName?.toLowerCase().includes("night") ? <Moon className="w-2.5 h-2.5" /> : <Sun className="w-2.5 h-2.5" />}
                                                 {cell.shiftName}
                                               </span>
                                               <span className="opacity-80">{cell.startTime}–{cell.endTime}</span>
                                            </div>
                                          ) : (
                                            <span className="text-[10px] text-muted-foreground italic bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded border dark:border-gray-700">Not Assigned</span>
                                          )}

                                          <AddShiftDialog
                                            employeeName={row.userName}
                                            day={format(currentDate, "EEEE, MMM dd")}
                                            current={cell}
                                            shifts={availableShifts}
                                            onSave={(shiftGuid) => handleAssign(row.userGuid, format(currentDate, "yyyy-MM-dd"), shiftGuid)}
                                          >
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-emerald-500">
                                              <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                          </AddShiftDialog>
                                       </div>
                                    </div>
                                  );
                               })}
                            </div>
                          )}
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
