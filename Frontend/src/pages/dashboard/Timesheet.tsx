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
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-12 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Time Tracking</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Log your project hours and submit for manager approval.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-all">
                            <Calendar size={18} className="mr-2 text-slate-400" />
                            Jun 12 - Jun 18
                        </button>
                        <button className="flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 text-sm font-bold">
                            <Save size={18} className="mr-2" />
                            Save & Submit
                        </button>
                    </div>
                </div>

                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {timesheetStats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">{stat.change}</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Main Timesheet Table --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Clock4 size={20} className="text-indigo-600" />
                                    Weekly Log
                                </h3>
                                <div className="flex gap-2">
                                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Download size={20} /></button>
                                    <button className="flex items-center gap-1 px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 transition-all">
                                        <Plus size={14} /> Add Task
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-center border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">
                                            <th className="px-6 py-4 text-left font-black">Project / Task</th>
                                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => (
                                                <th key={day} className="px-2 py-4">{day}</th>
                                            ))}
                                            <th className="px-4 py-4">Total</th>
                                            <th className="px-6 py-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                        {timesheetData.map((project, i) => (
                                            <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors group">
                                                <td className="px-6 py-5 text-left">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{project.project}</p>
                                                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase">Development</p>
                                                </td>
                                                {[project.mon, project.tue, project.wed, project.thu, project.fri, project.sat, project.sun].map((hr, idx) => (
                                                    <td key={idx} className={`px-2 py-5 font-mono text-sm ${hr === 0 ? 'text-slate-200 dark:text-slate-700' : 'text-slate-600 dark:text-slate-300 font-bold'}`}>
                                                        {hr}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-5 font-mono font-black text-slate-900 dark:text-white bg-slate-50/30 dark:bg-slate-700/30">
                                                    {project.total}
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${project.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' :
                                                            project.status === 'Submitted' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-700'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'Approved' ? 'bg-emerald-500' :
                                                                project.status === 'Submitted' ? 'bg-blue-500' : 'bg-amber-500'
                                                            }`}></span>
                                                        {project.status}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Submission Warning */}
                        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-[2rem] border border-amber-100 dark:border-amber-900/30 p-6 flex gap-4 items-start">
                            <div className="p-2 bg-white dark:bg-amber-900/20 rounded-xl shadow-sm text-amber-600">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100">Review Required</h4>
                                <p className="text-xs text-amber-700 dark:text-amber-200/80 mt-1 leading-relaxed">
                                    Double-check your billable hours for <strong>Frontend Development</strong>.
                                    Once submitted, hours are locked for payroll processing and cannot be edited without manager reversal.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* --- Sidebar: Daily Breakdown --- */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                                <BarChart3 size={20} className="text-indigo-600" />
                                Daily Output
                            </h3>

                            <div className="flex items-end justify-between gap-2 h-32 mb-8 px-2">
                                {weeklySummary.map((day, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 w-full group">
                                        <div
                                            className={`w-full rounded-t-lg transition-all duration-500 ${day.percentage > 0 ? 'bg-indigo-500 group-hover:bg-indigo-600' : 'bg-slate-100 dark:bg-slate-700'}`}
                                            style={{ height: `${day.percentage}%` }}
                                        ></div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{day.day}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Avg. Productive Time</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">8.4h</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Project Overlap</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">03 Tasks</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Action Widget */}
                        <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-2">Need Help?</h4>
                                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                                    If your project is not listed, please contact the Resource Manager to be assigned.
                                </p>
                                <button className="w-full py-3 bg-white text-slate-900 rounded-2xl text-xs font-bold hover:bg-indigo-50 transition-all">
                                    Contact Resource Team
                                </button>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Timesheet;