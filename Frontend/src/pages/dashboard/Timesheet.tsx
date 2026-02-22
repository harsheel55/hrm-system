import {
    Clock,
    CheckCircle,
    Calendar,
    AlertCircle,
    Save,
    FileText,
    Download,
    Plus,
    BarChart3,
    Clock4
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

const Timesheet = () => {
    const timesheetData = [
        { project: 'Frontend Development', mon: 8, tue: 8, wed: 7, thu: 8, fri: 8, sat: 0, sun: 0, total: 39, status: 'Submitted' },
        { project: 'Backend API', mon: 4, tue: 6, wed: 8, thu: 5, fri: 7, sat: 0, sun: 0, total: 30, status: 'Approved' },
        { project: 'Database Design', mon: 2, tue: 0, wed: 3, thu: 4, fri: 2, sat: 0, sun: 0, total: 11, status: 'Pending' },
        { project: 'Team Meetings', mon: 2, tue: 2, wed: 2, thu: 2, fri: 2, sat: 0, sun: 0, total: 10, status: 'Approved' },
    ];

    const timesheetStats = [
        { label: 'Logged Hours', value: '90h', change: 'Target: 40h/wk', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Approved', value: '02', change: 'This Week', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'In Review', value: '01', change: 'Pending Manager', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Utilisation', value: '94%', change: 'Optimal', icon: BarChart3, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const weeklySummary = [
        { day: 'Mon', date: '12', hours: 16, percentage: 80 },
        { day: 'Tue', date: '13', hours: 16, percentage: 80 },
        { day: 'Wed', date: '14', hours: 20, percentage: 100 },
        { day: 'Thu', date: '15', hours: 19, percentage: 95 },
        { day: 'Fri', date: '16', hours: 19, percentage: 95 },
        { day: 'Sat', date: '17', hours: 0, percentage: 0 },
        { day: 'Sun', date: '18', hours: 0, percentage: 0 },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground pb-12 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">Time Tracking</h1>
                        <p className="text-muted-foreground text-sm font-medium mt-1">Log your project hours and submit for manager approval.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl">
                            <Calendar size={18} className="mr-2" />
                            Jun 12 - Jun 18
                        </Button>
                        <Button className="rounded-2xl shadow-lg">
                            <Save size={18} className="mr-2" />
                            Save & Submit
                        </Button>
                    </div>
                </div>

                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {timesheetStats.map((stat, i) => (
                        <Card key={i} className="p-6 hover:shadow-md transition-all cursor-pointer bg-card text-card-foreground border-border">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                            </div>
                            <h3 className="text-2xl font-black text-foreground mb-0.5">{stat.value}</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Main Timesheet Table --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="overflow-hidden bg-card text-card-foreground border-border">
                            <div className="p-6 border-b border-border flex justify-between items-center">
                                <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Clock4 size={20} className="text-primary" />
                                    Weekly Log
                                </h3>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon">
                                        <Download size={20} />
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Plus size={14} className="mr-1" /> Add Task
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/60">
                                            <TableHead className="text-left font-black">Project / Task</TableHead>
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                                                <TableHead key={day} className="text-center">{day}</TableHead>
                                            ))}
                                            <TableHead className="text-center">Total</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {timesheetData.map((project, i) => (
                                            <TableRow key={i} className="group">
                                                <TableCell className="text-left">
                                                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{project.project}</p>
                                                    <p className="text-[10px] font-medium text-muted-foreground uppercase">Development</p>
                                                </TableCell>
                                                {[project.mon, project.tue, project.wed, project.thu, project.fri, project.sat, project.sun].map((hr, idx) => (
                                                    <TableCell key={idx} className={`text-center font-mono ${hr === 0 ? 'text-muted-foreground/40' : 'text-foreground font-bold'}`}>
                                                        {hr}
                                                    </TableCell>
                                                ))}
                                                <TableCell className="text-center font-mono font-black bg-muted/30">
                                                    {project.total}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge className={`${project.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' :
                                                        project.status === 'Submitted' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${project.status === 'Approved' ? 'bg-emerald-600' :
                                                            project.status === 'Submitted' ? 'bg-blue-600' : 'bg-amber-600'
                                                            }`}></span>
                                                        {project.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>

                        {/* Submission Warning */}
                        <Alert className="bg-amber-50 border-amber-200">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <AlertDescription>
                                <h4 className="font-semibold text-amber-900 mb-1">Review Required</h4>
                                <p className="text-xs text-amber-700">
                                    Double-check your billable hours for <strong>Frontend Development</strong>.
                                    Once submitted, hours are locked for payroll processing and cannot be edited without manager reversal.
                                </p>
                            </AlertDescription>
                        </Alert>
                    </div>

                    {/* --- Sidebar: Daily Breakdown --- */}
                    <div className="space-y-6">
                        <Card className="p-8 bg-card text-card-foreground border-border">
                            <h3 className="text-lg font-bold text-foreground mb-8 flex items-center gap-2">
                                <BarChart3 size={20} className="text-primary" />
                                Daily Output
                            </h3>

                            <div className="flex items-end justify-between gap-2 h-32 mb-8 px-2">
                                {weeklySummary.map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                        <div
                                            className={`w-full rounded-t-lg transition-all duration-500 ${day.percentage > 0 ? 'bg-primary group-hover:bg-primary/90' : 'bg-muted'}`}
                                            style={{ height: `${day.percentage}%` }}
                                        ></div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{day.day}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-muted border border-border flex justify-between items-center">
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Avg. Productive Time</p>
                                    <p className="text-lg font-black text-foreground">8.4h</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-muted border border-border flex justify-between items-center">
                                    <p className="text-xs font-bold text-muted-foreground uppercase">Project Overlap</p>
                                    <p className="text-lg font-black text-foreground">03 Tasks</p>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Action Widget */}
                        <Card className="p-8 bg-card text-card-foreground border-border">
                            <div>
                                <h4 className="text-xl font-bold mb-2">Need Help?</h4>
                                <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                                    If your project is not listed, please contact the Resource Manager to be assigned.
                                </p>
                                <Button variant="secondary" className="w-full">
                                    Contact Resource Team
                                </Button>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Timesheet;