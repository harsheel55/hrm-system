import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Users,
  Calendar,
  Bell,
  Plus,
  Search,
  ChevronRight,
  Star,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Clock3,
  Eye,
  TrendingUp,
  UserCheck,
  Send,
  LayoutGrid,
  List,
  X,
  Download,
  Globe,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CalendarCheck,
  DollarSign,
} from "lucide-react";

type Stage = "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
type Priority = "high" | "medium" | "low";

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  priority: Priority;
  applicants: number;
  newApplicants: number;
  daysOpen: number;
  hiringManager: string;
  salary: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  postedDate: string;
  closingDate: string;
  pipeline: Record<Stage, number>;
}

interface Candidate {
  id: number;
  name: string;
  avatar: string;
  role: string;
  appliedFor: string;
  email: string;
  phone: string;
  location: string;
  stage: Stage;
  rating: number;
  appliedDate: string;
  experience: string;
  source: string;
}

const jobs: Job[] = [
  {
    id: 1, title: "Senior Frontend Engineer", department: "Engineering", location: "Remote", type: "Full-time", priority: "high",
    applicants: 34, newApplicants: 5, daysOpen: 12, hiringManager: "Sarah J.",
    salary: "$120,000 – $150,000 / yr", postedDate: "Mar 14, 2026", closingDate: "Apr 14, 2026",
    skills: ["React", "TypeScript", "GraphQL", "CSS", "Testing"],
    description: "We're looking for a Senior Frontend Engineer to join our growing product team. You'll own the UI layer of our core platform, collaborate closely with design, and mentor junior engineers.",
    responsibilities: ["Lead frontend architecture decisions", "Build and maintain reusable component libraries", "Conduct code reviews and mentor junior devs", "Collaborate with designers on pixel-perfect UIs"],
    pipeline: { applied: 14, screening: 10, interview: 6, offer: 2, hired: 1, rejected: 1 },
  },
  {
    id: 2, title: "Product Designer", department: "Design", location: "NYC", type: "Full-time", priority: "high",
    applicants: 27, newApplicants: 3, daysOpen: 8, hiringManager: "Michael C.",
    salary: "$95,000 – $120,000 / yr", postedDate: "Mar 18, 2026", closingDate: "Apr 18, 2026",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
    description: "Join our design team to craft intuitive and beautiful product experiences. You will work across web and mobile, from early discovery to final polish.",
    responsibilities: ["Define and drive end-to-end design flows", "Conduct user research and usability tests", "Maintain and evolve our design system", "Partner with PMs and engineers on delivery"],
    pipeline: { applied: 10, screening: 8, interview: 5, offer: 2, hired: 1, rejected: 1 },
  },
  {
    id: 3, title: "Sales Development Rep", department: "Sales", location: "Remote", type: "Full-time", priority: "medium",
    applicants: 51, newApplicants: 9, daysOpen: 20, hiringManager: "James K.",
    salary: "$55,000 – $70,000 + commission", postedDate: "Mar 6, 2026", closingDate: "Apr 6, 2026",
    skills: ["Salesforce", "Outbound Prospecting", "Cold Calling", "HubSpot", "Pipeline Management"],
    description: "As an SDR you will generate and qualify new business opportunities, working closely with Account Executives to build a healthy sales pipeline.",
    responsibilities: ["Prospect and outreach to ICP accounts via email and phone", "Qualify inbound and outbound leads", "Schedule product demos for AEs", "Maintain accurate CRM data in Salesforce"],
    pipeline: { applied: 22, screening: 15, interview: 8, offer: 3, hired: 2, rejected: 1 },
  },
  {
    id: 4, title: "Data Analyst", department: "Finance", location: "NYC", type: "Full-time", priority: "medium",
    applicants: 18, newApplicants: 2, daysOpen: 15, hiringManager: "Lisa W.",
    salary: "$85,000 – $105,000 / yr", postedDate: "Mar 11, 2026", closingDate: "Apr 11, 2026",
    skills: ["SQL", "Python", "Tableau", "Excel", "dbt"],
    description: "We're looking for a Data Analyst to turn raw data into clear business insights that drive strategy across Finance, Marketing, and Product.",
    responsibilities: ["Build and maintain dashboards in Tableau", "Write complex SQL queries for ad-hoc analysis", "Collaborate with FP&A on monthly reporting", "Identify data quality issues and drive fixes"],
    pipeline: { applied: 8, screening: 5, interview: 3, offer: 1, hired: 0, rejected: 1 },
  },
  {
    id: 5, title: "Marketing Manager", department: "Marketing", location: "Remote", type: "Full-time", priority: "low",
    applicants: 22, newApplicants: 4, daysOpen: 25, hiringManager: "Emily R.",
    salary: "$90,000 – $115,000 / yr", postedDate: "Mar 1, 2026", closingDate: "Apr 1, 2026",
    skills: ["Content Strategy", "SEO", "Campaign Management", "HubSpot", "Analytics"],
    description: "Lead our marketing function to grow brand awareness and drive demand generation across digital channels.",
    responsibilities: ["Own content strategy and editorial calendar", "Run and optimize paid and organic campaigns", "Manage agency relationships", "Report on KPIs including CAC, MQLs, and pipeline contribution"],
    pipeline: { applied: 10, screening: 7, interview: 3, offer: 1, hired: 0, rejected: 1 },
  },
  {
    id: 6, title: "DevOps Engineer", department: "Engineering", location: "Remote", type: "Contract", priority: "high",
    applicants: 11, newApplicants: 1, daysOpen: 5, hiringManager: "David P.",
    salary: "$80 – $110 / hr", postedDate: "Mar 21, 2026", closingDate: "Apr 21, 2026",
    skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Docker"],
    description: "We need a contract DevOps Engineer to help scale our cloud infrastructure and improve our deployment pipelines ahead of a major product launch.",
    responsibilities: ["Design and manage AWS infrastructure via Terraform", "Improve CI/CD pipelines in GitHub Actions", "Set up monitoring and alerting with Datadog", "Collaborate with engineering on container orchestration"],
    pipeline: { applied: 5, screening: 3, interview: 2, offer: 1, hired: 0, rejected: 0 },
  },
];

const candidates: Candidate[] = [
  { id: 1,  name: "Lena Fischer",    avatar: "LF", role: "Senior Frontend Engineer", appliedFor: "Senior Frontend Engineer", email: "lena@email.com",    phone: "+1 212 555 0101", location: "Berlin, DE",    stage: "interview",  rating: 5, appliedDate: "Mar 18", experience: "6 years", source: "LinkedIn" },
  { id: 2,  name: "Carlos Romero",   avatar: "CR", role: "Product Designer",         appliedFor: "Product Designer",         email: "carlos@email.com",  phone: "+1 212 555 0102", location: "Madrid, ES",    stage: "offer",      rating: 5, appliedDate: "Mar 14", experience: "5 years", source: "Referral" },
  { id: 3,  name: "Priya Sharma",    avatar: "PS", role: "Data Analyst",             appliedFor: "Data Analyst",             email: "priya@email.com",   phone: "+1 212 555 0103", location: "Mumbai, IN",    stage: "screening",  rating: 4, appliedDate: "Mar 20", experience: "4 years", source: "Indeed" },
  { id: 4,  name: "Jake Thompson",   avatar: "JT", role: "Sales Development Rep",    appliedFor: "Sales Development Rep",    email: "jake@email.com",    phone: "+1 212 555 0104", location: "Austin, TX",    stage: "applied",    rating: 3, appliedDate: "Mar 22", experience: "2 years", source: "LinkedIn" },
  { id: 5,  name: "Yuki Tanaka",     avatar: "YT", role: "Senior Frontend Engineer", appliedFor: "Senior Frontend Engineer", email: "yuki@email.com",    phone: "+1 212 555 0105", location: "Tokyo, JP",     stage: "hired",      rating: 5, appliedDate: "Mar 10", experience: "7 years", source: "Referral" },
  { id: 6,  name: "Amara Diallo",    avatar: "AD", role: "Marketing Manager",        appliedFor: "Marketing Manager",        email: "amara@email.com",   phone: "+1 212 555 0106", location: "Paris, FR",     stage: "interview",  rating: 4, appliedDate: "Mar 16", experience: "5 years", source: "Website" },
  { id: 7,  name: "Ben Kowalski",    avatar: "BK", role: "DevOps Engineer",          appliedFor: "DevOps Engineer",          email: "ben@email.com",     phone: "+1 212 555 0107", location: "Warsaw, PL",    stage: "rejected",   rating: 2, appliedDate: "Mar 19", experience: "3 years", source: "LinkedIn" },
  { id: 8,  name: "Sofia Martins",   avatar: "SM", role: "Product Designer",         appliedFor: "Product Designer",         email: "sofia@email.com",   phone: "+1 212 555 0108", location: "Lisbon, PT",    stage: "screening",  rating: 4, appliedDate: "Mar 21", experience: "4 years", source: "Dribbble" },
  { id: 9,  name: "Daniel Okafor",   avatar: "DO", role: "Sales Development Rep",    appliedFor: "Sales Development Rep",    email: "daniel@email.com",  phone: "+1 212 555 0109", location: "Lagos, NG",     stage: "interview",  rating: 4, appliedDate: "Mar 17", experience: "3 years", source: "Indeed" },
  { id: 10, name: "Hannah Lee",      avatar: "HL", role: "Senior Frontend Engineer", appliedFor: "Senior Frontend Engineer", email: "hannah@email.com",  phone: "+1 212 555 0110", location: "Seoul, KR",     stage: "applied",    rating: 3, appliedDate: "Mar 23", experience: "4 years", source: "GitHub" },
];

const stageOrder: Stage[] = ["applied", "screening", "interview", "offer", "hired", "rejected"];

const stageConfig: Record<Stage, { label: string; color: string; bg: string; border: string; dot: string }> = {
  applied:   { label: "Applied",    color: "text-muted-foreground",   bg: "bg-muted",    border: "border-border",   dot: "bg-muted-foreground" },
  screening: { label: "Screening",  color: "text-blue-700",   bg: "bg-blue-50 dark:bg-blue-950",    border: "border-blue-200 dark:border-blue-800",   dot: "bg-blue-500" },
  interview: { label: "Interview",  color: "text-amber-700",  bg: "bg-amber-50 dark:bg-amber-950",   border: "border-amber-200 dark:border-amber-800",  dot: "bg-amber-500" },
  offer:     { label: "Offer Sent", color: "text-violet-700", bg: "bg-violet-50 dark:bg-violet-950",  border: "border-violet-200 dark:border-violet-800", dot: "bg-violet-500" },
  hired:     { label: "Hired",      color: "text-emerald-700",bg: "bg-emerald-50 dark:bg-emerald-950", border: "border-emerald-200 dark:border-emerald-800",dot: "bg-emerald-500" },
  rejected:  { label: "Rejected",   color: "text-red-600",    bg: "bg-red-50 dark:bg-red-950",     border: "border-red-200 dark:border-red-800",    dot: "bg-red-400" },
};

const priorityConfig: Record<Priority, { color: string; bg: string }> = {
  high:   { color: "text-red-600",    bg: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800" },
  medium: { color: "text-amber-600",  bg: "bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800" },
  low:    { color: "text-gray-500",   bg: "bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700" },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className={`w-3 h-3 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-700"}`} />
      ))}
    </div>
  );
}

function StageBadge({ stage }: { stage: Stage }) {
  const cfg = stageConfig[stage];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function PostJobDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600 dark:text-white text-xs h-8">
          <Plus className="w-3.5 h-3.5" /> Post Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md dark:bg-gray-950 dark:border-gray-800">
        <DialogHeader><DialogTitle className="text-sm">Post a New Job</DialogTitle></DialogHeader>
        <div className="space-y-3 pt-1">
          <div className="grid gap-1.5">
            <Label className="text-xs">Job Title</Label>
            <Input className="text-sm h-8" placeholder="e.g. Senior Product Manager" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs">Department</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Engineering","Design","Marketing","Sales","Finance","HR"].map(d => <SelectItem key={d} value={d.toLowerCase()}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Job Type</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["Full-time","Part-time","Contract","Internship"].map(t => <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-xs">Location</Label>
              <Input className="text-sm h-8" placeholder="e.g. Remote / NYC" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Priority</Label>
              <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {["High","Medium","Low"].map(p => <SelectItem key={p} value={p.toLowerCase()}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs">Job Description</Label>
            <Textarea className="text-sm resize-none" rows={3} placeholder="Describe the role and requirements..." />
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setOpen(false)}>Cancel</Button>
            <Button size="sm" className="flex-1 bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600 dark:text-white" onClick={() => setOpen(false)}>Publish Job</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JobViewDialog({ job }: { job: Job }) {
  const stagesDisplay: Stage[] = ["applied", "screening", "interview", "offer", "hired"];
  const total = Object.values(job.pipeline).reduce((s, n) => s + n, 0) || 1;
  const pri = priorityConfig[job.priority];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Eye className="w-3 h-3" />View</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[88vh] overflow-y-auto dark:bg-gray-950 dark:border-gray-800">
        <DialogHeader>
          {/* Banner */}
          <div className="h-20 -mx-6 -mt-6 mb-4 bg-gradient-to-r from-violet-600 to-blue-500 rounded-t-xl flex items-end px-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-white text-base font-bold">{job.title}</DialogTitle>
                <p className="text-white/80 text-xs">{job.department} · {job.location}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: <MapPin className="w-3 h-3" />, val: job.location },
              { icon: <Briefcase className="w-3 h-3" />, val: job.type },
              { icon: <DollarSign className="w-3 h-3" />, val: job.salary },
              { icon: <Calendar className="w-3 h-3" />, val: `Posted ${job.postedDate}` },
              { icon: <Clock3 className="w-3 h-3" />, val: `Closes ${job.closingDate}` },
            ].map((m, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-muted text-muted-foreground font-medium">
                {m.icon}{m.val}
              </span>
            ))}
            <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-semibold capitalize ${pri.color} ${pri.bg}`}>
              {job.priority} priority
            </span>
          </div>

          {/* Hiring Manager */}
          <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-xl">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs font-bold bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">{job.hiringManager.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-semibold">{job.hiringManager}</p>
              <p className="text-[10px] text-muted-foreground">Hiring Manager · {job.department}</p>
            </div>
            <div className="ml-auto flex gap-1.5">
              <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Mail className="w-3 h-3" />Message</Button>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">About the Role</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{job.description}</p>
          </div>

          {/* Responsibilities */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Key Responsibilities</p>
            <ul className="space-y-1.5">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.skills.map(s => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-medium dark:bg-violet-950 dark:border-violet-800">{s}</span>
              ))}
            </div>
          </div>

          {/* Pipeline funnel */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Candidate Pipeline</p>
            <div className="flex items-end gap-2">
              {stagesDisplay.map((stage) => {
                const count = job.pipeline[stage];
                const pct = Math.max((count / total) * 100, 4);
                const cfg = stageConfig[stage];
                const colors: Record<Stage, string> = {
                  applied: "bg-gray-300", screening: "bg-blue-400", interview: "bg-amber-400",
                  offer: "bg-violet-500", hired: "bg-emerald-500", rejected: "bg-red-400",
                };
                return (
                  <div key={stage} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-sm font-bold">{count}</span>
                    <div className={`w-full rounded-t-md ${colors[stage]}`} style={{ height: `${pct * 1.2}px`, minHeight: "8px" }} />
                    <span className={`text-[10px] font-semibold ${cfg.color} text-center`}>{cfg.label}</span>
                    <span className="text-[9px] text-muted-foreground">{Math.round((count / total) * 100)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600 dark:text-white text-xs gap-1.5 h-9">
              <Users className="w-3.5 h-3.5" />View All {job.applicants} Candidates
            </Button>
            <Button variant="outline" className="gap-1.5 text-xs h-9">
              <Send className="w-3.5 h-3.5" />Share Job
            </Button>
            <Button variant="outline" className="gap-1.5 text-xs h-9 text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
              <XCircle className="w-3.5 h-3.5" />Close Posting
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function JobCandidatesDialog({ job, allCandidates }: { job: Job; allCandidates: Candidate[] }) {
  const [stageFilter, setStageFilter] = useState<Stage | "all">("all");
  const jobCandidates = allCandidates.filter(c => c.appliedFor === job.title);
  const shown = stageFilter === "all" ? jobCandidates : jobCandidates.filter(c => c.stage === stageFilter);
  const stagesDisplay: Stage[] = ["applied", "screening", "interview", "offer", "hired", "rejected"];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600 dark:text-white gap-1">
          <Users className="w-3 h-3" />Candidates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[88vh] overflow-hidden flex flex-col">
        <DialogHeader>
          {/* Banner */}
          <div className="h-16 -mx-6 -mt-6 mb-4 bg-gradient-to-r from-violet-600 to-blue-500 rounded-t-xl flex items-center px-6 gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-sm font-bold">{job.title}</DialogTitle>
              <p className="text-white/75 text-[11px]">{job.department} · {job.location} · {jobCandidates.length} candidate{jobCandidates.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Stage pill filters */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {(["all", ...stagesDisplay] as const).map(s => {
            const count = s === "all" ? jobCandidates.length : jobCandidates.filter(c => c.stage === s).length;
            if (count === 0 && s !== "all") return null;
            const cfg = s !== "all" ? stageConfig[s] : null;
            return (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-colors
                  ${stageFilter === s
                    ? cfg ? `${cfg.bg} ${cfg.border} ${cfg.color}` : "bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-800 dark:border-gray-200"
                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700"}`}
              >
                {s === "all" ? "All" : stageConfig[s].label}
                <span className={`text-[10px] font-bold px-1 rounded-full ${stageFilter === s ? "bg-white/60 dark:bg-black/20" : "bg-gray-100 dark:bg-gray-800"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Candidate list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {shown.length === 0 && (
            <div className="text-center py-10 text-muted-foreground text-sm">
              No candidates at this stage yet.
            </div>
          )}
          {shown.map(c => {
            return (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm transition-shadow dark:bg-gray-950 dark:border-gray-800 dark:hover:shadow-violet-500/10">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700 dark:from-violet-900 dark:to-blue-900 dark:text-violet-300">{c.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />{c.location}
                    </div>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{c.experience}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{c.source}</span>
                  </div>
                </div>
                <StarRating rating={c.rating} />
                <StageBadge stage={c.stage} />
                <div className="flex flex-col gap-1">
                  <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 gap-1"><Mail className="w-3 h-3" />Email</Button>
                  <Button size="sm" className="h-6 text-[10px] px-2 bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600 dark:text-white gap-1"><CalendarCheck className="w-3 h-3" />Schedule</Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Showing {shown.length} of {jobCandidates.length} candidate{jobCandidates.length !== 1 ? "s" : ""}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Download className="w-3 h-3" />Export</Button>
            <Button size="sm" className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600 dark:text-white gap-1"><Send className="w-3 h-3" />Email All</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Recruitment() {
  const [activeTab, setActiveTab] = useState("pipeline");
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [candidates_, setCandidates] = useState<Candidate[]>(candidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const moveStage = (id: number, stage: Stage) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage } : c));
  };

  const filtered = candidates_.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.appliedFor.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === "all" || c.stage === filterStage;
    return matchSearch && matchStage;
  });

  const totalApplicants = jobs.reduce((s, j) => s + j.applicants, 0);
  const hired = candidates_.filter(c => c.stage === "hired").length;
  const inProgress = candidates_.filter(c => !["hired","rejected"].includes(c.stage)).length;
  const offersPending = candidates_.filter(c => c.stage === "offer").length;

  // Kanban columns
  const kanbanStages: Stage[] = ["applied", "screening", "interview", "offer", "hired"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
    
      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-950 border-b dark:border-gray-800 px-6 py-3.5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Recruitment</h1>
            <p className="text-xs text-muted-foreground">Manage job openings and candidate pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-violet-600 rounded-full" />
            </Button>
            <PostJobDialog />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Open Positions",    value: jobs.length,    sub: "across 5 departments",       icon: <Briefcase className="w-4 h-4 text-violet-600" />, bg: "bg-violet-50 dark:bg-violet-950" },
              { label: "Total Applicants",  value: totalApplicants, sub: "across all roles",           icon: <Users className="w-4 h-4 text-blue-600" />,    bg: "bg-blue-50 dark:bg-blue-950" },
              { label: "In Pipeline",       value: inProgress,     sub: "active candidates",           icon: <TrendingUp className="w-4 h-4 text-amber-600" />, bg: "bg-amber-50 dark:bg-amber-950" },
              { label: "Offers Pending",    value: offersPending,  sub: `${hired} hired this month`,   icon: <UserCheck className="w-4 h-4 text-emerald-600" />, bg: "bg-emerald-50 dark:bg-emerald-950" },
            ].map(s => (
              <Card key={s.label} className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <p className="text-2xl font-bold mt-1">{s.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${s.bg}`}>{s.icon}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white dark:bg-gray-950 border dark:border-gray-800 shadow-sm h-9">
              <TabsTrigger value="pipeline" className="text-xs">Kanban Pipeline</TabsTrigger>
              <TabsTrigger value="candidates" className="text-xs">All Candidates</TabsTrigger>
              <TabsTrigger value="jobs" className="text-xs">Job Openings</TabsTrigger>
            </TabsList>

            {/* KANBAN PIPELINE */}
            <TabsContent value="pipeline" className="mt-4">
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ minWidth: 0 }}>
                {kanbanStages.map(stage => {
                  const stageCandidates = candidates_.filter(c => c.stage === stage);
                  const cfg = stageConfig[stage];
                  return (
                    <div key={stage} className="flex-1 min-w-[180px]">
                      <div className={`flex items-center justify-between mb-2 px-2 py-1.5 rounded-lg border ${cfg.bg} ${cfg.border}`}>
                        <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full bg-white/70 dark:bg-black/20 ${cfg.color}`}>{stageCandidates.length}</span>
                      </div>
                      <div className="space-y-2">
                        {stageCandidates.map(c => (
                          <Card key={c.id} className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Avatar className="w-7 h-7 flex-shrink-0">
                                  <AvatarFallback className="text-[10px] font-bold bg-muted">{c.avatar}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold truncate">{c.name}</p>
                                  <p className="text-[10px] text-muted-foreground truncate">{c.appliedFor.split(" ").slice(0,2).join(" ")}</p>
                                </div>
                              </div>
                              <StarRating rating={c.rating} />
                              <div className="flex items-center gap-1 mt-1.5">
                                <MapPin className="w-2.5 h-2.5 text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground truncate">{c.location}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-[10px] text-muted-foreground">{c.source}</span>
                                {stage !== "hired" && (
                                  <button
                                    onClick={() => {
                                      const next = stageOrder[stageOrder.indexOf(stage) + 1];
                                      if (next && next !== "rejected") moveStage(c.id, next);
                                    }}
                                    className="flex items-center gap-0.5 text-[10px] text-violet-600 hover:text-violet-700 font-semibold dark:text-violet-400 dark:hover:text-violet-300"
                                  >
                                    Move <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                                {stage === "hired" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        {stageCandidates.length === 0 && (
                          <div className="text-center py-6 text-xs text-muted-foreground border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
                            No candidates
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            {/* ALL CANDIDATES */}
            <TabsContent value="candidates" className="mt-4">
              <div className={`flex gap-4 ${selectedCandidate ? "items-start" : ""}`}>
                {/* Left: cards / list */}
                <div className={`flex-1 min-w-0 transition-all duration-300`}>
                  {/* Toolbar */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1 max-w-xs">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input className="h-8 pl-8 text-xs" placeholder="Search name, role, location…" value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <Select value={filterStage} onValueChange={v => { setFilterStage(v); setSelectedCandidate(null); }}>
                      <SelectTrigger className="h-8 text-xs w-36"><SelectValue placeholder="Stage" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stages</SelectItem>
                        {stageOrder.map(s => <SelectItem key={s} value={s}>{stageConfig[s].label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <div className="ml-auto flex items-center gap-1 border rounded-lg p-0.5 bg-white dark:bg-gray-950 dark:border-gray-800">
                      <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-muted" : "hover:bg-muted/50"}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-muted" : "hover:bg-muted/50"}`}><List className="w-3.5 h-3.5" /></button>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{filtered.length} candidates</p>
                  </div>

                  {/* Stage pills */}
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {(["all", ...stageOrder] as const).map(s => {
                      const count = s === "all" ? candidates_.length : candidates_.filter(c => c.stage === s).length;
                      const cfg = s !== "all" ? stageConfig[s] : null;
                      return (
                        <button
                          key={s}
                          onClick={() => { setFilterStage(s); setSelectedCandidate(null); }}
                          className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${filterStage === s ? (cfg ? `${cfg.bg} ${cfg.border} ${cfg.color}` : "bg-gray-800 text-white border-gray-800 dark:bg-gray-200 dark:text-gray-800 dark:border-gray-200") : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700"}`}
                        >
                          {s === "all" ? "All" : stageConfig[s].label}
                          <span className={`text-[10px] font-bold px-1 rounded-full ${filterStage === s ? "bg-white/60 dark:bg-black/20" : "bg-gray-100 dark:bg-gray-800"}`}>{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* GRID VIEW */}
                  {viewMode === "grid" && (
                    <div className={`grid gap-3 ${selectedCandidate ? "grid-cols-2" : "grid-cols-3"}`}>
                      {filtered.map(c => {
                        const cfg = stageConfig[c.stage];
                        const isSelected = selectedCandidate?.id === c.id;
                        return (
                          <Card
                            key={c.id}
                            onClick={() => setSelectedCandidate(isSelected ? null : c)}
                            className={`border cursor-pointer transition-all hover:shadow-md ${isSelected ? "ring-2 ring-violet-500 shadow-md border-violet-200 dark:border-violet-700" : "border-gray-100 shadow-sm dark:border-gray-800"}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2.5">
                                  <Avatar className="w-10 h-10">
                                    <AvatarFallback className="text-sm font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700 dark:from-violet-900 dark:to-blue-900 dark:text-violet-300">{c.avatar}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-semibold">{c.name}</p>
                                    <p className="text-xs text-muted-foreground">{c.experience}</p>
                                  </div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${cfg.color} ${cfg.bg} ${cfg.border}`}>{cfg.label}</span>
                              </div>

                              <p className="text-xs font-medium text-foreground mb-1 truncate">{c.appliedFor}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                <MapPin className="w-3 h-3 flex-shrink-0" /><span className="truncate">{c.location}</span>
                              </div>

                              <div className="flex items-center justify-between">
                                <StarRating rating={c.rating} />
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-muted-foreground">{c.source}</span>
                                  <span className="text-[10px] text-muted-foreground">·</span>
                                  <span className="text-[10px] text-muted-foreground">{c.appliedDate}</span>
                                </div>
                              </div>

                              <div className="flex gap-1.5 mt-3 pt-3 border-t dark:border-gray-800">
                                <Button size="sm" variant="outline" className="flex-1 h-7 text-xs gap-1" onClick={e => e.stopPropagation()}>
                                  <Mail className="w-3 h-3" />Email
                                </Button>
                                <Button size="sm" className="flex-1 h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600 dark:text-white gap-1" onClick={e => { e.stopPropagation(); setSelectedCandidate(c); }}>
                                  <CalendarCheck className="w-3 h-3" />Schedule
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}

                  {/* LIST VIEW */}
                  {viewMode === "list" && (
                    <Card className="border-0 shadow-sm">
                      <CardContent className="px-5 py-3">
                        <div className="flex text-[10px] text-muted-foreground font-semibold uppercase tracking-wide px-2 mb-1 gap-3">
                          <span className="flex-1">Candidate</span>
                          <span className="w-36">Applied For</span>
                          <span className="w-20 text-center">Rating</span>
                          <span className="w-24">Stage</span>
                          <span className="w-16 text-center">Source</span>
                        </div>
                        {filtered.map(c => {
                          const isSelected = selectedCandidate?.id === c.id;
                          return (
                            <div
                              key={c.id}
                              onClick={() => setSelectedCandidate(isSelected ? null : c)}
                              className={`flex items-center gap-3 py-2.5 border-b last:border-0 px-2 rounded-lg transition-colors cursor-pointer ${isSelected ? "bg-violet-50 border-violet-100 dark:bg-violet-950 dark:border-violet-800" : "hover:bg-muted/20"}`}
                            >
                              <Avatar className="w-8 h-8 flex-shrink-0">
                                <AvatarFallback className="text-xs font-bold bg-gradient-to-br from-violet-100 to-blue-100 text-violet-700 dark:from-violet-900 dark:to-blue-900 dark:text-violet-300">{c.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{c.name}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <MapPin className="w-3 h-3" />{c.location} · {c.appliedDate}
                                </div>
                              </div>
                              <div className="w-36">
                                <p className="text-xs font-medium truncate">{c.appliedFor}</p>
                                <p className="text-[10px] text-muted-foreground">{c.experience}</p>
                              </div>
                              <div className="w-20 flex justify-center"><StarRating rating={c.rating} /></div>
                              <div className="w-24"><StageBadge stage={c.stage} /></div>
                              <div className="w-16 text-center text-xs text-muted-foreground">{c.source}</div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right: detail panel */}
                {selectedCandidate && (() => {
                  const c = selectedCandidate;
                  const stageIdx = stageOrder.indexOf(c.stage);
                  return (
                    <div className="w-72 flex-shrink-0 space-y-3 sticky top-0">
                      <Card className="border-0 shadow-sm overflow-hidden dark:bg-gray-900 dark:border-gray-800">
                        {/* Header banner */}
                        <div className="h-14 bg-gradient-to-r from-violet-500 to-blue-500" />
                        <CardContent className="px-4 pb-4 -mt-7">
                          <div className="flex items-end justify-between mb-3">
                            <Avatar className="w-14 h-14 border-4 border-white dark:border-gray-950 shadow">
                              <AvatarFallback className="text-base font-bold bg-gradient-to-br from-violet-200 to-blue-200 text-violet-700 dark:from-violet-900 dark:to-blue-800 dark:text-violet-300">{c.avatar}</AvatarFallback>
                            </Avatar>
                            <button onClick={() => setSelectedCandidate(null)} className="mt-8 p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4 text-muted-foreground" /></button>
                          </div>
                          <p className="font-bold text-sm">{c.name}</p>
                          <p className="text-xs text-muted-foreground">{c.role}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <StarRating rating={c.rating} />
                            <StageBadge stage={c.stage} />
                          </div>

                          <Separator className="my-3" />

                          <div className="space-y-2">
                            {[
                              { icon: <Mail className="w-3.5 h-3.5 text-violet-400" />, val: c.email },
                              { icon: <Phone className="w-3.5 h-3.5 text-blue-400" />, val: c.phone },
                              { icon: <MapPin className="w-3.5 h-3.5 text-rose-400" />, val: c.location },
                              { icon: <Briefcase className="w-3.5 h-3.5 text-amber-400" />, val: c.experience + " experience" },
                              { icon: <Globe className="w-3.5 h-3.5 text-emerald-400" />, val: "Source: " + c.source },
                            ].map((row, i) => (
                              <div key={i} className="flex items-center gap-2">
                                {row.icon}
                                <span className="text-xs text-muted-foreground truncate">{row.val}</span>
                              </div>
                            ))}
                          </div>

                          <Separator className="my-3" />

                          {/* Pipeline progress */}
                          <p className="text-xs font-semibold mb-2">Pipeline Progress</p>
                          <div className="flex items-center gap-1">
                            {["applied","screening","interview","offer","hired"].map((s, i) => {
                              const active = i <= stageOrder.indexOf(c.stage === "rejected" ? "applied" : c.stage);
                              return (
                                <div key={s} className="flex items-center gap-1 flex-1">
                                  <div className={`w-full h-1.5 rounded-full ${active ? "bg-violet-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                                  {i < 4 && <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${active ? "bg-violet-500" : "bg-gray-200 dark:bg-gray-700"}`} />}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-1">
                            {["Applied","Screen","Interview","Offer","Hired"].map((l, i) => (
                              <span key={l} className={`text-[9px] ${i <= stageIdx ? "text-violet-600 font-semibold dark:text-violet-400" : "text-muted-foreground"}`}>{l}</span>
                            ))}
                          </div>

                          <Separator className="my-3" />

                          {/* Actions */}
                          <p className="text-xs font-semibold mb-2">Move to Stage</p>
                          <div className="flex flex-wrap gap-1">
                            {(stageOrder.filter(s => s !== c.stage && s !== "rejected") as Stage[]).map(s => (
                              <button
                                key={s}
                                onClick={() => { moveStage(c.id, s); setSelectedCandidate({ ...c, stage: s }); }}
                                className={`text-[10px] px-2 py-1 rounded-full border font-semibold transition-colors ${stageConfig[s].color} ${stageConfig[s].bg} ${stageConfig[s].border} hover:opacity-80`}
                              >
                                {stageConfig[s].label}
                              </button>
                            ))}
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 mt-3">
                            <Button size="sm" className="h-7 text-xs bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600 dark:text-white gap-1"><CalendarCheck className="w-3 h-3" />Schedule</Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1"><Mail className="w-3 h-3" />Email</Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"><ThumbsUp className="w-3 h-3" />Shortlist</Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"><ThumbsDown className="w-3 h-3" />Reject</Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Notes */}
                      <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
                        <CardHeader className="pb-1 pt-3 px-4">
                          <CardTitle className="text-xs font-semibold flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" />Interviewer Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-3">
                          <textarea
                            className="w-full text-xs border rounded-lg p-2 resize-none text-muted-foreground focus:outline-none focus:ring-1 focus:ring-violet-400 bg-transparent dark:border-gray-700"
                            rows={3}
                            placeholder="Add notes about this candidate…"
                            defaultValue={c.rating >= 4 ? "Strong communication skills. Technical background aligns well with role requirements." : ""}
                          />
                          <Button size="sm" className="mt-1.5 h-6 text-xs bg-violet-600 hover:bg-violet-700 text-white dark:bg-violet-500 dark:hover:bg-violet-600 dark:text-white w-full">Save Note</Button>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })()}
              </div>
            </TabsContent>

            {/* JOB OPENINGS */}
            <TabsContent value="jobs" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                {jobs.map(j => {
                  const pri = priorityConfig[j.priority];
                  return (
                    <Card key={j.id} className="border-0 shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-sm">{j.title}</p>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className="text-xs text-muted-foreground">{j.department}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{j.location}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded dark:bg-gray-800 dark:text-gray-300">{j.type}</span>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold capitalize ${pri.color} ${pri.bg}`}>
                            {j.priority}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{j.applicants} applicants</span>
                          {j.newApplicants > 0 && <span className="text-violet-600 font-semibold dark:text-violet-400">+{j.newApplicants} new</span>}
                          <span className="flex items-center gap-1"><Clock3 className="w-3 h-3" />{j.daysOpen}d open</span>
                        </div>
                        <div className="mb-3">
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                            <span>Pipeline progress</span>
                            <span>{Math.round((j.applicants * 0.3))} advancing</span>
                          </div>
                          <Progress value={Math.min(j.applicants * 2, 100)} className="h-1.5" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Avatar className="w-5 h-5"><AvatarFallback className="text-[9px] bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">{j.hiringManager.split(" ").map(n=>n[0]).join("")}</AvatarFallback></Avatar>
                            <span>{j.hiringManager}</span>
                          </div>
                          <div className="flex gap-1.5">
                            <JobViewDialog job={j} />
                            <JobCandidatesDialog job={j} allCandidates={candidates_} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
