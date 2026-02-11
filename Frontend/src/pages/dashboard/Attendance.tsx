import {
    Clock,
    CheckCircle,
    Calendar,
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
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64 text-slate-700 dark:text-slate-200 backdrop-blur-sm"
                            />
                        </div>
                        <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold shadow-sm transition-all backdrop-blur-sm">
                            <Filter size={16} className="mr-2" />
                            Filters
                        </button>
                        <button className="flex items-center px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg shadow-slate-200 dark:shadow-blue-900/20 text-sm font-bold">
                            <Download size={16} className="mr-2" />
                            Export
                        </button>
                    </div>
                </div>

                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {attendanceStats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900/60 rounded-3xl p-6 border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all cursor-pointer group backdrop-blur-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-md">Real-time</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">{stat.label}</p>
                            <div className="pt-3 border-t border-slate-50 dark:border-white/5">
                                <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                                    <span className="text-blue-600 font-bold">{stat.trend}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Attendance Table (Main Column) --- */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-white/10 overflow-hidden backdrop-blur-sm">
                            <div className="p-6 border-b border-slate-50 dark:border-white/5 flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 dark:text-white">Recent Activities</h3>
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-400"><MoreVertical size={20} /></button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-50 dark:border-white/5">
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date & Type</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Check-In</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Check-Out</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Duration</th>
                                            <th className="px-6 py-4 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                                        {attendanceData.map((record, i) => (
                                            <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-blue-900/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${record.type === 'Office' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                                            {record.type === 'Office' ? <MapPin size={18} /> : <Coffee size={18} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{record.date}</p>
                                                            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{record.type}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="flex items-center text-sm font-bold text-slate-700">
                                                            <ArrowDownLeft size={14} className="mr-1 text-green-500" />
                                                            {record.checkIn}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col items-center">
                                                        <div className="flex items-center text-sm font-bold text-slate-700">
                                                            <ArrowUpRight size={14} className="mr-1 text-blue-500" />
                                                            {record.checkOut}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-mono font-bold text-slate-600 dark:text-slate-400">{record.hours}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${record.status === 'Present'
                                                        ? 'bg-green-50 text-green-700 ring-1 ring-green-100'
                                                        : 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${record.status === 'Present' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                                                        {record.status}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 text-center border-t border-slate-50 dark:border-white/5">
                                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Load More History</button>
                            </div>
                        </div>
                    </div>

                    {/* --- Sidebar Widgets --- */}
                    <div className="space-y-6">
                        {/* Quick Action Wheel */}
                        <div className="bg-slate-900 dark:bg-slate-900/40 rounded-[2rem] p-8 text-white relative overflow-hidden group backdrop-blur-md border border-transparent dark:border-white/10">
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold mb-2">Need a Break?</h4>
                                <p className="text-slate-400 text-xs mb-6 leading-relaxed">Submit your leave requests or out-of-office logs quickly.</p>
                                <button className="w-full py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
                                    <Calendar size={18} />
                                    Request Time Off
                                </button>
                                <button className="w-full mt-3 py-3 bg-slate-800 dark:bg-slate-800/50 text-white rounded-2xl font-bold text-sm hover:bg-slate-700 dark:hover:bg-slate-700/50 transition-all border border-slate-700 dark:border-white/10">
                                    Regularize Logs
                                </button>
                            </div>
                            {/* Decorative background circle */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:bg-blue-600/40 transition-all"></div>
                        </div>

                        {/* Summary Scoreboard */}
                        <div className="bg-white dark:bg-slate-900/60 rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-white/10 p-6 backdrop-blur-sm">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center justify-between">
                                Monthly Summary
                                <span className="text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-2 py-1 rounded-md italic">Updated 1h ago</span>
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-transparent dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-green-500 rounded-full"></div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Days Present</p>
                                    </div>
                                    <span className="text-lg font-mono font-bold dark:text-white">22</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-transparent dark:border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-amber-400 rounded-full"></div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Leave / Sick</p>
                                    </div>
                                    <span className="text-lg font-mono font-bold dark:text-white">02</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-blue-600 rounded-2xl text-white">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-8 bg-white/30 rounded-full"></div>
                                        <p className="text-sm font-bold">Total Work Hours</p>
                                    </div>
                                    <span className="text-lg font-mono font-bold">176.5</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-center text-slate-400 mt-6 font-medium">You have met 98% of your monthly hour quota.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;