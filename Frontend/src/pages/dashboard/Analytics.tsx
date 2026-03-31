import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Bell,
  Star,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Target,
  Award,
  MessageSquare,
  ThumbsUp,
  Edit3,
  Plus,
  Search,
  Flag,
  Zap,
  BarChart2,
  Check,
} from "lucide-react";

type ReviewStatus = "completed" | "in-progress" | "pending" | "overdue";
type GoalStatus  = "on-track" | "at-risk" | "completed" | "not-started";
type Rating      = 1 | 2 | 3 | 4 | 5;

interface Employee {
  id: number;
  name: string;
  avatar: string;
  role: string;
  department: string;
  manager: string;
  reviewStatus: ReviewStatus;
  overallRating: Rating;
  goalsCompleted: number;
  goalsTotal: number;
  trend: "up" | "down" | "flat";
  lastReview: string;
  nextReview: string;
  strengths: string[];
  improvements: string[];
  scores: { label: string; score: number }[];
}

interface Goal {
  id: number;
  employee: string;
  avatar: string;
  title: string;
  department: string;
  progress: number;
  status: GoalStatus;
  dueDate: string;
  category: "performance" | "learning" | "leadership" | "project";
  keyResults: { label: string; done: boolean }[];
}

const reviewStatusConfig: Record<ReviewStatus, { label: string; color: string; bg: string; border: string }> = {
  completed:   { label: "Completed",   color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40",  border: "border-emerald-200 dark:border-emerald-800" },
  "in-progress":{ label: "In Progress",color: "text-blue-700 dark:text-blue-300",    bg: "bg-blue-50 dark:bg-blue-950/40",     border: "border-blue-200 dark:border-blue-800" },
  pending:     { label: "Pending",      color: "text-amber-700 dark:text-amber-300",  bg: "bg-amber-50 dark:bg-amber-950/40",    border: "border-amber-200 dark:border-amber-800" },
  overdue:     { label: "Overdue",      color: "text-red-700 dark:text-red-300",    bg: "bg-red-50 dark:bg-red-950/40",      border: "border-red-200 dark:border-red-800" },
};

const goalStatusConfig: Record<GoalStatus, { label: string; color: string; bg: string; border: string; bar: string }> = {
  "on-track":   { label: "On Track",    color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-950/40",  border: "border-emerald-200 dark:border-emerald-800", bar: "bg-emerald-500" },
  "at-risk":    { label: "At Risk",     color: "text-amber-700 dark:text-amber-300",   bg: "bg-amber-50 dark:bg-amber-950/40",    border: "border-amber-200 dark:border-amber-800",   bar: "bg-amber-500" },
  completed:    { label: "Completed",   color: "text-violet-700 dark:text-violet-300",  bg: "bg-violet-50 dark:bg-violet-950/40",   border: "border-violet-200 dark:border-violet-800",  bar: "bg-violet-500" },
  "not-started":{ label: "Not Started", color: "text-gray-600 dark:text-slate-300",    bg: "bg-gray-50 dark:bg-slate-800",     border: "border-gray-200 dark:border-slate-700",    bar: "bg-gray-300 dark:bg-slate-600" },
};

const categoryConfig: Record<Goal["category"], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  performance: { label: "Performance", color: "text-violet-700 dark:text-violet-300", bg: "bg-violet-100 dark:bg-violet-900/40", icon: <Zap className="w-3 h-3" /> },
  learning:    { label: "Learning",    color: "text-blue-700 dark:text-blue-300",   bg: "bg-blue-100 dark:bg-blue-900/40",   icon: <Target className="w-3 h-3" /> },
  leadership:  { label: "Leadership",  color: "text-amber-700 dark:text-amber-300",  bg: "bg-amber-100 dark:bg-amber-900/40",  icon: <Award className="w-3 h-3" /> },
  project:     { label: "Project",     color: "text-teal-700 dark:text-teal-300",   bg: "bg-teal-100 dark:bg-teal-900/40",   icon: <Flag className="w-3 h-3" /> },
};

const employees: Employee[] = [
  {
    id: 1, name: "Sarah Johnson",   avatar: "SJ", role: "Senior Dev",     department: "Engineering", manager: "David Park",   reviewStatus: "completed",   overallRating: 5, goalsCompleted: 4, goalsTotal: 4, trend: "up",   lastReview: "Dec 2025", nextReview: "Jun 2026",
    strengths: ["Technical Excellence", "Mentoring", "Problem Solving"],
    improvements: ["Cross-team collaboration"],
    scores: [{ label: "Technical Skills", score: 95 }, { label: "Leadership", score: 82 }, { label: "Communication", score: 88 }, { label: "Delivery", score: 96 }, { label: "Innovation", score: 90 }],
  },
  {
    id: 2, name: "Michael Chen",    avatar: "MC", role: "UI Designer",    department: "Design",      manager: "Aisha Patel",  reviewStatus: "completed",   overallRating: 4, goalsCompleted: 3, goalsTotal: 4, trend: "up",   lastReview: "Dec 2025", nextReview: "Jun 2026",
    strengths: ["Design Systems", "User Research", "Visual Design"],
    improvements: ["Handoff Documentation"],
    scores: [{ label: "Technical Skills", score: 90 }, { label: "Creativity", score: 94 }, { label: "Communication", score: 80 }, { label: "Delivery", score: 85 }, { label: "Collaboration", score: 88 }],
  },
  {
    id: 3, name: "Emily Rodriguez", avatar: "ER", role: "Mktg Lead",      department: "Marketing",   manager: "Aisha Patel",  reviewStatus: "in-progress", overallRating: 4, goalsCompleted: 2, goalsTotal: 4, trend: "flat", lastReview: "Dec 2025", nextReview: "Apr 2026",
    strengths: ["Campaign Strategy", "Analytics"],
    improvements: ["Budget Management", "Reporting Cadence"],
    scores: [{ label: "Strategy",  score: 88 }, { label: "Analytics", score: 82 }, { label: "Communication", score: 86 }, { label: "Delivery", score: 75 }, { label: "Creativity", score: 85 }],
  },
  {
    id: 4, name: "James Kim",       avatar: "JK", role: "Sales Rep",      department: "Sales",       manager: "Tom Harris",   reviewStatus: "in-progress", overallRating: 4, goalsCompleted: 3, goalsTotal: 5, trend: "up",   lastReview: "Dec 2025", nextReview: "Apr 2026",
    strengths: ["Pipeline Management", "Closing Deals"],
    improvements: ["CRM Hygiene"],
    scores: [{ label: "Sales Skills", score: 91 }, { label: "Customer Rel.", score: 88 }, { label: "Communication", score: 84 }, { label: "Quota Attain.", score: 96 }, { label: "Collaboration", score: 78 }],
  },
  {
    id: 5, name: "David Park",      avatar: "DP", role: "Backend Dev",    department: "Engineering", manager: "Sarah Johnson",reviewStatus: "pending",     overallRating: 4, goalsCompleted: 2, goalsTotal: 4, trend: "up",   lastReview: "Dec 2025", nextReview: "Apr 2026",
    strengths: ["System Design", "Performance Optimization"],
    improvements: ["Documentation", "Proactive Communication"],
    scores: [{ label: "Technical Skills", score: 93 }, { label: "Architecture", score: 88 }, { label: "Communication", score: 70 }, { label: "Delivery", score: 85 }, { label: "Innovation", score: 87 }],
  },
  {
    id: 6, name: "Aisha Patel",     avatar: "AP", role: "HR Manager",     department: "HR",          manager: "Admin",        reviewStatus: "completed",   overallRating: 5, goalsCompleted: 5, goalsTotal: 5, trend: "up",   lastReview: "Dec 2025", nextReview: "Jun 2026",
    strengths: ["People Strategy", "Conflict Resolution", "Leadership"],
    improvements: ["Data-driven HR metrics"],
    scores: [{ label: "People Skills", score: 97 }, { label: "Strategy", score: 90 }, { label: "Communication", score: 95 }, { label: "Leadership", score: 92 }, { label: "Innovation", score: 84 }],
  },
  {
    id: 7, name: "Lisa Wang",       avatar: "LW", role: "Analyst",        department: "Finance",     manager: "Aisha Patel",  reviewStatus: "overdue",     overallRating: 3, goalsCompleted: 1, goalsTotal: 3, trend: "down", lastReview: "Dec 2025", nextReview: "Mar 2026",
    strengths: ["Data Modeling", "Excel"],
    improvements: ["Communication", "Proactivity", "Ownership"],
    scores: [{ label: "Technical Skills", score: 78 }, { label: "Analysis", score: 80 }, { label: "Communication", score: 62 }, { label: "Delivery", score: 70 }, { label: "Collaboration", score: 68 }],
  },
  {
    id: 8, name: "Tom Harris",      avatar: "TH", role: "Sales Lead",     department: "Sales",       manager: "Admin",        reviewStatus: "completed",   overallRating: 5, goalsCompleted: 5, goalsTotal: 5, trend: "up",   lastReview: "Dec 2025", nextReview: "Jun 2026",
    strengths: ["Revenue Growth", "Team Leadership", "Negotiation"],
    improvements: ["Forecasting Accuracy"],
    scores: [{ label: "Sales Skills", score: 96 }, { label: "Leadership", score: 94 }, { label: "Communication", score: 91 }, { label: "Quota Attain.", score: 130 }, { label: "Collaboration", score: 88 }],
  },
];

const goals: Goal[] = [
  { id: 1, employee: "Sarah Johnson",   avatar: "SJ", title: "Launch new component library",    department: "Engineering", progress: 100, status: "completed",   dueDate: "Mar 31",  category: "project",     keyResults: [{ label: "Design tokens finalized", done: true }, { label: "50+ components built", done: true }, { label: "Docs published", done: true }] },
  { id: 2, employee: "Tom Harris",      avatar: "TH", title: "Exceed Q1 sales quota by 20%",   department: "Sales",       progress: 130, status: "completed",   dueDate: "Mar 31",  category: "performance", keyResults: [{ label: "$520k pipeline closed", done: true }, { label: "8 new accounts", done: true }, { label: "Upsell existing base", done: true }] },
  { id: 3, employee: "Michael Chen",    avatar: "MC", title: "Redesign onboarding flow",        department: "Design",      progress: 75,  status: "on-track",   dueDate: "Apr 15",  category: "project",     keyResults: [{ label: "User research complete", done: true }, { label: "Wireframes approved", done: true }, { label: "Hi-fi designs shipped", done: false }] },
  { id: 4, employee: "Emily Rodriguez", avatar: "ER", title: "Grow organic traffic by 40%",    department: "Marketing",   progress: 58,  status: "at-risk",    dueDate: "Apr 30",  category: "performance", keyResults: [{ label: "10 new blog posts", done: true }, { label: "SEO audit complete", done: false }, { label: "Backlink campaign", done: false }] },
  { id: 5, employee: "David Park",      avatar: "DP", title: "Complete AWS certification",      department: "Engineering", progress: 45,  status: "on-track",   dueDate: "May 15",  category: "learning",    keyResults: [{ label: "Course modules done", done: true }, { label: "Practice exams", done: false }, { label: "Exam scheduled", done: false }] },
  { id: 6, employee: "Aisha Patel",     avatar: "AP", title: "Launch employee wellness program",department: "HR",          progress: 90,  status: "on-track",   dueDate: "Apr 1",   category: "leadership",  keyResults: [{ label: "Vendor selected", done: true }, { label: "Pilot with 30 employees", done: true }, { label: "Full rollout", done: false }] },
  { id: 7, employee: "James Kim",       avatar: "JK", title: "Achieve SDR quota 3 months in a row",department: "Sales",   progress: 66,  status: "on-track",   dueDate: "May 31",  category: "performance", keyResults: [{ label: "Jan quota hit", done: true }, { label: "Feb quota hit", done: true }, { label: "Mar quota hit", done: false }] },
  { id: 8, employee: "Lisa Wang",       avatar: "LW", title: "Build automated FP&A dashboard",  department: "Finance",     progress: 20,  status: "at-risk",    dueDate: "Apr 15",  category: "project",     keyResults: [{ label: "Requirements doc", done: true }, { label: "Data pipeline", done: false }, { label: "Dashboard live", done: false }] },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => <Star key={i} className={`w-3.5 h-3.5 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-slate-600"}`} />)}
    </div>
  );
}

function ReviewDetailDialog({ emp }: { emp: Employee }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1"><FileText className="w-3.5 h-3.5" />Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <div className="h-16 -mx-6 -mt-6 mb-4 bg-gradient-to-r from-violet-600 to-indigo-500 rounded-t-xl flex items-center px-6 gap-3">
            <Avatar className="w-10 h-10 border-2 border-white/30">
              <AvatarFallback className="text-sm font-bold bg-white/20 text-white">{emp.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-white text-sm font-bold">{emp.name}</DialogTitle>
              <p className="text-white/75 text-xs">{emp.role} · {emp.department}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Overall Rating */}
          <div className="flex items-center justify-between p-4 bg-muted/40 rounded-xl">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Overall Rating</p>
              <div className="flex items-center gap-2 mt-1">
                <StarDisplay rating={emp.overallRating} />
                <span className="text-lg font-bold">{emp.overallRating}.0 / 5.0</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Review Period</p>
              <p className="text-sm font-semibold">H2 2025</p>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${reviewStatusConfig[emp.reviewStatus].color} ${reviewStatusConfig[emp.reviewStatus].bg} ${reviewStatusConfig[emp.reviewStatus].border}`}>
                {reviewStatusConfig[emp.reviewStatus].label}
              </span>
            </div>
          </div>

          {/* Score bars */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Competency Scores</p>
            <div className="space-y-3">
              {emp.scores.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{s.label}</span>
                    <span className={`font-bold ${s.score >= 90 ? "text-emerald-600" : s.score >= 75 ? "text-blue-600" : "text-amber-600"}`}>{Math.min(s.score, 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${s.score >= 90 ? "bg-emerald-500" : s.score >= 75 ? "bg-blue-500" : "bg-amber-500"}`} style={{ width: `${Math.min(s.score, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <p className="text-2xl font-bold text-emerald-700">{emp.goalsCompleted}</p>
              <p className="text-xs text-emerald-600 font-semibold">Goals Completed</p>
            </div>
            <div className="text-center p-3 bg-muted/40 rounded-xl border">
              <p className="text-2xl font-bold">{emp.goalsTotal}</p>
              <p className="text-xs text-muted-foreground font-semibold">Goals Set</p>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Strengths</p>
              <div className="space-y-1.5">
                {emp.strengths.map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <ThumbsUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Areas to Improve</p>
              <div className="space-y-1.5">
                {emp.improvements.map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    <span className="text-xs">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Manager comment */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Manager Comment</p>
            <div className="p-3 bg-muted/30 rounded-xl border text-xs text-muted-foreground leading-relaxed">
              {emp.overallRating >= 5
                ? `${emp.name} has been an outstanding contributor this review period. Their technical expertise and collaborative approach have had a measurable impact on the team's output. Highly recommend for a senior role expansion.`
                : emp.overallRating >= 4
                ? `${emp.name} consistently delivers quality work and is growing into greater responsibilities. A few areas to sharpen but overall a strong performer with clear upward trajectory.`
                : `${emp.name} shows potential but needs focused development in key areas. We've outlined a PIP with monthly check-ins to support improvement over the next quarter.`}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs gap-1.5 h-8"><Edit3 className="w-3.5 h-3.5" />Edit Review</Button>
            <Button variant="outline" className="text-xs gap-1.5 h-8"><MessageSquare className="w-3.5 h-3.5" />Add Feedback</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GoalDetailDialog({ goal }: { goal: Goal }) {
  const cfg = goalStatusConfig[goal.status];
  const cat = categoryConfig[goal.category];
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1"><Target className="w-3.5 h-3.5" />Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="h-14 -mx-6 -mt-6 mb-4 bg-gradient-to-r from-indigo-600 to-violet-500 rounded-t-xl flex items-center px-5 gap-3">
            <div className={`px-2 py-1 rounded-lg ${cat.bg} flex items-center gap-1`}>
              <span className={cat.color}>{cat.icon}</span>
              <span className={`text-[10px] font-bold ${cat.color}`}>{cat.label}</span>
            </div>
            <DialogTitle className="text-white text-sm font-bold truncate">{goal.title}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">{goal.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{goal.employee}</p>
              <p className="text-xs text-muted-foreground">{goal.department} · Due {goal.dueDate}</p>
            </div>
            <span className={`ml-auto text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="font-semibold text-muted-foreground">Progress</span>
              <span className={`font-bold ${goal.progress >= 100 ? "text-violet-600" : goal.status === "at-risk" ? "text-amber-600" : "text-emerald-600"}`}>{goal.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3">
              <div className={`h-3 rounded-full ${cfg.bar}`} style={{ width: `${Math.min(goal.progress, 100)}%` }} />
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Key Results</p>
            <div className="space-y-2">
              {goal.keyResults.map((kr, i) => (
                <div key={i} className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${kr.done ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${kr.done ? "bg-emerald-500" : "bg-gray-200"}`}>
                    {kr.done ? <Check className="w-3 h-3 text-white" /> : <span className="w-2 h-2 rounded-full bg-gray-400" />}
                  </div>
                  <span className={`text-xs ${kr.done ? "text-emerald-800 line-through decoration-emerald-400" : "text-muted-foreground"}`}>{kr.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1 border-t">
            <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-xs gap-1 h-8"><Edit3 className="w-3.5 h-3.5" />Edit Goal</Button>
            <Button variant="outline" className="text-xs gap-1 h-8"><MessageSquare className="w-3.5 h-3.5" />Comment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PerformanceManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterGoalStatus, setFilterGoalStatus] = useState("all");

  const depts = ["Engineering", "Sales", "Design", "Marketing", "Finance", "HR"];

  const filteredEmployees = employees.filter(e => {
    const ms = e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase());
    const md = filterDept === "all" || e.department.toLowerCase() === filterDept.toLowerCase();
    const mr = filterStatus === "all" || e.reviewStatus === filterStatus;
    return ms && md && mr;
  });

  const filteredGoals = goals.filter(g => {
    const ms = g.employee.toLowerCase().includes(search.toLowerCase()) || g.department.toLowerCase().includes(search.toLowerCase());
    const md = filterDept === "all" || g.department.toLowerCase() === filterDept.toLowerCase();
    const mr = filterGoalStatus === "all" || g.status === filterGoalStatus;
    return ms && md && mr;
  });

  const completedCount   = employees.filter(e => e.reviewStatus === "completed").length;
  const overdueCount     = employees.filter(e => e.reviewStatus === "overdue").length;
  const avgRating        = (employees.reduce((s, e) => s + e.overallRating, 0) / employees.length).toFixed(1);
  const goalsOnTrack     = goals.filter(g => g.status === "on-track" || g.status === "completed").length;

  const ratingDist = [5,4,3,2,1].map(r => ({ rating: r, count: employees.filter(e => e.overallRating === r).length }));

  // Dept avg ratings
  const deptRatings = depts.map(d => {
    const emps = employees.filter(e => e.department === d);
    return { dept: d, avg: emps.length ? emps.reduce((s,e)=>s+e.overallRating,0)/emps.length : 0, count: emps.length };
  }).filter(d => d.count > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-foreground flex">
     

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Performance Management</h1>
            <p className="text-xs text-muted-foreground">H1 2026 Review Cycle · Q1 closes Mar 31</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
              <Bell className="w-4 h-4" />
              {overdueCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{overdueCount}</span>}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8"><BarChart2 className="w-3.5 h-3.5" />Export Report</Button>
            <Button size="sm" className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs h-8"><Plus className="w-3.5 h-3.5" />New Review</Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          {/* Top KPI cards */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Avg Rating",        value: avgRating, sub: "across all staff",        icon: <Star className="w-4 h-4 text-amber-500" />,     bg: "bg-amber-50",   extra: <StarDisplay rating={4} /> },
              { label: "Reviews Completed", value: `${completedCount}/${employees.length}`,   sub: "H1 2026 cycle",      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, bg: "bg-emerald-50", extra: null },
              { label: "Goals On Track",    value: `${goalsOnTrack}/${goals.length}`,         sub: "active objectives",  icon: <Target className="w-4 h-4 text-violet-600" />,        bg: "bg-violet-50",  extra: null },
              { label: "Overdue Reviews",   value: overdueCount, sub: "require attention",    icon: <AlertCircle className="w-4 h-4 text-red-500" />,  bg: "bg-red-50",     extra: null },
            ].map(s => (
              <Card key={s.label} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${s.bg}`}>{s.icon}</div>
                    {s.extra}
                  </div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs font-semibold mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-muted-foreground">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white dark:bg-slate-900 border dark:border-slate-700 shadow-sm h-9">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs">
                Reviews
                {overdueCount > 0 && <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-bold">{overdueCount}</span>}
              </TabsTrigger>
              <TabsTrigger value="goals" className="text-xs">Goals & OKRs</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
            </TabsList>

            {/* OVERVIEW */}
            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Rating distribution */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Rating Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-2">
                    {ratingDist.map(r => (
                      <div key={r.rating} className="flex items-center gap-2">
                        <div className="flex gap-0.5 w-20 flex-shrink-0">
                          {[1,2,3,4,5].map(i => <Star key={i} className={`w-2.5 h-2.5 ${i <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 dark:text-slate-600"}`} />)}
                        </div>
                        <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                          <div className="h-2 rounded-full bg-amber-400" style={{ width: `${(r.count / employees.length) * 100}%` }} />
                        </div>
                        <span className="text-xs font-semibold w-4 text-right">{r.count}</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Overall average</span>
                      <span className="font-bold text-amber-600">{avgRating} / 5.0</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent reviews */}
                <Card className="col-span-2 border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Recent Reviews</CardTitle>
                      <Button variant="ghost" size="sm" className="text-xs text-violet-600 h-6 px-2" onClick={() => setActiveTab("reviews")}>View all</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    {employees.slice(0, 5).map(e => {
                      const cfg = reviewStatusConfig[e.reviewStatus];
                      return (
                        <div key={e.id} className="flex items-center gap-3 py-2.5 border-b last:border-0">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">{e.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{e.name}</p>
                            <p className="text-xs text-muted-foreground">{e.department} · {e.role}</p>
                          </div>
                          <StarDisplay rating={e.overallRating} />
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                          <div className="flex items-center gap-0.5 text-xs font-semibold ml-2">
                            {e.trend === "up" ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : e.trend === "down" ? <TrendingDown className="w-3.5 h-3.5 text-red-400" /> : <span className="w-3.5 h-0.5 bg-gray-300 rounded" />}
                          </div>
                          <ReviewDetailDialog emp={e} />
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Top goals overview */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Active Goals</CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs text-violet-600 h-6 px-2" onClick={() => setActiveTab("goals")}>View all</Button>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    {goals.slice(0, 4).map(g => {
                      const cfg = goalStatusConfig[g.status];
                      const cat = categoryConfig[g.category];
                      return (
                        <div key={g.id} className="p-3 rounded-xl border dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-2">
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cat.bg} ${cat.color}`}>
                              {cat.icon}{cat.label}
                            </div>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                          </div>
                          <p className="text-xs font-semibold mb-1 leading-snug">{g.title}</p>
                          <p className="text-[10px] text-muted-foreground mb-2">{g.employee} · Due {g.dueDate}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${cfg.bar}`} style={{ width: `${Math.min(g.progress, 100)}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-muted-foreground">{g.progress}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* REVIEWS */}
            <TabsContent value="reviews" className="mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Performance Reviews — H1 2026</CardTitle>
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
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="h-7 text-xs w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div className="flex text-[10px] text-muted-foreground font-semibold uppercase tracking-wide px-2 mb-2 gap-3">
                    <span className="flex-1">Employee</span>
                    <span className="w-24 text-center hidden md:block">Goals</span>
                    <span className="w-28 text-center">Rating</span>
                    <span className="w-24 text-center">Trend</span>
                    <span className="w-28 text-center">Status</span>
                    <span className="w-24 text-center">Next Review</span>
                    <span className="w-16" />
                  </div>
                  {filteredEmployees.map(e => {
                    const cfg = reviewStatusConfig[e.reviewStatus];
                    return (
                      <div key={e.id} className="flex items-center gap-3 py-3 border-b last:border-0 hover:bg-muted/20 px-2 rounded-lg transition-colors">
                        <Avatar className="w-9 h-9 flex-shrink-0">
                          <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">{e.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{e.name}</p>
                          <p className="text-xs text-muted-foreground">{e.role} · {e.department}</p>
                        </div>
                        <div className="w-24 hidden md:block text-center">
                          <Progress value={(e.goalsCompleted / e.goalsTotal) * 100} className="h-1.5 mb-1" />
                          <span className="text-[10px] text-muted-foreground">{e.goalsCompleted}/{e.goalsTotal}</span>
                        </div>
                        <div className="w-28 flex justify-center flex-col items-center gap-0.5">
                          <StarDisplay rating={e.overallRating} />
                          <span className="text-[10px] text-muted-foreground">{e.overallRating}.0 / 5.0</span>
                        </div>
                        <div className="w-24 flex justify-center">
                          {e.trend === "up"   && <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold"><TrendingUp className="w-3.5 h-3.5" />Improving</span>}
                          {e.trend === "down" && <span className="flex items-center gap-1 text-xs text-red-500 font-semibold"><TrendingDown className="w-3.5 h-3.5" />Declining</span>}
                          {e.trend === "flat" && <span className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">— Stable</span>}
                        </div>
                        <div className="w-28 flex justify-center">
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                        </div>
                        <div className="w-24 text-center text-xs text-muted-foreground">{e.nextReview}</div>
                        <div className="w-16 flex justify-end">
                          <ReviewDetailDialog emp={e} />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* GOALS */}
            <TabsContent value="goals" className="mt-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3 pt-4 px-5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Goals & OKRs</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input className="h-7 pl-7 text-xs w-36" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
                      </div>
                      <Select value={filterGoalStatus} onValueChange={setFilterGoalStatus}>
                        <SelectTrigger className="h-7 text-xs w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="on-track">On Track</SelectItem>
                          <SelectItem value="at-risk">At Risk</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="not-started">Not Started</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button size="sm" className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white gap-1"><Plus className="w-3 h-3" />Add Goal</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <div className="flex text-[10px] text-muted-foreground font-semibold uppercase tracking-wide px-2 mb-2 gap-3">
                    <span className="flex-1">Goal</span>
                    <span className="w-20 text-center">Category</span>
                    <span className="w-28 text-center">Progress</span>
                    <span className="w-24 text-center">Due</span>
                    <span className="w-24 text-center">Status</span>
                    <span className="w-16" />
                  </div>
                  {filteredGoals.map(g => {
                    const cfg = goalStatusConfig[g.status];
                    const cat = categoryConfig[g.category];
                    return (
                      <div key={g.id} className="flex items-center gap-3 py-3 border-b last:border-0 hover:bg-muted/20 px-2 rounded-lg transition-colors">
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">{g.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{g.title}</p>
                          <p className="text-xs text-muted-foreground">{g.employee} · {g.department}</p>
                        </div>
                        <div className="w-20 flex justify-center">
                          <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-semibold ${cat.bg} ${cat.color}`}>
                            {cat.icon}{cat.label}
                          </span>
                        </div>
                        <div className="w-28 flex flex-col items-center gap-1">
                          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${cfg.bar}`} style={{ width: `${Math.min(g.progress, 100)}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground font-semibold">{g.progress}%</span>
                        </div>
                        <div className="w-24 text-center text-xs text-muted-foreground">{g.dueDate}</div>
                        <div className="w-24 flex justify-center">
                          <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                        </div>
                        <div className="w-16 flex justify-end">
                          <GoalDetailDialog goal={g} />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ANALYTICS */}
            <TabsContent value="analytics" className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Dept avg ratings */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Avg Rating by Department</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-3">
                    {deptRatings.sort((a,b) => b.avg - a.avg).map((d, i) => {
                      const colors = ["bg-violet-500","bg-blue-500","bg-emerald-500","bg-amber-500","bg-rose-500","bg-teal-500"];
                      return (
                        <div key={d.dept}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-semibold">{d.dept}</span>
                            <span className="text-muted-foreground">{d.count} staff · <span className="font-bold text-foreground">{d.avg.toFixed(1)} ★</span></span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                            <div className={`h-2 rounded-full ${colors[i]}`} style={{ width: `${(d.avg / 5) * 100}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Goals by status */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Goals Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4">
                    <div className="flex items-center justify-center py-3">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" className="text-gray-100 dark:text-slate-700" strokeWidth="16" />
                          {(() => {
                            const statuses: GoalStatus[] = ["completed","on-track","at-risk","not-started"];
                            const colors = ["#8b5cf6","#10b981","#f59e0b","#d1d5db"];
                            const counts = statuses.map(s => goals.filter(g => g.status === s).length);
                            const total2 = counts.reduce((a,b)=>a+b,0);
                            let offset = 0;
                            return statuses.map((s, i) => {
                              const pct = (counts[i] / total2) * 239;
                              const el = <circle key={s} cx="50" cy="50" r="38" fill="none" stroke={colors[i]} strokeWidth="16" strokeDasharray={`${pct} 239`} strokeDashoffset={`${-offset}`} />;
                              offset += pct;
                              return el;
                            });
                          })()}
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-lg font-bold">{goals.length}</p>
                          <p className="text-[10px] text-muted-foreground">total</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {([["completed","#8b5cf6"],["on-track","#10b981"],["at-risk","#f59e0b"],["not-started","#d1d5db"]] as const).map(([s, color]) => {
                        const count = goals.filter(g => g.status === s).length;
                        const cfg2 = goalStatusConfig[s as GoalStatus];
                        return (
                          <div key={s} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-xs text-muted-foreground flex-1">{cfg2.label}</span>
                            <span className="text-xs font-bold">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Category distribution */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Goals by Category</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-3">
                    {(["performance","project","learning","leadership"] as Goal["category"][]).map(cat => {
                      const count = goals.filter(g => g.category === cat).length;
                      const cfg2 = categoryConfig[cat];
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-lg ${cfg2.bg} flex items-center justify-center flex-shrink-0 ${cfg2.color}`}>{cfg2.icon}</div>
                          <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold">{cfg2.label}</span>
                              <span className="text-muted-foreground">{count} goal{count !== 1 ? "s" : ""}</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-1.5">
                              <div className={`h-1.5 rounded-full ${cfg2.bg.replace("100","500")}`} style={{ width: `${(count / goals.length) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Top performers */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold">Top Performers</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-4 space-y-2">
                    {[...employees].sort((a,b) => b.overallRating - a.overallRating || b.goalsCompleted - a.goalsCompleted).slice(0,5).map((e, i) => (
                      <div key={e.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-gray-300 dark:bg-slate-600 text-gray-700 dark:text-slate-200" : i === 2 ? "bg-orange-300 text-white" : "bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-300"}`}>{i+1}</span>
                        <Avatar className="w-8 h-8 flex-shrink-0">
                          <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700">{e.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate">{e.name}</p>
                          <p className="text-[10px] text-muted-foreground">{e.department}</p>
                        </div>
                        <StarDisplay rating={e.overallRating} />
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

export default PerformanceManagement;
