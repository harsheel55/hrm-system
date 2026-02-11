import {
    DollarSign,
    FileText,
    Send,
    Calendar,
    CheckCircle,
    AlertCircle,
    Users,
    Download,
    TrendingUp,
    ArrowUpRight,
    ShieldCheck
} from 'lucide-react';

const Payroll = () => {
    const payrollStats = [
        { label: 'Total Payroll', value: '$142,500', change: '+5.2%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Staff', value: '128', change: '+3', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Task', value: '02', change: '-1', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Tax Deductions', value: '$12,400', change: '+2.1%', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const upcomingPayroll = [
        { type: 'Monthly Salary', dueDate: 'Feb 28, 2026', amount: '$145,000', status: 'In Review' },
        { type: 'Quarterly Bonus', dueDate: 'Feb 15, 2026', amount: '$12,500', status: 'Pending' },
    ];

    const payrollHistory = [
        { month: 'January 2026', amount: '$142,500.00', status: 'Completed', processedDate: 'Jan 31', employees: 128 },
        { month: 'December 2025', amount: '$138,200.00', status: 'Completed', processedDate: 'Dec 31', employees: 125 },
        { month: 'November 2025', amount: '$135,800.00', status: 'Completed', processedDate: 'Nov 30', employees: 124 },
    ];

    return (
        <div className="min-h-screen bg-[#fcfcfd] dark:bg-slate-950 pb-12 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Financial Suite</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Payroll Management</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Review, process, and track organization compensation.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold transition-all shadow-sm">
                            <Calendar size={18} className="mr-2 text-slate-400" />
                            Feb 2026
                        </button>
                        <button className="flex items-center px-6 py-2.5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20 text-sm font-bold group">
                            <Send size={18} className="mr-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Run Payroll
                        </button>
                    </div>
                </div>

                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {payrollStats.map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group hover:border-emerald-200 dark:hover:border-emerald-900 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                <div className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
                                    <TrendingUp size={12} className="mr-1" />
                                    {stat.change}
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-400 mb-1">{stat.label}</p>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Left Column: History --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payroll History</h3>
                                    <p className="text-xs font-medium text-slate-400">Previous 3 billing cycles</p>
                                </div>
                                <button className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</button>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50/50 dark:bg-slate-900/50">
                                        <tr className="text-left">
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase">Billing Month</th>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase text-center">Staff</th>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase">Amount</th>
                                            <th className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                                        {payrollHistory.map((payroll, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                                                <td className="px-4 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-white dark:group-hover:bg-slate-600 group-hover:shadow-sm transition-all">
                                                            <FileText size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{payroll.month}</p>
                                                            <p className="text-[11px] font-medium text-slate-400">Sent on {payroll.processedDate}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 text-center">
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">{payroll.employees}</span>
                                                </td>
                                                <td className="px-4 py-5">
                                                    <p className="text-sm font-mono font-bold text-slate-900 dark:text-white">{payroll.amount}</p>
                                                    <div className="flex items-center text-[10px] text-emerald-600 font-bold uppercase">
                                                        <CheckCircle size={10} className="mr-1" /> Processed
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 text-right">
                                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all">
                                                        <Download size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Summary Widget */}
                        <div className="bg-slate-900 dark:bg-slate-800 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-2">Yearly Expenditure</h4>
                                <p className="text-slate-400 text-sm">You have processed <span className="text-white font-bold">$1.71M</span> in total compensation this year.</p>
                            </div>
                            <div className="flex gap-4 relative z-10">
                                <div className="text-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Months</p>
                                    <p className="text-xl font-mono font-bold">12</p>
                                </div>
                                <div className="text-center px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Avg/Mo</p>
                                    <p className="text-xl font-mono font-bold">$13.4K</p>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        </div>
                    </div>

                    {/* --- Right Column: Upcoming --- */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Pipeline</h3>
                            <div className="space-y-4">
                                {upcomingPayroll.map((item, i) => (
                                    <div key={i} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 transition-all cursor-default group">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${item.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-200' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                                                }`}>
                                                {item.status}
                                            </span>
                                            <ArrowUpRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.type}</h4>
                                        <p className="text-xs text-slate-400 font-medium mb-4">Due: {item.dueDate}</p>
                                        <p className="text-xl font-mono font-bold text-slate-900 dark:text-white">{item.amount}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl text-sm font-bold text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all">
                                + Add One-time Payment
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Quick Access</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all">Staff Profiles</button>
                                <button className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all">Tax Reports</button>
                                <button className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all">Bank Settings</button>
                                <button className="p-4 bg-slate-50 dark:bg-slate-700 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all">Compliance</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Payroll;