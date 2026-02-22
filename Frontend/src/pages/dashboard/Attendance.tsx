import {
    Clock,
    CheckCircle,
    Calendar as CalendarIcon,
    AlertCircle,
    ArrowUpRight,
    ArrowDownLeft,
    Search,
    Filter,
    Download,
    MoreVertical,
    MapPin,
    Coffee
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';

const Attendance = () => {
    const attendanceData = [
        { date: 'Jun 5', checkIn: '08:30 AM', checkOut: '06:45 PM', hours: '10h 15m', status: 'Present', type: 'Office', relatedTab: 'Activities' },
        { date: 'Jun 4', checkIn: '-', checkOut: '-', hours: '-', status: 'On Leave', type: 'Remote', relatedTab: 'Leave' },
        { date: 'Jun 3', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: '8h 45m', status: 'Present', type: 'Office', relatedTab: 'Activities' },
        { date: 'Jun 2', checkIn: '08:45 AM', checkOut: '06:30 PM', hours: '9h 45m', status: 'Present', type: 'Remote', relatedTab: 'Activities' },
        { date: 'Jun 1', checkIn: '09:00 AM', checkOut: '06:15 PM', hours: '9h 15m', status: 'Present', type: 'Office', relatedTab: 'Activities' },
    ];

    const attendanceStats = [
        { label: 'Attendance Rate', value: '92%', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', trend: '+2% from last month' },
        { label: 'Avg. Daily Hours', value: '9.2h', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'On Track' },
        { label: 'Late Arrivals', value: '02', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-1 from last month' },
        { label: 'Leave Balance', value: '14', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50', trend: '4 Pending' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pb-12 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Attendance Workspace</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Manage your work logs and shift compliance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                            <Input
                                type="text"
                                placeholder="Search logs..."
                                className="pl-10 w-64"
                            />
                        </div>
                        <Button variant="outline" className="rounded-xl">
                            <Filter size={16} className="mr-2" />
                            Filters
                        </Button>
                        <Button className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded-xl shadow-lg">
                            <Download size={16} className="mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {attendanceStats.map((stat, i) => (
                        <Card key={i} className="p-6 hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                <Badge className="text-[10px] h-fit bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">Real-time</Badge>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">{stat.label}</p>
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                                <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                    <span className="text-blue-600 dark:text-blue-400 font-bold">{stat.trend}</span>
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Attendance Table (Main Column) --- */}
                    <Card className="lg:col-span-2 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 dark:text-white">Recent Activities</h3>
                            <Button variant="ghost" size="sm">
                                <MoreVertical size={20} />
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Date & Type</TableHead>
                                    <TableHead className="text-center text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Check-In</TableHead>
                                    <TableHead className="text-center text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Check-Out</TableHead>
                                    <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Duration</TableHead>
                                    <TableHead className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceData.map((record, i) => (
                                    <TableRow key={i} className="group">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${record.type === 'Office' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'}`}>
                                                    {record.type === 'Office' ? <MapPin size={18} /> : <Coffee size={18} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{record.date}</p>
                                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{record.type}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300">
                                                <ArrowDownLeft size={14} className="mr-1 text-green-500 dark:text-green-400" />
                                                {record.checkIn}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300">
                                                <ArrowUpRight size={14} className="mr-1 text-blue-500 dark:text-blue-400" />
                                                {record.checkOut}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-sm font-mono font-bold text-slate-600 dark:text-slate-400">{record.hours}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={record.status === 'Present' ? 'secondary' : 'outline'} className={`text-[11px] font-bold h-fit ${record.status === 'Present' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-2 ${record.status === 'Present' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 text-center border-t border-slate-200 dark:border-slate-700">
                            <Button variant="ghost" className="text-xs font-bold text-blue-600 dark:text-blue-400 h-fit">Load More History</Button>
                        </div>
                    </Card>

                    {/* --- Sidebar Widgets --- */}
                    <div className="space-y-6">
                        {/* Calendar Widget */}
                        <Card className="p-6">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <CalendarIcon size={18} className="text-blue-600" />
                                Attendance Calendar
                            </h4>
                            <Calendar
                                mode="single"
                                className="rounded-md border"
                            />
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="text-slate-600 dark:text-slate-400">Present</span>
                                    </div>
                                    <span className="text-slate-500 dark:text-slate-400">22 days</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                        <span className="text-slate-600 dark:text-slate-400">Leave</span>
                                    </div>
                                    <span className="text-slate-500 dark:text-slate-400">2 days</span>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Action Wheel */}
                        <Card className="bg-slate-900 dark:bg-slate-900/40 text-white p-8 relative overflow-hidden border-0">
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold mb-2">Need a Break?</h4>
                                <p className="text-slate-400 text-xs mb-6 leading-relaxed">Submit your leave requests or out-of-office logs quickly.</p>
                                <Button className="w-full bg-white text-slate-900 hover:bg-blue-50 rounded-2xl font-bold text-sm">
                                    <CalendarIcon size={18} className="mr-2" />
                                    Request Time Off
                                </Button>
                                <Button variant="outline" className="w-full mt-3 bg-slate-800 dark:bg-slate-800/50 text-white hover:bg-slate-700 dark:hover:bg-slate-700/50 border-slate-700 dark:border-white/10 rounded-2xl font-bold text-sm">
                                    Regularize Logs
                                </Button>
                            </div>
                            {/* Decorative background circle */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl hover:bg-blue-600/40 transition-all"></div>
                        </Card>

                        {/* Summary Scoreboard */}
                        <Card className="p-6">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                                Monthly Summary
                                <Badge className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 italic h-fit">Updated 1h ago</Badge>
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-green-500 dark:bg-green-400 rounded-full"></div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Days Present</p>
                                    </div>
                                    <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">22</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-amber-400 rounded-full"></div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Leave / Sick</p>
                                    </div>
                                    <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">02</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-blue-600 dark:bg-blue-600/80 rounded-2xl text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-white/30 rounded-full"></div>
                                        <p className="text-sm font-bold">Total Work Hours</p>
                                    </div>
                                    <span className="text-lg font-mono font-bold">176.5</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-6 font-medium">You have met 98% of your monthly hour quota.</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;