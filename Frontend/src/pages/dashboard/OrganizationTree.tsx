import { useState, useMemo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Users, Home, Calendar, Clock, DollarSign, Briefcase,
  FileText, Settings, RefreshCw, Target, Search, ChevronDown, ChevronUp,
  ZoomIn, ZoomOut, Maximize2, Mail, Phone, MapPin, UserPlus,
  Download, List, Network, ChevronRight, Layers,
} from "lucide-react";

/* ─── Data ────────────────────────────────────────────────────────────────── */

interface OrgPerson {
  id: string; name: string; role: string; dept: string; avatar: string;
  email: string; phone: string; location: string; joined: string;
  reports: number; // total direct reports (used for sidebar info)
  children?: OrgPerson[];
}

const ORG: OrgPerson = {
  id: "ceo", name: "Jennifer Walsh",    role: "CEO",            dept: "Executive",   avatar: "JW", email: "j.walsh@acme.com",     phone: "+1 415-000-0001", location: "San Francisco", joined: "Jan 2018",  reports: 6,
  children: [
    {
      id: "cto", name: "Priya Sharma",  role: "CTO",            dept: "Engineering", avatar: "PS", email: "p.sharma@acme.com",     phone: "+1 415-000-0010", location: "San Francisco", joined: "Mar 2019",  reports: 2,
      children: [
        {
          id: "em", name: "Kevin Lee",  role: "Eng Manager",    dept: "Engineering", avatar: "KL", email: "k.lee@acme.com",         phone: "+1 415-000-0020", location: "San Francisco", joined: "Jun 2020",  reports: 3,
          children: [
            { id: "sj", name: "Sarah Johnson",  role: "Senior Dev",      dept: "Engineering", avatar: "SJ", email: "s.johnson@acme.com", phone: "+1 415-000-0030", location: "Remote",         joined: "Aug 2021",  reports: 0 },
            { id: "dp", name: "David Park",     role: "Backend Dev",     dept: "Engineering", avatar: "DP", email: "d.park@acme.com",    phone: "+1 415-000-0031", location: "San Francisco", joined: "Oct 2021",  reports: 0 },
            { id: "yt", name: "Yuki Tanaka",    role: "Sr Frontend",     dept: "Engineering", avatar: "YT", email: "y.tanaka@acme.com",  phone: "+1 415-000-0032", location: "Remote",         joined: "Jan 2026",  reports: 0 },
          ],
        },
        { id: "ms", name: "Marco Santos",  role: "DevOps Lead",     dept: "Engineering", avatar: "MS", email: "m.santos@acme.com",     phone: "+1 415-000-0021", location: "Austin",           joined: "Sep 2020",  reports: 0 },
      ],
    },
    {
      id: "vps", name: "Robert Chen",    role: "VP Sales",       dept: "Sales",       avatar: "RC", email: "r.chen@acme.com",       phone: "+1 212-000-0010", location: "New York",         joined: "Feb 2019",  reports: 1,
      children: [
        {
          id: "th", name: "Tom Harris",  role: "Sales Lead",     dept: "Sales",       avatar: "TH", email: "t.harris@acme.com",     phone: "+1 212-000-0020", location: "New York",         joined: "Apr 2020",  reports: 2,
          children: [
            { id: "jk", name: "James Kim",      role: "Sales Rep",       dept: "Sales",       avatar: "JK", email: "j.kim@acme.com",     phone: "+1 212-000-0030", location: "New York",         joined: "Mar 2022",  reports: 0 },
            { id: "ng", name: "Nina Gupta",     role: "Sales Rep",       dept: "Sales",       avatar: "NG", email: "n.gupta@acme.com",   phone: "+1 212-000-0031", location: "Chicago",          joined: "Jul 2022",  reports: 0 },
          ],
        },
      ],
    },
    {
      id: "vpm", name: "Clara West",     role: "VP Marketing",   dept: "Marketing",   avatar: "CW", email: "c.west@acme.com",       phone: "+1 415-000-0011", location: "San Francisco", joined: "May 2019",  reports: 1,
      children: [
        { id: "er", name: "Emily Rodriguez", role: "Mktg Lead",      dept: "Marketing",   avatar: "ER", email: "e.rodriguez@acme.com",phone: "+1 415-000-0022", location: "San Francisco", joined: "Sep 2020",  reports: 0 },
      ],
    },
    {
      id: "chro", name: "Aisha Patel",   role: "CHRO",           dept: "HR",          avatar: "AP", email: "a.patel@acme.com",      phone: "+1 415-000-0012", location: "San Francisco", joined: "Jan 2018",  reports: 1,
      children: [
        { id: "ln", name: "Lisa Nguyen",     role: "HR Coordinator",  dept: "HR",          avatar: "LN", email: "l.nguyen@acme.com",   phone: "+1 415-000-0023", location: "San Francisco", joined: "Feb 2023",  reports: 0 },
      ],
    },
    {
      id: "cfo", name: "Sandra Brooks",  role: "CFO",            dept: "Finance",     avatar: "SB", email: "s.brooks@acme.com",     phone: "+1 212-000-0011", location: "New York",         joined: "Aug 2018",  reports: 1,
      children: [
        { id: "lw", name: "Lisa Wang",       role: "Finance Analyst", dept: "Finance",     avatar: "LW", email: "l.wang@acme.com",      phone: "+1 212-000-0022", location: "New York",         joined: "Mar 2022",  reports: 0 },
      ],
    },
    {
      id: "cd", name: "Alex Turner",     role: "Creative Dir.",  dept: "Design",      avatar: "AT", email: "a.turner@acme.com",     phone: "+1 415-000-0013", location: "San Francisco", joined: "Jun 2019",  reports: 2,
      children: [
        { id: "mc", name: "Michael Chen",    role: "UI Designer",     dept: "Design",      avatar: "MC", email: "m.chen@acme.com",      phone: "+1 415-000-0024", location: "San Francisco", joined: "Nov 2021",  reports: 0 },
        { id: "cr", name: "Carlos Romero",   role: "UX Designer",     dept: "Design",      avatar: "CR", email: "c.romero@acme.com",    phone: "+1 415-000-0025", location: "San Francisco", joined: "Mar 2026",  reports: 0 },
      ],
    },
  ],
};

/* ─── Colors ──────────────────────────────────────────────────────────────── */

const DEPT_STYLE: Record<string, { stroke: string; fill: string; avatar: string; text: string; dot: string; badge: string }> = {
  Executive:   { stroke: "#7c3aed", fill: "#faf5ff", avatar: "bg-violet-100 text-violet-700",  text: "text-violet-700",  dot: "bg-violet-500",  badge: "bg-violet-100 text-violet-700" },
  Engineering: { stroke: "#2563eb", fill: "#eff6ff", avatar: "bg-blue-100 text-blue-700",      text: "text-blue-700",    dot: "bg-blue-500",    badge: "bg-blue-100 text-blue-700" },
  Sales:       { stroke: "#059669", fill: "#ecfdf5", avatar: "bg-emerald-100 text-emerald-700",text: "text-emerald-700", dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  Marketing:   { stroke: "#d97706", fill: "#fffbeb", avatar: "bg-amber-100 text-amber-700",    text: "text-amber-700",   dot: "bg-amber-500",   badge: "bg-amber-100 text-amber-700" },
  HR:          { stroke: "#e11d48", fill: "#fff1f2", avatar: "bg-rose-100 text-rose-700",      text: "text-rose-700",    dot: "bg-rose-500",    badge: "bg-rose-100 text-rose-700" },
  Finance:     { stroke: "#0d9488", fill: "#f0fdfa", avatar: "bg-teal-100 text-teal-700",      text: "text-teal-700",    dot: "bg-teal-500",    badge: "bg-teal-100 text-teal-700" },
  Design:      { stroke: "#4f46e5", fill: "#eef2ff", avatar: "bg-indigo-100 text-indigo-700",  text: "text-indigo-700",  dot: "bg-indigo-500",  badge: "bg-indigo-100 text-indigo-700" },
};

/* ─── Layout Engine ───────────────────────────────────────────────────────── */

const CW = 148, CH = 66, HG = 26, VG = 54, PAD = 40;

interface LNode extends OrgPerson { x: number; y: number; sw: number; lchildren: LNode[] }

function layout(node: OrgPerson, depth: number, left: number, ex: Set<string>): LNode {
  const open = ex.has(node.id) && (node.children?.length ?? 0) > 0;
  if (!open || !node.children || node.children.length === 0) {
    return { ...node, x: left + CW / 2, y: depth * (CH + VG) + PAD, sw: CW, lchildren: [] };
  }
  let cur = left;
  const lc: LNode[] = [];
  for (const ch of node.children) {
    const n = layout(ch, depth + 1, cur, ex);
    lc.push(n);
    cur += n.sw + HG;
  }
  const sw = Math.max(cur - left - HG, CW);
  return { ...node, x: left + sw / 2, y: depth * (CH + VG) + PAD, sw, lchildren: lc };
}

function allNodes(n: LNode): LNode[] { return [n, ...n.lchildren.flatMap(allNodes)]; }

function allEdges(n: LNode): { x1: number; y1: number; x2: number; y2: number }[] {
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (const c of n.lchildren) {
    edges.push({ x1: n.x, y1: n.y + CH, x2: c.x, y2: c.y });
    edges.push(...allEdges(c));
  }
  return edges;
}

function countAll(n: OrgPerson): number {
  return 1 + (n.children ?? []).reduce((s, c) => s + countAll(c), 0);
}

function collectByDept(n: OrgPerson, acc: Record<string, number> = {}): Record<string, number> {
  acc[n.dept] = (acc[n.dept] ?? 0) + 1;
  (n.children ?? []).forEach(c => collectByDept(c, acc));
  return acc;
}

function findPerson(n: OrgPerson, id: string): OrgPerson | null {
  if (n.id === id) return n;
  for (const c of n.children ?? []) { const f = findPerson(c, id); if (f) return f; }
  return null;
}

function findParent(n: OrgPerson, id: string): OrgPerson | null {
  for (const c of n.children ?? []) {
    if (c.id === id) return n;
    const f = findParent(c, id);
    if (f) return f;
  }
  return null;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function OrgTree() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["ceo"]));
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [zoom, setZoom]         = useState(1);
  const [filterDept, setFilterDept] = useState<string | null>(null);

  const root    = useMemo(() => layout(ORG, 0, 0, expanded), [expanded]);
  const nodes   = useMemo(() => allNodes(root), [root]);
  const edges   = useMemo(() => allEdges(root), [root]);
  const svgW    = root.sw + PAD * 2;
  const maxY    = Math.max(...nodes.map(n => n.y)) + CH + PAD;
  const depts   = useMemo(() => collectByDept(ORG), []);
  const total   = useMemo(() => countAll(ORG), []);
  const selectedPerson = selected ? findPerson(ORG, selected) : null;
  const parentPerson   = selected ? findParent(ORG, selected) : null;

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function expandAll() {
    const ids = new Set<string>();
    function walk(n: OrgPerson) { if (n.children?.length) { ids.add(n.id); n.children.forEach(walk); } }
    walk(ORG);
    setExpanded(ids);
  }
  function collapseAll() { setExpanded(new Set(["ceo"])); }

  const matchesSearch = (n: OrgPerson) =>
    !search || n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.role.toLowerCase().includes(search.toLowerCase()) ||
    n.dept.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-foreground flex">
 

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-5 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold">Organization Chart</h1>
            <p className="text-xs text-muted-foreground">Acme Corp · {total} employees · Last updated Mar 30, 2026</p>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input className="h-7 pl-8 text-xs w-44" placeholder="Search people…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1 border dark:border-slate-700 rounded-lg p-0.5 bg-white dark:bg-slate-900">
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={expandAll}>Expand all</Button>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={collapseAll}>Collapse</Button>
          </div>
          <div className="flex items-center gap-1 border dark:border-slate-700 rounded-lg p-0.5 bg-white dark:bg-slate-900">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}><ZoomIn className="w-3.5 h-3.5" /></Button>
            <span className="text-xs font-semibold w-9 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}><ZoomOut className="w-3.5 h-3.5" /></Button>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1"><Download className="w-3.5 h-3.5" />Export</Button>
          <Button size="sm" className="h-7 text-xs gap-1 bg-violet-600 hover:bg-violet-700 text-white"><UserPlus className="w-3.5 h-3.5" />Add Person</Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Chart canvas */}
          <div className="flex-1 overflow-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]">
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "top center", width: svgW, minHeight: maxY }}>
              <svg
                width={svgW}
                height={maxY}
                style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
              >
                {edges.map((e, i) => {
                  const midY = (e.y1 + e.y2) / 2;
                  return (
                    <path
                      key={i}
                      d={`M ${e.x1} ${e.y1} V ${midY} H ${e.x2} V ${e.y2}`}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                    />
                  );
                })}
              </svg>

              {/* Node cards */}
              <div style={{ position: "relative", width: svgW, height: maxY }}>
                {nodes.map(node => {
                  const s = DEPT_STYLE[node.dept] ?? DEPT_STYLE.Executive;
                  const isSelected = selected === node.id;
                  const hasKids = (node.children?.length ?? 0) > 0;
                  const isOpen = expanded.has(node.id);
                  const highlight = search && matchesSearch(node);
                  const dimmed = (filterDept && node.dept !== filterDept) || (search && !matchesSearch(node));
                  return (
                    <div
                      key={node.id}
                      style={{
                        position: "absolute",
                        left: node.x - CW / 2,
                        top: node.y,
                        width: CW,
                        height: CH,
                        opacity: dimmed ? 0.25 : 1,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <div
                        onClick={() => setSelected(isSelected ? null : node.id)}
                        className={`w-full h-full rounded-xl border-2 cursor-pointer transition-all select-none flex flex-col justify-center px-3 gap-0.5 shadow-sm hover:shadow-md ${isSelected ? "shadow-lg ring-2 ring-offset-1 ring-offset-background" : ""}`}
                        style={{
                          borderColor: isSelected ? s.stroke : highlight ? s.stroke : "#cbd5e1",
                          backgroundColor: isSelected ? s.fill : "hsl(var(--card))",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${s.avatar}`}>{node.avatar}</div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-bold leading-tight truncate">{node.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate leading-tight">{node.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${s.badge}`}>{node.dept}</span>
                          {hasKids && (
                            <button
                              onClickCapture={e => { e.stopPropagation(); toggle(node.id); }}
                              className="w-4 h-4 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 flex items-center justify-center flex-shrink-0 transition-colors"
                            >
                              {isOpen
                                ? <ChevronUp className="w-2.5 h-2.5 text-gray-500 dark:text-slate-300" />
                                : <ChevronDown className="w-2.5 h-2.5 text-gray-500 dark:text-slate-300" />}
                            </button>
                          )}
                          {!hasKids && <div className="w-4 h-4 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-slate-500" /></div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detail panel */}
          {selectedPerson && (
            <div className="w-64 bg-white dark:bg-slate-900 border-l dark:border-slate-800 flex flex-col shrink-0 overflow-auto">
              {/* Header */}
              <div className="h-20 bg-gradient-to-br from-violet-600 to-indigo-500 flex items-end px-4 pb-3 relative">
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex items-end gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shadow-md ${DEPT_STYLE[selectedPerson.dept]?.avatar ?? "bg-gray-100 dark:bg-slate-700"}`}>{selectedPerson.avatar}</div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{selectedPerson.name}</p>
                    <p className="text-white/75 text-xs">{selectedPerson.role}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Dept badge */}
                <div className="flex justify-between items-center">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${DEPT_STYLE[selectedPerson.dept]?.badge}`}>{selectedPerson.dept}</span>
                  <span className="text-xs text-muted-foreground">Since {selectedPerson.joined}</span>
                </div>

                {/* Contact info */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Contact</p>
                  {[
                    { icon: <Mail className="w-3.5 h-3.5 text-muted-foreground" />, val: selectedPerson.email },
                    { icon: <Phone className="w-3.5 h-3.5 text-muted-foreground" />, val: selectedPerson.phone },
                    { icon: <MapPin className="w-3.5 h-3.5 text-muted-foreground" />, val: selectedPerson.location },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {r.icon}<span className="text-xs truncate">{r.val}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Reports to */}
                {parentPerson && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Reports To</p>
                    <div
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/40 cursor-pointer hover:bg-muted/60 transition-colors"
                      onClick={() => setSelected(parentPerson.id)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${DEPT_STYLE[parentPerson.dept]?.avatar}`}>{parentPerson.avatar}</div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold truncate">{parentPerson.name}</p>
                        <p className="text-[10px] text-muted-foreground">{parentPerson.role}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct reports */}
                {(selectedPerson.children?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">Direct Reports ({selectedPerson.children!.length})</p>
                    <div className="space-y-1.5">
                      {selectedPerson.children!.map(c => (
                        <div
                          key={c.id}
                          className="flex items-center gap-2 p-2 rounded-xl bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => setSelected(c.id)}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${DEPT_STYLE[c.dept]?.avatar}`}>{c.avatar}</div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">{c.name}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{c.role}</p>
                          </div>
                          <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto flex-shrink-0" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Quick actions */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Actions</p>
                  <Button variant="outline" size="sm" className="w-full text-xs h-7 gap-1.5 justify-start">
                    <Mail className="w-3.5 h-3.5" />Send Message
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs h-7 gap-1.5 justify-start">
                    <FileText className="w-3.5 h-3.5" />View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="w-full text-xs h-7 gap-1.5 justify-start">
                    <Layers className="w-3.5 h-3.5" />See Team
                  </Button>
                  <Button size="sm" className="w-full text-xs h-7 gap-1.5 justify-start bg-violet-600 hover:bg-violet-700 text-white">
                    <Target className="w-3.5 h-3.5" />View Reviews
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrgTree;
