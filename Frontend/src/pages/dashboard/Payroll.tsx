import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  Download, Search, TrendingUp, CheckCircle2,
  Send, Eye, Printer, CreditCard,
  Plus, Play, Pause, Shield, Lock,
  AlertTriangle, Check, X, Wallet, Receipt,
  Zap, Globe, Loader2,
} from "lucide-react";
import { payrollService } from "@/services/payroll.service";

/* ─── Types & Data ──────────────────────────────────────────────────────── */

type RunStatus  = "draft" | "processing" | "approved" | "paid" | "failed";
type CompStatus = "filed" | "pending" | "overdue" | "upcoming";

interface Employee {
  id: number | string; userId?: string; name: string; avatar: string; dept: string; role: string;
  empType: "full-time" | "contract" | "part-time";
  base: number; hra: number; transport: number; medical: number; bonus: number;
  provident: number; incomeTax: number; insurance: number;
  gross: number; totalDeductions: number; net: number;
  bankLast4: string; bankName: string; taxBracket: string; ytdGross: number; ytdTax: number;
}

interface SalaryFormValues {
  strPayPeriod: string;
  strEmploymentType: "full-time" | "contract" | "part-time";
  decBaseSalary: number;
  decHRA: number;
  decTransportAllowance: number;
  decMedicalAllowance: number;
  decPerformanceBonus: number;
  decProvidentFund: number;
  decIncomeTax: number;
  decHealthInsurance: number;
}

interface PayrollRun {
  id: string; runCode?: string; period: string; status: RunStatus;
  employees: number; gross: number; deductions: number; net: number;
  initiatedBy: string; initiatedAt: string; paidAt?: string;
  steps: { label: string; done: boolean; skipped?: boolean }[];
}

interface ComplianceItem {
  id: number | string; title: string; authority: string; dueDate: string;
  status: CompStatus; amount?: number; period: string; category: string;
}

interface AnalyticsState {
  monthlyTrend: Array<{ month: string; gross: number }>;
  departmentCosts: Array<{ department: string; cost: number; percentage: number; staffCount: number }>;
}

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

function SalaryAssignDialog({
  emp,
  onSubmit,
  isSaving,
}: {
  emp: Employee;
  onSubmit: (emp: Employee, form: SalaryFormValues) => Promise<void>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<SalaryFormValues>({
    strPayPeriod: "March 2026",
    strEmploymentType: emp.empType,
    decBaseSalary: emp.base,
    decHRA: emp.hra,
    decTransportAllowance: emp.transport,
    decMedicalAllowance: emp.medical,
    decPerformanceBonus: emp.bonus,
    decProvidentFund: emp.provident,
    decIncomeTax: emp.incomeTax,
    decHealthInsurance: emp.insurance,
  });

  const gross = form.decBaseSalary + form.decHRA + form.decTransportAllowance + form.decMedicalAllowance + form.decPerformanceBonus;
  const totalDeductions = form.decProvidentFund + form.decIncomeTax + form.decHealthInsurance;
  const net = gross - totalDeductions;

  const setNumber = (key: keyof SalaryFormValues, value: string) => {
    const parsed = Number(value);
    setForm(prev => ({ ...prev, [key]: Number.isNaN(parsed) ? 0 : parsed }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1 shrink-0"><DollarSign className="w-3 h-3" />Salary</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold">Assign Salary - {emp.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1 text-muted-foreground">Pay Period</p>
              <Input value={form.strPayPeriod} onChange={(e) => setForm(prev => ({ ...prev, strPayPeriod: e.target.value }))} className="h-8 text-xs" />
            </div>
            <div>
              <p className="mb-1 text-muted-foreground">Employment Type</p>
              <Select value={form.strEmploymentType} onValueChange={(v) => setForm(prev => ({ ...prev, strEmploymentType: v as SalaryFormValues["strEmploymentType"] }))}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[ 
              ["Base Salary", "decBaseSalary"],
              ["HRA", "decHRA"],
              ["Transport", "decTransportAllowance"],
              ["Medical", "decMedicalAllowance"],
              ["Bonus", "decPerformanceBonus"],
              ["Provident Fund", "decProvidentFund"],
              ["Income Tax", "decIncomeTax"],
              ["Insurance", "decHealthInsurance"],
            ].map(([label, key]) => (
              <div key={key}>
                <p className="mb-1 text-muted-foreground">{label}</p>
                <Input
                  type="number"
                  className="h-8 text-xs"
                  value={String(form[key as keyof SalaryFormValues] ?? 0)}
                  onChange={(e) => setNumber(key as keyof SalaryFormValues, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 rounded-xl border p-3 bg-muted/20">
            <div><p className="text-muted-foreground">Gross</p><p className="font-bold text-emerald-600">{fmt(gross)}</p></div>
            <div><p className="text-muted-foreground">Deductions</p><p className="font-bold text-red-500">{fmt(totalDeductions)}</p></div>
            <div><p className="text-muted-foreground">Net</p><p className="font-bold text-violet-700">{fmt(net)}</p></div>
          </div>

          <Button
            className="w-full h-8 text-xs bg-violet-600 hover:bg-violet-700 text-white"
            disabled={isSaving}
            onClick={() => void onSubmit(emp, form)}
          >
            {isSaving ? "Saving..." : "Save Salary"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PayslipDialog({ emp, onDownload }: { emp: Employee; onDownload: (emp: Employee) => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1 shrink-0"><Eye className="w-3 h-3" />Slip</Button>
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
            <Button onClick={() => onDownload(emp)} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs gap-1.5 h-8"><Download className="w-3.5 h-3.5" />Download PDF</Button>
            <Button variant="outline" className="text-xs gap-1.5 h-8"><Send className="w-3.5 h-3.5" />Email</Button>
            <Button variant="outline" className="text-xs gap-1.5 h-8"><Printer className="w-3.5 h-3.5" />Print</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RunDetailDialog({ run, onInitiateBankTransfer }: { run: PayrollRun; onInitiateBankTransfer: (runId: string) => void }) {
  const done = run.steps.filter(s => s.done).length;
  const runLabel = run.runCode || run.id;
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
              <p className="text-white/75 text-xs">{runLabel} · Initiated by {run.initiatedBy}</p>
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
            <Button onClick={() => onInitiateBankTransfer(run.id)} className="w-full bg-violet-600 hover:bg-violet-700 text-white text-xs gap-2 h-8">
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
  const [payrollEmployees, setPayrollEmployees] = useState<Employee[]>([]);
  const [payrollRuns, setPayrollRuns] = useState<PayrollRun[]>([]);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsState>({ monthlyTrend: [], departmentCosts: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingRun, setIsCreatingRun] = useState(false);
  const [isSendingAllSlips, setIsSendingAllSlips] = useState(false);
  const [salarySavingFor, setSalarySavingFor] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const pending = complianceItems.filter(c => c.status === "pending" || c.status === "overdue").length;

  const currentRun = payrollRuns[0] ?? null;
  const currentRunLabel = currentRun?.runCode || currentRun?.id || "-";

  const loadPayrollData = async () => {
    setIsLoading(true);
    try {
      const [empRes, runsRes, compRes, analyticsRes] = await Promise.all([
        payrollService.getEmployees("March 2026"),
        payrollService.getPayrollRuns(),
        payrollService.getComplianceItems(),
        payrollService.getAnalytics(),
      ]);

      if (empRes.statusCode === 200 && empRes.data) {
        // Map backend employees to frontend format
        const mappedEmp = empRes.data.map((e: any) => ({
          id: e.id,
          userId: e.userId,
          name: e.name,
          avatar: e.avatar,
          dept: e.dept,
          role: e.role,
          empType: e.empType as "full-time" | "part-time" | "contract",
          base: e.base_,
          hra: e.hra,
          transport: e.transport,
          medical: e.medical,
          bonus: e.bonus,
          provident: e.provident,
          incomeTax: e.incomeTax,
          insurance: e.insurance,
          gross: e.gross,
          totalDeductions: e.totalDeductions,
          net: e.net,
          bankLast4: e.bankLast4,
          bankName: e.bankName,
          taxBracket: e.taxBracket,
          ytdGross: e.ytdGross,
          ytdTax: e.ytdTax,
        }));
        setPayrollEmployees(mappedEmp);
      }

      if (runsRes.statusCode === 200 && runsRes.data) {
        // Map backend runs to frontend format
        const mappedRuns = runsRes.data.map((r: any) => ({
          id: r.id,
          runCode: r.runCode,
          period: r.period,
          status: r.status as "draft" | "processing" | "approved" | "paid" | "failed",
          employees: r.employees,
          gross: r.gross,
          deductions: r.deductions,
          net: r.net,
          initiatedBy: r.initiatedBy,
          initiatedAt: r.initiatedAt,
          paidAt: r.paidAt,
          steps: r.steps,
        }));
        setPayrollRuns(mappedRuns);
      }

      if (compRes.statusCode === 200 && compRes.data) {
        // Map backend compliance items to frontend format
        const mappedComp = compRes.data.map((c: any) => ({
          id: c.id,
          title: c.title,
          authority: c.authority,
          dueDate: c.dueDate,
          status: c.status as "filed" | "pending" | "overdue" | "upcoming",
          amount: c.amount,
          period: c.period,
          category: c.category,
        }));
        setComplianceItems(mappedComp);
      }

      if (analyticsRes.statusCode === 200 && analyticsRes.data) {
        setAnalytics({
          monthlyTrend: analyticsRes.data.monthlyTrend ?? [],
          departmentCosts: analyticsRes.data.departmentCosts ?? [],
        });
      }

      setErrorMessage("");
    } catch (error) {
      console.error("Error loading payroll data:", error);
      const message = error instanceof Error ? error.message : "Failed to load payroll data";
      if (message.toLowerCase().includes("unauthorized")) {
        setErrorMessage("Session expired. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login";
        }, 800);
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunPayroll = async () => {
    try {
      setIsCreatingRun(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (payrollEmployees.length === 0) {
        setErrorMessage("No payroll employees found for this period");
        return;
      }

      const gross = payrollEmployees.reduce((sum, e) => sum + e.gross, 0);
      const deductions = payrollEmployees.reduce((sum, e) => sum + e.totalDeductions, 0);
      const net = payrollEmployees.reduce((sum, e) => sum + e.net, 0);

      const createResponse = await payrollService.createPayrollRun({
        strPayPeriod: "March 2026",
        intEmployeeCount: payrollEmployees.length,
        decTotalGross: gross,
        decTotalDeductions: deductions,
        decTotalNetPay: net,
      });

      if (createResponse.statusCode >= 200 && createResponse.statusCode < 300) {
        setSuccessMessage("Payroll run created successfully");
        setTab("history");
        await loadPayrollData();
      } else {
        setErrorMessage(createResponse.message || "Failed to create payroll run");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create payroll run";
      setErrorMessage(message);
    } finally {
      setIsCreatingRun(false);
    }
  };

  const downloadBase64File = (fileName: string, contentType: string, base64Content: string) => {
    const binaryString = atob(base64Content);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i += 1) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: contentType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = async (section: "employees" | "runs" | "compliance") => {
    try {
      setErrorMessage("");
      const response = await payrollService.exportData(section, "March 2026");
      if (response.statusCode === 200 && response.data) {
        downloadBase64File(response.data.fileName, response.data.contentType, response.data.base64Content);
        setSuccessMessage("Payroll export downloaded successfully");
      } else {
        setErrorMessage(response.message || "Failed to export payroll data");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to export payroll data";
      setErrorMessage(message);
    }
  };

  const handleBankTransfer = async (runId: string) => {
    try {
      setErrorMessage("");
      const response = await payrollService.initiateBankTransfer(runId);
      if (response.statusCode === 200) {
        setSuccessMessage("Bank transfer initiated and payroll marked as paid");
        await loadPayrollData();
      } else {
        setErrorMessage(response.message || "Failed to initiate bank transfer");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to initiate bank transfer";
      setErrorMessage(message);
    }
  };

  const handleUpdateComplianceStatus = async (id: string, status: CompStatus) => {
    try {
      setErrorMessage("");
      const response = await payrollService.updateComplianceStatus(id, status);
      if (response.statusCode === 200) {
        setSuccessMessage(`Compliance item marked as ${status}`);
        await loadPayrollData();
      } else {
        setErrorMessage(response.message || "Failed to update compliance status");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update compliance status";
      setErrorMessage(message);
    }
  };

  const handleQuickAddCompliance = async () => {
    try {
      setErrorMessage("");
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 10);

      const response = await payrollService.createComplianceItem({
        strTitle: "New payroll compliance item",
        strAuthority: "IRS",
        strCategory: "Tax",
        dtDueDate: dueDate.toISOString(),
        strStatus: "upcoming",
        decAmount: 0,
        strPeriod: "Mar 2026",
        strDescription: "Created from payroll dashboard",
      });

      if (response.statusCode === 201 || response.statusCode === 200) {
        setSuccessMessage("Compliance item created successfully");
        await loadPayrollData();
      } else {
        setErrorMessage(response.message || "Failed to create compliance item");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create compliance item";
      setErrorMessage(message);
    }
  };

  const handleDownloadPayslip = (emp: Employee) => {
    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      setErrorMessage("Popup blocked. Please allow popups to download payslip.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Payslip-${emp.name}-March-2026</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
            h1 { margin: 0 0 8px; }
            .meta { color: #6b7280; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            td, th { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
            .total { font-weight: 700; }
          </style>
        </head>
        <body>
          <h1>Payslip - March 2026</h1>
          <div class="meta">${emp.name} (${emp.role}) | ${emp.dept} | Bank ****${emp.bankLast4}</div>
          <table>
            <tr><th>Component</th><th>Amount</th></tr>
            <tr><td>Gross</td><td>${fmt(emp.gross)}</td></tr>
            <tr><td>Total Deductions</td><td>${fmt(emp.totalDeductions)}</td></tr>
            <tr class="total"><td>Net Pay</td><td>${fmt(emp.net)}</td></tr>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleSendAllSlips = async () => {
    const payPeriod = currentRun?.period || "March 2026";
    try {
      setIsSendingAllSlips(true);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await payrollService.sendAllPayslips(payPeriod);
      if (response.statusCode === 200 && response.data) {
        const { sentCount, failedCount, skippedCount, requesterNotified } = response.data;
        const notifyStatus = requesterNotified ? "Summary mailed." : "Summary mail failed.";
        setSuccessMessage(`Payslip dispatch complete: sent ${sentCount}, failed ${failedCount}, skipped ${skippedCount}. ${notifyStatus}`);
        await loadPayrollData();
      } else {
        setErrorMessage(response.message || "Failed to send payslips");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send payslips";
      setErrorMessage(message);
    } finally {
      setIsSendingAllSlips(false);
    }
  };

  const handleAssignSalary = async (emp: Employee, form: SalaryFormValues) => {
    if (!emp.userId) {
      setErrorMessage("This employee is from local demo data. Please use backend-loaded employees to assign salary.");
      return;
    }

    try {
      setSalarySavingFor(String(emp.id));
      setErrorMessage("");
      const response = await payrollService.upsertEmployeeSalary({
        strUserGUID: emp.userId,
        strPayPeriod: form.strPayPeriod,
        strEmploymentType: form.strEmploymentType,
        decBaseSalary: form.decBaseSalary,
        decHRA: form.decHRA,
        decTransportAllowance: form.decTransportAllowance,
        decMedicalAllowance: form.decMedicalAllowance,
        decPerformanceBonus: form.decPerformanceBonus,
        decProvidentFund: form.decProvidentFund,
        decIncomeTax: form.decIncomeTax,
        decHealthInsurance: form.decHealthInsurance,
        strBankLast4: emp.bankLast4,
        strBankName: emp.bankName,
        strTaxBracket: emp.taxBracket,
      });

      if (response.statusCode === 200) {
        setSuccessMessage(`Salary saved for ${emp.name}`);
        await loadPayrollData();
      } else {
        setErrorMessage(response.message || "Failed to save salary");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to save salary";
      setErrorMessage(message);
    } finally {
      setSalarySavingFor(null);
    }
  };

  // Load payroll data on component mount
  useEffect(() => {
    loadPayrollData();
  }, []);

  // Auto-hide success feedback after a short delay.
  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [successMessage]);

  const totalGross    = payrollEmployees.reduce((s, e) => s + e.gross, 0);
  const totalNet      = payrollEmployees.reduce((s, e) => s + e.net, 0);
  const totalDed      = payrollEmployees.reduce((s, e) => s + e.totalDeductions, 0);
  const maxTrend      = Math.max(1, ...analytics.monthlyTrend.map(m => m.gross));
  const uniqueDeptColors = ["bg-blue-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-teal-500", "bg-indigo-500"];
  const monthOverMonthGrowth = analytics.monthlyTrend.length >= 2
    ? (((analytics.monthlyTrend[analytics.monthlyTrend.length - 1].gross - analytics.monthlyTrend[analytics.monthlyTrend.length - 2].gross) /
        Math.max(1, analytics.monthlyTrend[analytics.monthlyTrend.length - 2].gross)) * 100)
    : 0;

  const filteredEmps = payrollEmployees.filter(e => {
    const ms = e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase());
    const md = filterDept === "all" || e.dept.toLowerCase() === filterDept.toLowerCase();
    return ms && md;
  });

  const depts = Array.from(new Set(payrollEmployees.map(e => e.dept).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background text-foreground flex">
    

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-background/95 border-b border-border px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Payroll Management</h1>
            <p className="text-xs text-muted-foreground">Current period payroll operations · {payrollEmployees.length} employees</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs h-8"
              onClick={() => handleExport("employees")}
            >
              <Download className="w-3.5 h-3.5" />Export
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs h-8"
              onClick={handleRunPayroll}
              disabled={isCreatingRun}
            >
              {isCreatingRun ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              {isCreatingRun ? "Running..." : "Run Payroll"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
              {successMessage}
            </div>
          )}

          {isLoading && (
            <div className="rounded-lg border bg-white dark:bg-gray-900 px-3 py-2 text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading payroll data...
            </div>
          )}

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
              {!currentRun ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6 text-sm text-muted-foreground">
                    No payroll run found for this period. Click Run Payroll to create one.
                  </CardContent>
                </Card>
              ) : (
              <div className="grid grid-cols-3 gap-4">
                {/* Steps wizard */}
                <Card className="col-span-2 border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">March 2026 Payroll Run — {currentRunLabel}</CardTitle>
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
                      <Button
                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs h-8 gap-1.5"
                        onClick={() => handleBankTransfer(currentRun.id)}
                        disabled={currentRun.status !== "approved"}
                      >
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
                        { label: "Full-time",    val: `${payrollEmployees.filter((e) => e.empType === "full-time").length}` },
                        { label: "Contract",     val: `${payrollEmployees.filter((e) => e.empType === "contract").length}` },
                        { label: "Gross Payroll",val: fmt(currentRun.gross), bold: true },
                        { label: "Total Tax",    val: fmt(payrollEmployees.reduce((s,e)=>s+e.incomeTax,0)) },
                        { label: "Provident",    val: fmt(payrollEmployees.reduce((s,e)=>s+e.provident,0)) },
                        { label: "Insurance",    val: fmt(payrollEmployees.reduce((s,e)=>s+e.insurance,0)) },
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
              )}
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1"
                        onClick={handleSendAllSlips}
                        disabled={isSendingAllSlips || filteredEmps.length === 0}
                      >
                        {isSendingAllSlips ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        {isSendingAllSlips ? "Sending..." : "Send All Slips"}
                      </Button>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Bank details are managed in Employee create/edit form.</p>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-[980px] w-full border-separate border-spacing-y-2">
                      <thead>
                        <tr className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
                          <th className="text-left px-2 py-1 w-[28%]">Employee</th>
                          <th className="text-center px-2 py-1 w-[8%]">Type</th>
                          <th className="text-right px-2 py-1 w-[14%]">Gross</th>
                          <th className="text-right px-2 py-1 w-[14%]">Deductions</th>
                          <th className="text-right px-2 py-1 w-[14%]">Net Pay</th>
                          <th className="text-center px-2 py-1 w-[12%]">Bank</th>
                          <th className="text-right px-2 py-1 w-[10%]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEmps.map(e => (
                          <tr key={e.id} className="bg-muted/10 hover:bg-muted/20 transition-colors">
                            <td className="px-2 py-3 rounded-l-lg">
                              <div className="flex items-center gap-2 min-w-0">
                                <Avatar className="w-7 h-7 flex-shrink-0">
                                  <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">{e.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold truncate">{e.name}</p>
                                  <p className="text-[10px] text-muted-foreground truncate">{e.dept}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-2 py-3 text-center align-middle">
                              <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${e.empType === "contract" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" : "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"}`}>
                                {e.empType === "full-time" ? "FT" : e.empType === "contract" ? "CTR" : "PT"}
                              </span>
                            </td>
                            <td className="px-2 py-3 text-right align-middle">
                              <p className="text-xs font-semibold">{fmt(e.gross)}</p>
                              <p className="text-[10px] text-muted-foreground">Base: {fmt(e.base)}</p>
                            </td>
                            <td className="px-2 py-3 text-right align-middle">
                              <p className="text-xs font-semibold text-red-500">–{fmt(e.totalDeductions)}</p>
                              <p className="text-[10px] text-muted-foreground">Tax: {fmt(e.incomeTax)}</p>
                            </td>
                            <td className="px-2 py-3 text-right align-middle">
                              <p className="text-sm font-bold text-violet-700">{fmt(e.net)}</p>
                            </td>
                            <td className="px-2 py-3 text-center align-middle">
                              <div className="flex flex-col items-center leading-tight">
                                <div className="flex items-center gap-1">
                                  <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                                  <span className="text-[10px] font-semibold truncate max-w-[120px]">{e.bankName || "Not set"}</span>
                                </div>
                                <span className="text-[9px] text-muted-foreground">{e.bankLast4 ? `•••• ${e.bankLast4}` : "No account"}</span>
                              </div>
                            </td>
                            <td className="px-2 py-3 text-right align-middle rounded-r-lg">
                              <div className="flex justify-end gap-1 whitespace-nowrap">
                                <SalaryAssignDialog emp={e} isSaving={salarySavingFor === String(e.id)} onSubmit={handleAssignSalary} />
                                <PayslipDialog emp={e} onDownload={handleDownloadPayslip} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="min-w-[980px] flex items-center justify-between py-3 mt-2 border-t px-2 font-bold">
                      <p className="text-xs">TOTAL ({filteredEmps.length} employees)</p>
                      <div className="flex items-center gap-6 text-right">
                        <p className="text-xs text-emerald-700">{fmt(filteredEmps.reduce((s,e)=>s+e.gross,0))}</p>
                        <p className="text-xs text-red-500">–{fmt(filteredEmps.reduce((s,e)=>s+e.totalDeductions,0))}</p>
                        <p className="text-sm text-violet-700">{fmt(filteredEmps.reduce((s,e)=>s+e.net,0))}</p>
                      </div>
                    </div>
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => handleExport("runs")}
                    >
                      <Download className="w-3 h-3" />Export All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4 space-y-3">
                  {payrollRuns.map(run => {
                    const cfg = runStatusCfg[run.status];
                    const done = run.steps.filter(s=>s.done).length;
                    return (
                      <div key={run.id} className="p-4 rounded-xl border border-border hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${cfg.dot}`} />
                            <div>
                              <p className="text-sm font-bold">{run.period}</p>
                              <p className="text-xs text-muted-foreground">{run.runCode || run.id} · {run.initiatedAt}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                            <RunDetailDialog run={run} onInitiateBankTransfer={handleBankTransfer} />
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
                      <Button
                        size="sm"
                        className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-1"
                        onClick={handleQuickAddCompliance}
                      >
                        <Plus className="w-3 h-3" />Add Item
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: "Filed",    count: complianceItems.filter(c=>c.status==="filed").length,    color: "text-emerald-600 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-900" },
                      { label: "Pending",  count: complianceItems.filter(c=>c.status==="pending").length,  color: "text-amber-600 dark:text-amber-300",   bg: "bg-amber-50 dark:bg-amber-950/40",   border: "border-amber-200 dark:border-amber-900" },
                      { label: "Overdue",  count: complianceItems.filter(c=>c.status==="overdue").length,  color: "text-red-600 dark:text-red-300",     bg: "bg-red-50 dark:bg-red-950/40",     border: "border-red-200 dark:border-red-900" },
                      { label: "Upcoming", count: complianceItems.filter(c=>c.status==="upcoming").length, color: "text-blue-600 dark:text-blue-300",    bg: "bg-blue-50 dark:bg-blue-950/40",    border: "border-blue-200 dark:border-blue-900" },
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
                  {complianceItems.map(c => {
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
                        <div className="col-span-2 flex justify-center items-center gap-1">
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                          {c.status !== "filed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 text-[10px] px-2"
                              onClick={() => handleUpdateComplianceStatus(String(c.id), "filed")}
                            >
                              Mark Filed
                            </Button>
                          )}
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
                      {analytics.monthlyTrend.map(m => {
                        const pct = (m.gross / maxTrend) * 100;
                        const isCurrent = m.month === analytics.monthlyTrend[analytics.monthlyTrend.length - 1]?.month;
                        return (
                          <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-muted-foreground font-semibold">{fmt(m.gross/1000).replace("$","$")}k</span>
                            <div className="w-full rounded-t-md" style={{ height: `${pct * 0.88}%`, backgroundColor: isCurrent ? "#7c3aed" : "#c4b5fd" }} />
                            <span className={`text-[10px] font-semibold ${isCurrent ? "text-violet-700" : "text-muted-foreground"}`}>{m.month}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-muted/40 rounded-xl">
                        <p className="text-xs text-muted-foreground">MoM Growth</p>
                        <p className="text-lg font-bold text-emerald-600 flex items-center gap-1"><TrendingUp className="w-4 h-4" />{monthOverMonthGrowth.toFixed(1)}%</p>
                      </div>
                      <div className="p-3 bg-muted/40 rounded-xl">
                        <p className="text-xs text-muted-foreground">YTD Total</p>
                        <p className="text-lg font-bold">{fmt(analytics.monthlyTrend.reduce((s,m)=>s+m.gross,0))}</p>
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
                    {analytics.departmentCosts.map((d, idx) => (
                      <div key={d.department}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-semibold">{d.department}</span>
                          <span className="text-muted-foreground">{d.staffCount} staff · <span className="font-bold text-foreground">{fmt(d.cost)}</span> <span className="text-[10px]">({d.percentage}%)</span></span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                          <div className={`h-2 rounded-full ${uniqueDeptColors[idx % uniqueDeptColors.length]}`} style={{ width: `${d.percentage}%` }} />
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
                        { label: "Base Salary",    pct: 62, color: "bg-violet-500",  val: fmt(payrollEmployees.reduce((s,e)=>s+e.base,0)) },
                        { label: "Allowances",     pct: 22, color: "bg-emerald-500", val: fmt(payrollEmployees.reduce((s,e)=>s+e.hra+e.transport+e.medical,0)) },
                        { label: "Bonuses",        pct: 9,  color: "bg-amber-500",   val: fmt(payrollEmployees.reduce((s,e)=>s+e.bonus,0)) },
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
                    {[...payrollEmployees].sort((a,b)=>b.ytdGross-a.ytdGross).slice(0,6).map((e,i) => (
                      <div key={e.id} className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted/30 transition-colors">
                        <span className="w-5 text-xs font-bold text-muted-foreground text-center">{i+1}</span>
                        <Avatar className="w-7 h-7 flex-shrink-0">
                          <AvatarFallback className="text-[10px] font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">{e.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{e.name}</p>
                          <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1 mt-1">
                            <div className="h-1 rounded-full bg-violet-500" style={{ width: `${payrollEmployees[0] ? (e.ytdGross / payrollEmployees[0].ytdGross) * 100 : 0}%` }} />
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
