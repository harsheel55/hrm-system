import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { userService } from "@/services/user.service";
import type { UserResponseDto } from "@/types/api.types";
import {
  FileText, Target, Search, ChevronDown, ChevronUp,
  ZoomIn, ZoomOut, Mail, Phone, MapPin, UserPlus,
  Download, ChevronRight, Layers, Loader2,
} from "lucide-react";

/* ─── Data ────────────────────────────────────────────────────────────────── */

interface OrgPerson {
  id: string; name: string; role: string; dept: string; avatar: string;
  email: string; phone: string; location: string; joined: string;
  reports: number; // total direct reports (used for sidebar info)
  children?: OrgPerson[];
}

const EXECUTIVE_ROLE_HINTS = ["super admin", "admin", "ceo", "cto", "cfo", "coo", "chief", "vp", "head", "director"];
const MANAGER_ROLE_HINTS = ["manager", "lead", "supervisor", "head", "director", "vp", "chief"];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function inferDepartment(roleName?: string): string {
  const role = (roleName ?? "").toLowerCase();
  if (role.includes("engineer") || role.includes("developer") || role.includes("devops") || role.includes("cto")) return "Engineering";
  if (role.includes("sales")) return "Sales";
  if (role.includes("market")) return "Marketing";
  if (role.includes("hr") || role.includes("human")) return "HR";
  if (role.includes("finance") || role.includes("account") || role.includes("cfo")) return "Finance";
  if (role.includes("design") || role.includes("ux") || role.includes("ui") || role.includes("creative")) return "Design";
  if (EXECUTIVE_ROLE_HINTS.some(k => role.includes(k))) return "Executive";
  return "Executive";
}

function toOrgPerson(user: UserResponseDto): OrgPerson {
  const joinedDate = user.dtCreatedDate ? new Date(user.dtCreatedDate) : null;
  const joined = joinedDate && !Number.isNaN(joinedDate.getTime())
    ? joinedDate.toLocaleDateString(undefined, { month: "short", year: "numeric" })
    : "N/A";

  return {
    id: user.strUserGUID,
    name: user.strUserName,
    role: user.strRoleName || "Employee",
    dept: inferDepartment(user.strRoleName),
    avatar: initials(user.strUserName),
    email: user.strEmail,
    phone: user.strPhoneNo || "N/A",
    location: "N/A",
    joined,
    reports: 0,
    children: [],
  };
}

function withReportCounts(node: OrgPerson): OrgPerson {
  const children = (node.children ?? []).map(withReportCounts);
  return {
    ...node,
    reports: children.length,
    children,
  };
}

function buildOrgFromUsers(users: UserResponseDto[]): OrgPerson | null {
  const activeUsers = users.filter(u => u.bolIsActive);
  if (activeUsers.length === 0) return null;

  const people = activeUsers.map(toOrgPerson);
  const byId = new Map(people.map(p => [p.id, p]));

  const executive = people.find(p => EXECUTIVE_ROLE_HINTS.some(k => p.role.toLowerCase().includes(k)));
  const root = executive ?? people[0];

  const managers = people.filter(
    p => p.id !== root.id && MANAGER_ROLE_HINTS.some(k => p.role.toLowerCase().includes(k))
  );

  const individualContributors = people.filter(
    p => p.id !== root.id && !managers.some(m => m.id === p.id)
  );

  const rootNode = byId.get(root.id)!;
  rootNode.children = [];

  for (const manager of managers) {
    const managerNode = byId.get(manager.id)!;
    managerNode.children = [];
    rootNode.children.push(managerNode);
  }

  if (rootNode.children.length === 0) {
    rootNode.children = individualContributors.map(ic => byId.get(ic.id)!);
  } else {
    individualContributors.forEach((ic, index) => {
      const manager = rootNode.children![index % rootNode.children!.length];
      manager.children = manager.children ?? [];
      manager.children.push(byId.get(ic.id)!);
    });
  }

  return withReportCounts(rootNode);
}

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
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch]     = useState("");
  const [zoom, setZoom]         = useState(1);
  const [filterDept] = useState<string | null>(null);
  const [orgData, setOrgData] = useState<OrgPerson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadOrgData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await userService.getAllUsers();
        const rootNode = buildOrgFromUsers(response.data ?? []);
        if (!rootNode) {
          setOrgData(null);
          setExpanded(new Set());
          setSelected(null);
          return;
        }
        setOrgData(rootNode);
        setExpanded(new Set([rootNode.id]));
        setSelected(null);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load organization chart.";
        setErrorMessage(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrgData();
  }, []);

  const root = useMemo(() => (orgData ? layout(orgData, 0, 0, expanded) : null), [expanded, orgData]);
  const nodes = useMemo(() => (root ? allNodes(root) : []), [root]);
  const edges = useMemo(() => (root ? allEdges(root) : []), [root]);
  const svgW = root ? root.sw + PAD * 2 : 0;
  const maxY = nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) + CH + PAD : 0;
  const total = useMemo(() => (orgData ? countAll(orgData) : 0), [orgData]);
  const selectedPerson = selected && orgData ? findPerson(orgData, selected) : null;
  const parentPerson = selected && orgData ? findParent(orgData, selected) : null;

  function toggle(id: string) {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function expandAll() {
    if (!orgData) return;
    const ids = new Set<string>();
    function walk(n: OrgPerson) { if (n.children?.length) { ids.add(n.id); n.children.forEach(walk); } }
    walk(orgData);
    setExpanded(ids);
  }
  function collapseAll() {
    if (!orgData) return;
    setExpanded(new Set([orgData.id]));
  }

  const matchesSearch = (n: OrgPerson) =>
    !search || n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.role.toLowerCase().includes(search.toLowerCase()) ||
    n.dept.toLowerCase().includes(search.toLowerCase());

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading organization chart...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-semibold">Failed to load organization chart</p>
          <p className="mt-1 text-sm">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!orgData || !root) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="max-w-lg w-full rounded-lg border bg-white dark:bg-slate-900 p-4">
          <p className="font-semibold">No active users found</p>
          <p className="mt-1 text-sm text-muted-foreground">Create or activate users to render the organization chart.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-foreground flex">
 

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <div className="bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-5 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold">Organization Chart</h1>
            <p className="text-xs text-muted-foreground">Acme Corp · {total} employees · Last updated {new Date().toLocaleDateString()}</p>
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
