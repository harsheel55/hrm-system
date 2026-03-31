import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign, Bell,
  Download, Search, TrendingUp, CheckCircle2,
  Send, Eye, Printer, CreditCard,
  Plus, Play, Pause, Shield, Lock,
  AlertTriangle, Check, X, Wallet, Receipt,
  Zap, Globe,
} from "lucide-react";

/* ─── Types & Data ──────────────────────────────────────────────────────── */

type RunStatus  = "draft" | "processing" | "approved" | "paid" | "failed";
type CompStatus = "filed" | "pending" | "overdue" | "upcoming";

interface Employee {
  id: number; name: string; avatar: string; dept: string; role: string;
  empType: "full-time" | "contract" | "part-time";
  base: number; hra: number; transport: number; medical: number; bonus: number;
  provident: number; incomeTax: number; insurance: number;
  gross: number; totalDeductions: number; net: number;
  bankLast4: string; bankName: string; taxBracket: string; ytdGross: number; ytdTax: number;
}

interface PayrollRun {
  id: string; period: string; status: RunStatus;
  employees: number; gross: number; deductions: number; net: number;
  initiatedBy: string; initiatedAt: string; paidAt?: string;
  steps: { label: string; done: boolean; skipped?: boolean }[];
}

interface ComplianceItem {
  id: number; title: string; authority: string; dueDate: string;
  status: CompStatus; amount?: number; period: string; category: string;
}

const employees: Employee[] = [
  { id: 1, name: "Sarah Johnson",   avatar: "SJ", dept: "Engineering", role: "Senior Dev",      empType: "full-time", base: 10000, hra: 4000, transport: 400, medical: 600, bonus: 1500, provident: 1200, incomeTax: 1950, insurance: 350, gross: 16500, totalDeductions: 3500, net: 13000, bankLast4: "4421", bankName: "Chase",    taxBracket: "22%", ytdGross: 49500,  ytdTax: 5850 },
  { id: 2, name: "Tom Harris",      avatar: "TH", dept: "Sales",       role: "Sales Lead",      empType: "full-time", base: 9500,  hra: 3800, transport: 400, medical: 600, bonus: 3000, provident: 1140, incomeTax: 2340, insurance: 350, gross: 17300, totalDeductions: 3830, net: 13470, bankLast4: "7782", bankName: "Citi",     taxBracket: "24%", ytdGross: 51900,  ytdTax: 7020 },
  { id: 3, name: "Aisha Patel",     avatar: "AP", dept: "HR",          role: "CHRO",            empType: "full-time", base: 11000, hra: 4400, transport: 400, medical: 600, bonus: 0,    provident: 1320, incomeTax: 2200, insurance: 350, gross: 16400, totalDeductions: 3870, net: 12530, bankLast4: "1193", bankName: "BoA",      taxBracket: "22%", ytdGross: 49200,  ytdTax: 6600 },
  { id: 4, name: "David Park",      avatar: "DP", dept: "Engineering", role: "Backend Dev",     empType: "full-time", base: 8500,  hra: 3400, transport: 400, medical: 600, bonus: 0,    provident: 1020, incomeTax: 1870, insurance: 350, gross: 12900, totalDeductions: 3240, net: 9660,  bankLast4: "3356", bankName: "Chase",    taxBracket: "22%", ytdGross: 38700,  ytdTax: 5610 },
  { id: 5, name: "Emily Rodriguez", avatar: "ER", dept: "Marketing",   role: "Mktg Lead",       empType: "full-time", base: 8000,  hra: 3200, transport: 400, medical: 600, bonus: 500,  provident: 960,  incomeTax: 1600, insurance: 350, gross: 12700, totalDeductions: 2910, net: 9790,  bankLast4: "8821", bankName: "WellsFargo",taxBracket:"22%", ytdGross: 38100,  ytdTax: 4800 },
  { id: 6, name: "Michael Chen",    avatar: "MC", dept: "Design",      role: "UI Designer",     empType: "full-time", base: 7500,  hra: 3000, transport: 400, medical: 600, bonus: 0,    provident: 900,  incomeTax: 1500, insurance: 350, gross: 11500, totalDeductions: 2750, net: 8750,  bankLast4: "2294", bankName: "Chase",    taxBracket: "22%", ytdGross: 34500,  ytdTax: 4500 },
  { id: 7, name: "James Kim",       avatar: "JK", dept: "Sales",       role: "Sales Rep",       empType: "full-time", base: 6500,  hra: 2600, transport: 400, medical: 600, bonus: 800,  provident: 780,  incomeTax: 1300, insurance: 350, gross: 10900, totalDeductions: 2430, net: 8470,  bankLast4: "5567", bankName: "Citi",     taxBracket: "22%", ytdGross: 32700,  ytdTax: 3900 },
  { id: 8, name: "Lisa Wang",       avatar: "LW", dept: "Finance",     role: "Analyst",         empType: "full-time", base: 7000,  hra: 2800, transport: 400, medical: 600, bonus: 0,    provident: 840,  incomeTax: 1400, insurance: 350, gross: 10800, totalDeductions: 2590, net: 8210,  bankLast4: "9001", bankName: "BoA",      taxBracket: "22%", ytdGross: 32400,  ytdTax: 4200 },
  { id: 9, name: "Yuki Tanaka",     avatar: "YT", dept: "Engineering", role: "Sr Frontend",     empType: "full-time", base: 9000,  hra: 3600, transport: 400, medical: 600, bonus: 0,    provident: 1080, incomeTax: 1800, insurance: 350, gross: 13600, totalDeductions: 3230, net: 10370, bankLast4: "4478", bankName: "Chase",    taxBracket: "22%", ytdGross: 13600,  ytdTax: 1800 },
  { id: 10,name: "Nina Gupta",      avatar: "NG", dept: "Sales",       role: "Sales Rep",       empType: "contract",  base: 5500,  hra: 0,    transport: 0,   medical: 0,   bonus: 600,  provident: 0,    incomeTax: 880,  insurance: 0,   gross: 6100,  totalDeductions: 880,  net: 5220,  bankLast4: "3312", bankName: "WellsFargo",taxBracket:"12%", ytdGross: 18300,  ytdTax: 2640 },
];

const runHistory: PayrollRun[] = [
  {
    id: "PR-2026-03", period: "March 2026", status: "approved", employees: 10,
    gross: 128700, deductions: 29750, net: 98950,
    initiatedBy: "Aisha Patel", initiatedAt: "Mar 25, 2026 · 9:00 AM", paidAt: undefined,
    steps: [
      { label: "Import attendance & overtime data", done: true },
      { label: "Validate salary structures",         done: true },
      { label: "Apply tax & deductions",             done: true },
      { label: "Manager approval",                   done: true },
      { label: "Bank transfer",                      done: false },
      { label: "Payslip dispatch",                   done: false },
    ],
  },
  {
    id: "PR-2026-02", period: "February 2026", status: "paid", employees: 10,
    gross: 124300, deductions: 28890, net: 95410,
    initiatedBy: "Aisha Patel", initiatedAt: "Feb 23, 2026 · 9:00 AM", paidAt: "Feb 28, 2026",
    steps: [
      { label: "Import attendance & overtime data", done: true },
      { label: "Validate salary structures",         done: true },
      { label: "Apply tax & deductions",             done: true },
      { label: "Manager approval",                   done: true },
      { label: "Bank transfer",                      done: true },
      { label: "Payslip dispatch",                   done: true },
    ],
  },
  {
    id: "PR-2026-01", period: "January 2026", status: "paid", employees: 9,
    gross: 115400, deductions: 26700, net: 88700,
    initiatedBy: "Aisha Patel", initiatedAt: "Jan 24, 2026 · 9:12 AM", paidAt: "Jan 31, 2026",
    steps: [{ label: "", done: true }, { label: "", done: true }, { label: "", done: true }, { label: "", done: true }, { label: "", done: true }, { label: "", done: true }],
  },
];

const compliance: ComplianceItem[] = [
  { id: 1, title: "Federal Income Tax (FICA) Deposit",       authority: "IRS",              dueDate: "Mar 31, 2026", status: "pending",  amount: 14820, period: "Mar 2026",  category: "Tax" },
  { id: 2, title: "State Payroll Tax Filing (CA DE-9)",      authority: "CA EDD",           dueDate: "Apr 1, 2026",  status: "upcoming", amount: 3240,  period: "Q1 2026",   category: "Tax" },
  { id: 3, title: "401(k) Employer Contribution Remittance", authority: "Plan Administrator",dueDate: "Mar 31, 2026",status: "pending",  amount: 8640,  period: "Mar 2026",  category: "Benefits" },
  { id: 4, title: "W-2 Forms Distribution",                  authority: "IRS",              dueDate: "Jan 31, 2026", status: "filed",    amount: undefined,period: "FY 2025", category: "Reporting" },
  { id: 5, title: "ACA Employer Reporting (1095-C)",         authority: "IRS",              dueDate: "Mar 31, 2026", status: "upcoming", amount: undefined,period: "FY 2025", category: "Reporting" },
  { id: 6, title: "Federal Unemployment Tax (FUTA)",         authority: "IRS",              dueDate: "Jan 31, 2026", status: "filed",    amount: 2100,  period: "Q4 2025",   category: "Tax" },
  { id: 7, title: "State Unemployment Insurance (SUI)",      authority: "CA EDD",           dueDate: "Apr 15, 2026", status: "upcoming", amount: 1820,  period: "Q1 2026",   category: "Tax" },
  { id: 8, title: "Workers Comp Premium Audit",              authority: "Insurance Co.",    dueDate: "Mar 15, 2026", status: "overdue",  amount: undefined,period: "FY 2025", category: "Insurance" },
];

const monthlyTrend = [
  { m: "Oct", gross: 108200 }, { m: "Nov", gross: 111400 }, { m: "Dec", gross: 119800 },
  { m: "Jan", gross: 115400 }, { m: "Feb", gross: 124300 }, { m: "Mar", gross: 128700 },
];

const deptCost = [
  { dept: "Engineering", cost: 54370, pct: 42, count: 4, color: "bg-blue-500" },
  { dept: "Sales",       cost: 27160, pct: 21, count: 3, color: "bg-emerald-500" },
  { dept: "HR",          cost: 12530, pct: 10, count: 1, color: "bg-rose-500" },
  { dept: "Finance",     cost: 8210,  pct: 6,  count: 1, color: "bg-teal-500" },
  { dept: "Marketing",   cost: 9790,  pct: 8,  count: 1, color: "bg-amber-500" },
  { dept: "Design",      cost: 8750,  pct: 7,  count: 1, color: "bg-indigo-500" },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

const fmt = (n: number) => "$" + n.toLocaleString();

const runStatusCfg: Record<RunStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  draft:      { label: "Draft",      color: "text-gray-700 dark:text-gray-200",    bg: "bg-gray-50 dark:bg-slate-800/70",    border: "border-gray-200 dark:border-slate-700",   dot: "bg-gray-400" },
  processing: { label: "Processing", color: "text-blue-700 dark:text-blue-300",    bg: "bg-blue-50 dark:bg-blue-950/40",    border: "border-blue-200 dark:border-blue-900",   dot: "bg-blue-500" },
  approved:   { label: "Approved",   color: "text-amber-700 dark:text-amber-300",   bg: "bg-amber-50 dark:bg-amber-950/40",   border: "border-amber-200 dark:border-amber-900",  dot: "bg-amber-500" },
  paid:       { label: "Paid",       color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-900",dot: "bg-emerald-500" },
  failed:     { label: "Failed",     color: "text-red-700 dark:text-red-300",     bg: "bg-red-50 dark:bg-red-950/40",     border: "border-red-200 dark:border-red-900",    dot: "bg-red-500" },
};

const compStatusCfg: Record<CompStatus, { label: string; color: string; bg: string; border: string }> = {
  filed:    { label: "Filed",    color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-900" },
  pending:  { label: "Pending",  color: "text-amber-700 dark:text-amber-300",   bg: "bg-amber-50 dark:bg-amber-950/40",   border: "border-amber-200 dark:border-amber-900" },
  overdue:  { label: "Overdue",  color: "text-red-700 dark:text-red-300",     bg: "bg-red-50 dark:bg-red-950/40",     border: "border-red-200 dark:border-red-900" },
  upcoming: { label: "Upcoming", color: "text-blue-700 dark:text-blue-300",    bg: "bg-blue-50 dark:bg-blue-950/40",    border: "border-blue-200 dark:border-blue-900" },
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function PayslipDialog({ emp }: { emp: Employee }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1"><Eye className="w-3 h-3" />Slip</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="h-16 -mx-6 -mt-6 mb-4 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-t-xl flex items-center px-6 gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-sm font-bold">Payslip · March 2026</DialogTitle>
              <p className="text-white/75 text-xs">{emp.name} · {emp.role}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          {/* Employee info */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-xl text-xs">
            <div><p className="text-muted-foreground">Employee</p><p className="font-semibold">{emp.name}</p></div>
            <div><p className="text-muted-foreground">Department</p><p className="font-semibold">{emp.dept}</p></div>
            <div><p className="text-muted-foreground">Pay Period</p><p className="font-semibold">Mar 1–31, 2026</p></div>
            <div><p className="text-muted-foreground">Bank ····{emp.bankLast4}</p><p className="font-semibold">{emp.bankName}</p></div>
            <div><p className="text-muted-foreground">Tax Bracket</p><p className="font-semibold">{emp.taxBracket}</p></div>
            <div><p className="text-muted-foreground">Type</p><p className="font-semibold capitalize">{emp.empType}</p></div>
          </div>

          {/* Earnings */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Earnings</p>
            <div className="space-y-1.5">
              {[
                ["Base Salary",    emp.base],
                ["HRA",            emp.hra],
                ["Transport Allow.", emp.transport],
                ["Medical Allow.", emp.medical],
                ["Performance Bonus", emp.bonus],
              ].filter(([,v]) => (v as number) > 0).map(([l, v]) => (
                <div key={l as string} className="flex justify-between text-xs py-1 border-b border-dashed border-gray-100 last:border-0">
                  <span className="text-muted-foreground">{l as string}</span>
                  <span className="font-semibold">{fmt(v as number)}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs font-bold pt-1.5 border-t">
                <span>Gross Earnings</span><span className="text-emerald-600">{fmt(emp.gross)}</span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Deductions</p>
            <div className="space-y-1.5">
              {[
                ["Provident Fund (12%)", emp.provident],
                ["Income Tax (TDS)",     emp.incomeTax],
                ["Health Insurance",     emp.insurance],
              ].filter(([,v]) => (v as number) > 0).map(([l, v]) => (
                <div key={l as string} className="flex justify-between text-xs py-1 border-b border-dashed border-gray-100 last:border-0">
                  <span className="text-muted-foreground">{l as string}</span>
                  <span className="font-semibold text-red-600">–{fmt(v as number)}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs font-bold pt-1.5 border-t">
                <span>Total Deductions</span><span className="text-red-500">–{fmt(emp.totalDeductions)}</span>
              </div>
            </div>
          </div>

          {/* Net */}
          <div className="p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-violet-700">Net Pay (Take Home)</p>
              <p className="text-xs text-muted-foreground">Credited by Mar 31, 2026</p>
            </div>
            <p className="text-2xl font-bold text-violet-700">{fmt(emp.net)}</p>
          </div>

          {/* YTD */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-muted/40 rounded-xl">
              <p className="text-muted-foreground">YTD Gross</p>
              <p className="font-bold text-base mt-0.5">{fmt(emp.ytdGross)}</p>
            </div>
            <div className="p-3 bg-muted/40 rounded-xl">
              <p className="text-muted-foreground">YTD Tax Paid</p>
              <p className="font-bold text-base mt-0.5">{fmt(emp.ytdTax)}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-1 border-t">
            <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs gap-1.5 h-8"><Download className="w-3.5 h-3.5" />Download PDF</Button>
            <Button variant="outline" className="text-xs gap-1.5 h-8"><Send className="w-3.5 h-3.5" />Email</Button>
            <Button variant="outline" className="text-xs gap-1.5 h-8"><Printer className="w-3.5 h-3.5" />Print</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RunDetailDialog({ run }: { run: PayrollRun }) {
  const done = run.steps.filter(s => s.done).length;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1"><Eye className="w-3 h-3" />Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="h-16 -mx-6 -mt-6 mb-4 bg-gradient-to-r from-violet-600 to-blue-500 rounded-t-xl flex items-center px-6 gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-sm font-bold">Payroll Run — {run.period}</DialogTitle>
              <p className="text-white/75 text-xs">{run.id} · Initiated by {run.initiatedBy}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Gross",       val: fmt(run.gross),       color: "text-emerald-600" },
              { label: "Deductions",  val: fmt(run.deductions),  color: "text-red-500" },
              { label: "Net Pay",     val: fmt(run.net),         color: "text-violet-600" },
            ].map(r => (
              <div key={r.label} className="text-center p-3 bg-muted/40 rounded-xl">
                <p className={`text-lg font-bold ${r.color}`}>{r.val}</p>
                <p className="text-xs text-muted-foreground">{r.label}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="font-semibold">Payroll Steps</span>
              <span className="text-muted-foreground">{done} / {run.steps.length} completed</span>
            </div>
            <Progress value={(done / run.steps.length) * 100} className="mb-3 h-1.5" />
            <div className="space-y-2">
              {run.steps.filter(s => s.label).map((step, i) => (
                <div key={i} className={`flex items-center gap-3 p-2.5 rounded-xl border ${step.done ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-emerald-500" : "bg-gray-200"}`}>
                    {step.done ? <Check className="w-3.5 h-3.5 text-white" /> : <span className="text-xs font-bold text-gray-500">{i + 1}</span>}
                  </div>
                  <span className={`text-xs ${step.done ? "text-emerald-800" : "text-muted-foreground"}`}>{step.label}</span>
                  {!step.done && run.status === "approved" && i === done && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 font-semibold">Next</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Initiated: {run.initiatedAt}</span>
            {run.paidAt && <span className="text-emerald-600 font-semibold">Paid: {run.paidAt}</span>}
          </div>

          {run.status === "approved" && (
            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs gap-2 h-8">
              <CreditCard className="w-3.5 h-3.5" />Initiate Bank Transfer ({fmt(run.net)})
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function PayrollManagement() {
  const [tab, setTab]           = useState("run");
  const [search, setSearch]     = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [currentRun]            = useState(runHistory[0]);
  const pending                 = compliance.filter(c => c.status === "pending" || c.status === "overdue").length;

  const totalGross    = employees.reduce((s, e) => s + e.gross, 0);
  const totalNet      = employees.reduce((s, e) => s + e.net, 0);
  const totalDed      = employees.reduce((s, e) => s + e.totalDeductions, 0);
  const maxTrend      = Math.max(...monthlyTrend.map(m => m.gross));

  const filteredEmps = employees.filter(e => {
    const ms = e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase());
    const md = filterDept === "all" || e.dept.toLowerCase() === filterDept.toLowerCase();
    return ms && md;
  });

  const depts = ["Engineering","Sales","HR","Finance","Marketing","Design"];

  return (
    <div className="min-h-screen bg-background text-foreground flex">
    

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-background/95 border-b border-border px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Payroll Management</h1>
            <p className="text-xs text-muted-foreground">March 2026 · Pay date: Mar 31 · 10 employees</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
              <Bell className="w-4 h-4" />
              {pending > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{pending}</span>}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8"><Download className="w-3.5 h-3.5" />Export</Button>
            <Button size="sm" className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs h-8"><Play className="w-3.5 h-3.5" />Run Payroll</Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Gross",    value: fmt(totalGross), sub: "Mar 2026 · 10 employees", icon: <DollarSign className="w-4 h-4 text-violet-600" />, bg: "bg-violet-50 dark:bg-violet-950/40", trend: "+3.5%", up: true },
              { label: "Total Net Pay",  value: fmt(totalNet),   sub: "After all deductions",    icon: <Wallet className="w-4 h-4 text-emerald-600" />,  bg: "bg-emerald-50 dark:bg-emerald-950/40",trend: "+3.1%", up: true },
              { label: "Total Deducted", value: fmt(totalDed),   sub: "Tax + PF + Insurance",    icon: <Receipt className="w-4 h-4 text-amber-600" />,   bg: "bg-amber-50 dark:bg-amber-950/40",  trend: "+4.2%", up: null },
              { label: "Compliance",     value: `${pending} due`,sub: "Mar 31 deadline",         icon: <Shield className="w-4 h-4 text-red-500" />,     bg: "bg-red-50 dark:bg-red-950/40",    trend: "", up: null },
            ].map(s => (
              <Card key={s.label} className="border-0 shadow-sm bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${s.bg}`}>{s.icon}</div>
                    {s.trend && s.up !== null && (
                      <span className={`flex items-center gap-0.5 text-[10px] font-bold ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                        <TrendingUp className="w-3 h-3" />{s.trend}
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold leading-none mb-1">{s.value}</p>
                  <p className="text-xs font-semibold">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="bg-card border border-border shadow-sm h-9">
              <TabsTrigger value="run"        className="text-xs">Payroll Run</TabsTrigger>
              <TabsTrigger value="employees"  className="text-xs">Salary Breakdown</TabsTrigger>
              <TabsTrigger value="history"    className="text-xs">Run History</TabsTrigger>
              <TabsTrigger value="compliance" className="text-xs">
                Compliance
                {pending > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 rounded-full text-[10px] font-bold">{pending}</span>}
              </TabsTrigger>
              <TabsTrigger value="analytics"  className="text-xs">Analytics</TabsTrigger>
            </TabsList>

            {/* ── PAYROLL RUN ── */}
            <TabsContent value="run" className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Steps wizard */}
                <Card className="col-span-2 border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">March 2026 Payroll Run — {currentRun.id}</CardTitle>
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${runStatusCfg[currentRun.status].color} ${runStatusCfg[currentRun.status].bg} ${runStatusCfg[currentRun.status].border}`}>
                        {runStatusCfg[currentRun.status].label}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Progress value={(currentRun.steps.filter(s=>s.done).length / currentRun.steps.length) * 100} className="flex-1 h-2" />
                      <span className="text-xs font-bold text-muted-foreground">{currentRun.steps.filter(s=>s.done).length}/{currentRun.steps.length}</span>
                    </div>

                    <div className="space-y-3">
                      {currentRun.steps.map((step, i) => {
                        const isNext = !step.done && i === currentRun.steps.filter(s=>s.done).length;
                        return (
                          <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${step.done ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900" : isNext ? "bg-amber-50 border-amber-300 shadow-sm dark:bg-amber-950/40 dark:border-amber-900" : "bg-gray-50 border-gray-100 dark:bg-slate-900 dark:border-slate-800"}`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${step.done ? "bg-emerald-500" : isNext ? "bg-amber-400" : "bg-gray-200 dark:bg-slate-700"}`}>
                              {step.done
                                ? <Check className="w-4 h-4 text-white" />
                                : isNext
                                  ? <Zap className="w-3.5 h-3.5 text-white" />
                                  : <span className="text-xs font-bold text-gray-500 dark:text-gray-300">{i+1}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold ${step.done ? "text-emerald-800" : isNext ? "text-amber-800" : "text-muted-foreground"}`}>{step.label}</p>
                              {step.done && <p className="text-[10px] text-emerald-600 mt-0.5">Completed</p>}
                              {isNext && <p className="text-[10px] text-amber-700 mt-0.5">Action required — ready to proceed</p>}
                            </div>
                            {step.done && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                            {isNext && (
                              <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white gap-1 flex-shrink-0">
                                <Play className="w-3 h-3" />Start
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 pt-4 border-t flex gap-2">
                      <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs h-8 gap-1.5">
                        <CreditCard className="w-3.5 h-3.5" />Initiate Bank Transfer — {fmt(currentRun.net)}
                      </Button>
                      <Button variant="outline" className="text-xs h-8 gap-1.5"><Pause className="w-3.5 h-3.5" />Hold</Button>
                      <Button variant="outline" className="text-xs h-8 gap-1.5 text-red-600 border-red-200 hover:bg-red-50"><X className="w-3.5 h-3.5" />Cancel</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Run summary */}
                <div className="space-y-4">
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-2 pt-4 px-5">
                      <CardTitle className="text-sm font-semibold">Run Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-4 space-y-2.5">
                      {[
                        { label: "Employees",    val: `${currentRun.employees} total` },
                        { label: "Full-time",    val: "9" },
                        { label: "Contract",     val: "1" },
                        { label: "Gross Payroll",val: fmt(currentRun.gross), bold: true },
                        { label: "Total Tax",    val: fmt(employees.reduce((s,e)=>s+e.incomeTax,0)) },
                        { label: "Provident",    val: fmt(employees.reduce((s,e)=>s+e.provident,0)) },
                        { label: "Insurance",    val: fmt(employees.reduce((s,e)=>s+e.insurance,0)) },
                        { label: "Net Transfer", val: fmt(currentRun.net), bold: true, color: "text-violet-600" },
                      ].map(r => (
                        <div key={r.label} className={`flex justify-between text-xs ${r.bold ? "font-bold border-t pt-2.5 mt-1" : ""}`}>
                          <span className="text-muted-foreground">{r.label}</span>
                          <span className={r.color ?? ""}>{r.val}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-amber-800">Payment deadline: Mar 31</p>
                          <p className="text-[10px] text-amber-700 mt-1">Bank transfers must be initiated 2 business days before pay date to ensure on-time credit.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* ── SALARY BREAKDOWN ── */}
            <TabsContent value="employees" className="mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Salary Breakdown — March 2026</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input className="h-7 pl-7 text-xs w-36" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
                      </div>
                      <Select value={filterDept} onValueChange={setFilterDept}>
                        <SelectTrigger className="h-7 text-xs w-36"><SelectValue placeholder="Department" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Depts</SelectItem>
                          {depts.map(d => <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Send className="w-3 h-3" />Send All Slips</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide px-2 mb-2 grid grid-cols-12 gap-2">
                    <span className="col-span-3">Employee</span>
                    <span className="col-span-1 text-center">Type</span>
                    <span className="col-span-2 text-right">Gross</span>
                    <span className="col-span-2 text-right">Deductions</span>
                    <span className="col-span-2 text-right">Net Pay</span>
                    <span className="col-span-1 text-center">Bank</span>
                    <span className="col-span-1" />
                  </div>
                  {filteredEmps.map(e => (
                    <div key={e.id} className="grid grid-cols-12 gap-2 items-center py-2.5 border-b last:border-0 hover:bg-muted/20 px-2 rounded-lg transition-colors">
                      <div className="col-span-3 flex items-center gap-2">
                        <Avatar className="w-7 h-7 flex-shrink-0">
                          <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">{e.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{e.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{e.dept}</p>
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${e.empType === "contract" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"}`}>
                          {e.empType === "full-time" ? "FT" : e.empType === "contract" ? "CTR" : "PT"}
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-xs font-semibold">{fmt(e.gross)}</p>
                        <p className="text-[10px] text-muted-foreground">Base: {fmt(e.base)}</p>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-xs font-semibold text-red-500">–{fmt(e.totalDeductions)}</p>
                        <p className="text-[10px] text-muted-foreground">Tax: {fmt(e.incomeTax)}</p>
                      </div>
                      <div className="col-span-2 text-right">
                        <p className="text-sm font-bold text-violet-700">{fmt(e.net)}</p>
                      </div>
                      <div className="col-span-1 text-center">
                        <div className="flex items-center gap-1 justify-center">
                          <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">····{e.bankLast4}</span>
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end gap-0.5">
                        <PayslipDialog emp={e} />
                      </div>
                    </div>
                  ))}

                  {/* Totals row */}
                  <div className="grid grid-cols-12 gap-2 items-center py-3 mt-1 border-t-2 px-2 font-bold">
                    <div className="col-span-3 text-xs">TOTAL ({filteredEmps.length} employees)</div>
                    <div className="col-span-1" />
                    <div className="col-span-2 text-right text-xs text-emerald-700">{fmt(filteredEmps.reduce((s,e)=>s+e.gross,0))}</div>
                    <div className="col-span-2 text-right text-xs text-red-500">–{fmt(filteredEmps.reduce((s,e)=>s+e.totalDeductions,0))}</div>
                    <div className="col-span-2 text-right text-sm text-violet-700">{fmt(filteredEmps.reduce((s,e)=>s+e.net,0))}</div>
                    <div className="col-span-2" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── RUN HISTORY ── */}
            <TabsContent value="history" className="mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Payroll Run History</CardTitle>
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Download className="w-3 h-3" />Export All</Button>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-3">
                  {runHistory.map(run => {
                    const cfg = runStatusCfg[run.status];
                    const done = run.steps.filter(s=>s.done).length;
                    return (
                      <div key={run.id} className="p-4 rounded-xl border border-border hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${cfg.dot}`} />
                            <div>
                              <p className="text-sm font-bold">{run.period}</p>
                              <p className="text-xs text-muted-foreground">{run.id} · {run.initiatedAt}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                            <RunDetailDialog run={run} />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-3 mb-3">
                          {[
                            { label: "Employees",   val: `${run.employees}` },
                            { label: "Gross",       val: fmt(run.gross), color: "text-emerald-600" },
                            { label: "Deductions",  val: fmt(run.deductions), color: "text-red-500" },
                            { label: "Net Pay",     val: fmt(run.net), color: "text-violet-600" },
                          ].map(r => (
                            <div key={r.label} className="text-center p-2.5 bg-muted/30 rounded-xl">
                              <p className={`text-sm font-bold ${r.color ?? ""}`}>{r.val}</p>
                              <p className="text-[10px] text-muted-foreground">{r.label}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={(done / run.steps.length) * 100} className="flex-1 h-1.5" />
                          <span className="text-[10px] text-muted-foreground">{done}/{run.steps.length} steps</span>
                          {run.paidAt && <span className="text-[10px] text-emerald-600 font-semibold">Paid {run.paidAt}</span>}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── COMPLIANCE ── */}
            <TabsContent value="compliance" className="mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Tax & Compliance Obligations</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Globe className="w-3 h-3" />IRS Portal</Button>
                      <Button size="sm" className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-1"><Plus className="w-3 h-3" />Add Item</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: "Filed",    count: compliance.filter(c=>c.status==="filed").length,    color: "text-emerald-600 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-900" },
                      { label: "Pending",  count: compliance.filter(c=>c.status==="pending").length,  color: "text-amber-600 dark:text-amber-300",   bg: "bg-amber-50 dark:bg-amber-950/40",   border: "border-amber-200 dark:border-amber-900" },
                      { label: "Overdue",  count: compliance.filter(c=>c.status==="overdue").length,  color: "text-red-600 dark:text-red-300",     bg: "bg-red-50 dark:bg-red-950/40",     border: "border-red-200 dark:border-red-900" },
                      { label: "Upcoming", count: compliance.filter(c=>c.status==="upcoming").length, color: "text-blue-600 dark:text-blue-300",    bg: "bg-blue-50 dark:bg-blue-950/40",    border: "border-blue-200 dark:border-blue-900" },
                    ].map(r => (
                      <div key={r.label} className={`p-3 rounded-xl border ${r.bg} ${r.border} text-center`}>
                        <p className={`text-2xl font-bold ${r.color}`}>{r.count}</p>
                        <p className={`text-xs font-semibold ${r.color}`}>{r.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide px-2 mb-2 grid grid-cols-12 gap-2">
                    <span className="col-span-4">Obligation</span>
                    <span className="col-span-2">Authority</span>
                    <span className="col-span-2 text-right">Amount</span>
                    <span className="col-span-1 text-center">Due</span>
                    <span className="col-span-1 text-center">Category</span>
                    <span className="col-span-2 text-center">Status</span>
                  </div>
                  {compliance.map(c => {
                    const cfg = compStatusCfg[c.status];
                    return (
                      <div key={c.id} className="grid grid-cols-12 gap-2 items-center py-3 border-b last:border-0 hover:bg-muted/20 px-2 rounded-lg transition-colors">
                        <div className="col-span-4">
                          <p className="text-xs font-semibold leading-snug">{c.title}</p>
                          <p className="text-[10px] text-muted-foreground">{c.period}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-muted-foreground truncate">{c.authority}</p>
                        </div>
                        <div className="col-span-2 text-right">
                          <p className="text-xs font-semibold">{c.amount ? fmt(c.amount) : "—"}</p>
                        </div>
                        <div className="col-span-1 text-center">
                          <p className="text-[10px] text-muted-foreground leading-tight">{c.dueDate.split(",")[0]}</p>
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-300 font-semibold">{c.category}</span>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── ANALYTICS ── */}
            <TabsContent value="analytics" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Monthly trend */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Payroll Cost Trend</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="flex items-end gap-3 h-36 mb-3">
                      {monthlyTrend.map(m => {
                        const pct = (m.gross / maxTrend) * 100;
                        const isCurrent = m.m === "Mar";
                        return (
                          <div key={m.m} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-muted-foreground font-semibold">{fmt(m.gross/1000).replace("$","$")}k</span>
                            <div className="w-full rounded-t-md" style={{ height: `${pct * 0.88}%`, backgroundColor: isCurrent ? "#7c3aed" : "#c4b5fd" }} />
                            <span className={`text-[10px] font-semibold ${isCurrent ? "text-violet-700" : "text-muted-foreground"}`}>{m.m}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/40 rounded-xl">
                        <p className="text-xs text-muted-foreground">MoM Growth</p>
                        <p className="text-lg font-bold text-emerald-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" />+3.5%</p>
                      </div>
                      <div className="p-3 bg-muted/40 rounded-xl">
                        <p className="text-xs text-muted-foreground">YTD Total</p>
                        <p className="text-lg font-bold">{fmt(monthlyTrend.slice(3).reduce((s,m)=>s+m.gross,0))}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Dept cost */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Cost by Department</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-3">
                    {deptCost.map(d => (
                      <div key={d.dept}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold">{d.dept}</span>
                          <span className="text-muted-foreground">{d.count} staff · <span className="font-bold text-foreground">{fmt(d.cost)}</span> <span className="text-[10px]">({d.pct}%)</span></span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                          <div className={`h-2 rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Compensation breakdown donut */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Compensation Components</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 flex items-center gap-6">
                    <div className="relative w-28 h-28 flex-shrink-0">
                      <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
                        <circle cx="50" cy="50" r="38" fill="none" stroke="#f3f4f6" strokeWidth="16" />
                        {(() => {
                          const segs = [
                            { pct: 62, color: "#7c3aed" },
                            { pct: 22, color: "#10b981" },
                            { pct: 9,  color: "#f59e0b" },
                            { pct: 7,  color: "#e11d48" },
                          ];
                          const circ = 239;
                          let off = 0;
                          return segs.map((s, i) => {
                            const dash = (s.pct / 100) * circ;
                            const el = <circle key={i} cx="50" cy="50" r="38" fill="none" stroke={s.color} strokeWidth="16" strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-off} />;
                            off += dash;
                            return el;
                          });
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-sm font-bold">{fmt(totalGross/1000)}k</p>
                        <p className="text-[9px] text-muted-foreground">gross</p>
                      </div>
                    </div>
                    <div className="space-y-2 flex-1">
                      {[
                        { label: "Base Salary",    pct: 62, color: "bg-violet-500",  val: fmt(employees.reduce((s,e)=>s+e.base,0)) },
                        { label: "Allowances",     pct: 22, color: "bg-emerald-500", val: fmt(employees.reduce((s,e)=>s+e.hra+e.transport+e.medical,0)) },
                        { label: "Bonuses",        pct: 9,  color: "bg-amber-500",   val: fmt(employees.reduce((s,e)=>s+e.bonus,0)) },
                        { label: "Other",          pct: 7,  color: "bg-rose-500",    val: "" },
                      ].map(r => (
                        <div key={r.label} className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-sm ${r.color}`} />
                          <span className="text-xs flex-1">{r.label}</span>
                          <span className="text-xs font-bold">{r.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* YTD per employee */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">YTD Earnings — Top 6</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-2">
                    {[...employees].sort((a,b)=>b.ytdGross-a.ytdGross).slice(0,6).map((e,i) => (
                      <div key={e.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted/30 transition-colors">
                        <span className="w-5 text-xs font-bold text-muted-foreground text-center">{i+1}</span>
                        <Avatar className="w-7 h-7 flex-shrink-0">
                          <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">{e.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{e.name}</p>
                          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1 mt-1">
                            <div className="h-1 rounded-full bg-violet-500" style={{ width: `${(e.ytdGross / employees[0].ytdGross) * 100}%` }} />
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold">{fmt(e.ytdGross)}</p>
                          <p className="text-[10px] text-muted-foreground">YTD</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
