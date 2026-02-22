import {
    TrendingUp,
    Users,
    Award,
    Target,
    PieChart,
    ArrowDownRight,
    ArrowUpRight,
    Download,
    Layers,
    Calendar,
    UserMinus,
    FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

const Analytics = () => {
    const analyticsStats = [
        { label: 'Total Headcount', value: '1,284', change: '+12%', isPositive: true, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Turnover Rate', value: '4.2%', change: '-1.1%', isPositive: true, icon: UserMinus, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Offer Acceptance', value: '88%', change: '+3.2%', isPositive: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Avg Tenure', value: '3.2y', change: '+0.4', isPositive: true, icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const departmentData = [
        { name: 'Engineering', value: 45, employees: 578, color: 'bg-blue-500' },
        { name: 'Sales & Marketing', value: 25, employees: 321, color: 'bg-emerald-500' },
        { name: 'Product', value: 15, employees: 193, color: 'bg-indigo-500' },
        { name: 'Support', value: 10, employees: 128, color: 'bg-amber-500' },
        { name: 'HR & Admin', value: 5, employees: 64, color: 'bg-slate-400' },
    ];

    const hiringData = [40, 60, 45, 70, 50, 65, 55, 80, 60, 75, 50, 90];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-12 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Header Control Center --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400">
                            <PieChart size={16} />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Intelligence Engine</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Workforce Analytics</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Real-time insights into your organization's human capital.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Select defaultValue="12months">
                            <SelectTrigger className="w-[180px] rounded-2xl">
                                <Calendar size={18} className="mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="12months">Last 12 Months</SelectItem>
                                <SelectItem value="6months">Last 6 Months</SelectItem>
                                <SelectItem value="3months">Last 3 Months</SelectItem>
                                <SelectItem value="ytd">Year to Date</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-2xl shadow-lg">
                            <Download size={18} className="mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* --- Primary Metrics --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {analyticsStats.map((stat, i) => (
                        <Card key={i} className="p-6 hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <Badge variant={stat.isPositive ? "secondary" : "destructive"} className="text-[11px] font-black px-2 py-1 h-fit gap-1">
                                    {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {stat.change}
                                </Badge>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

                    {/* --- Hiring vs Attrition Chart --- */}
                    <Card className="lg:col-span-2 p-8">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Growth Velocity</h3>
                                <p className="text-xs font-medium text-slate-400">Monthly hiring volume tracking</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">Hires</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-slate-100 dark:bg-slate-700 rounded-full"></span>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase">Avg</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end justify-between gap-2 h-64 px-2">
                            {hiringData.map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-3 w-full group">
                                    <div className="relative w-full flex items-end justify-center h-full">
                                        {/* Background Bar (Total Capacity) */}
                                        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-700/50 rounded-t-lg mx-1"></div>
                                        {/* Value Bar */}
                                        <div
                                            className="relative z-10 w-full bg-blue-500 hover:bg-indigo-600 rounded-t-lg transition-all duration-500 shadow-sm hover:shadow-indigo-100 dark:hover:shadow-indigo-900/30"
                                            style={{ height: `${h}%` }}
                                        >
                                            <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap transition-all">
                                                {h} Hires
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{months[i]}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* --- Department Distribution --- */}
                    <Card className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Layers size={20} className="text-indigo-600 dark:text-indigo-400" />
                                Departments
                            </h3>
                            <Button variant="ghost" className="text-sm font-bold h-fit">Audit</Button>
                        </div>

                        <div className="space-y-6">
                            {departmentData.map((dept, i) => (
                                <div key={i} className="group cursor-default">
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{dept.name}</span>
                                        <span className="text-slate-400">{dept.employees} Staff</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-100/50 dark:border-slate-700/50">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${dept.color}`}
                                            style={{ width: `${dept.value}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-end mt-1">
                                        <span className="text-[10px] font-black text-slate-300 dark:text-slate-500">{dept.value}% Share</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 flex items-center gap-3">
                            <Target className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" size={18} />
                            <p className="text-[11px] font-bold text-indigo-700 dark:text-indigo-200 leading-tight">Engineering has grown 18% since January Q1.</p>
                        </div>
                    </Card>
                </div>

                {/* --- Quick Actions Bar --- */}
                <Card className="bg-slate-900 dark:bg-slate-800 text-white rounded-[2rem] p-4 mb-10 border-0">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <span className="text-white text-xs font-bold px-4 border-r border-white/10 hidden md:block">QUICK TOOLS</span>
                        <div className="grid grid-cols-2 md:grid-cols-4 w-full gap-2">
                            {['Employee Roster', 'Recruitment Stats', 'Activity Feeds', 'Approval Queue'].map(tool => (
                                <Button key={tool} variant="outline" className="bg-white/5 hover:bg-white/10 text-white border-white/5 rounded-xl h-fit py-2.5 text-xs font-bold">
                                    {tool}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* --- Yearly Scoreboard --- */}
                <Card className="p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">2024 Performance Summary</h3>
                        <Button className="h-fit rounded-xl">
                            Detailed Audit <FileText size={16} className="ml-2" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-2 tracking-tighter">156</div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">New Talents Hired</p>
                            <p className="text-xs font-medium text-slate-400 mt-2 text-center md:text-left">Surpassed the annual target by 24% as of October.</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start border-y md:border-y-0 md:border-x border-slate-200 dark:border-slate-700 py-10 md:py-0 md:px-10">
                            <div className="text-5xl font-black text-emerald-500 mb-2 tracking-tighter">94%</div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Employee Retention</p>
                            <p className="text-xs font-medium text-slate-400 mt-2 text-center md:text-left">Industry leading stability within engineering teams.</p>
                        </div>
                        <div className="flex flex-col items-center md:items-start">
                            <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 mb-2 tracking-tighter">4.2y</div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Avg. Service Tenure</p>
                            <p className="text-xs font-medium text-slate-400 mt-2 text-center md:text-left">Increased by 6 months compared to the 2023 average.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Analytics;
