import {
    Clock,
    RefreshCw,
    Calendar,
    AlertCircle,
    Users,
    ArrowRight,
    MapPin,
    Laptop,
    Plus,
    CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Shift = () => {
    const shiftStats = [
        { label: 'Weekly Total', value: '40h', change: 'On Track', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Shift Swaps', value: '02', change: '+1 Today', icon: RefreshCw, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Overtime', value: '5.5h', change: 'Extra Pay', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Team Size', value: '08', change: 'Active Now', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const weeklyShifts = [
        { day: 'Mon', date: '12', time: '09:00 - 17:00', status: 'completed', type: 'Morning' },
        { day: 'Tue', date: '13', time: '09:00 - 17:00', status: 'completed', type: 'Morning' },
        { day: 'Wed', date: '14', time: '09:00 - 19:00', status: 'completed', type: 'Extended' },
        { day: 'Thu', date: '15', time: '09:00 - 17:00', status: 'active', type: 'Morning' },
        { day: 'Fri', date: '16', time: '09:00 - 18:30', status: 'upcoming', type: 'Morning' },
        { day: 'Sat', date: '17', time: 'Off', status: 'off', type: 'Weekend' },
        { day: 'Sun', date: '18', time: 'Off', status: 'off', type: 'Weekend' },
    ];

    const shiftSwapRequests = [
        { requester: 'John Doe', from: 'Fri, 9AM', to: 'Thu, 9AM', status: 'Pending', avatar: 'https://i.pravatar.cc/100?img=11' },
        { requester: 'Sarah Smith', from: 'Wed, 9AM', to: 'Tue, 9AM', status: 'Approved', avatar: 'https://i.pravatar.cc/100?img=5' },
    ];

    return (
        <div className="min-h-screen pb-12 animate-fade-in bg-[#f8fafc] dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Shift Planner</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">View your roster and manage schedule flexibility.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-2xl">
                            <Calendar size={18} className="mr-2" />
                            This Week
                        </Button>
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-lg">
                            <RefreshCw size={18} className="mr-2" />
                            New Swap Request
                        </Button>
                    </div>
                </div>

                {/* --- Stats --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {shiftStats.map((stat, i) => (
                        <Card key={i} className="p-6 hover:shadow-md transition-all cursor-pointer hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} dark:bg-opacity-20 ${stat.color} dark:text-opacity-90`}>
                                    <stat.icon size={22} />
                                </div>
                                <Badge variant="secondary" className="text-xs">{stat.change}</Badge>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                {/* --- Weekly Timeline Strip --- */}
                <Card className="p-8 mb-10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock size={20} className="text-blue-600 dark:text-blue-400" />
                            Weekly Timeline
                        </h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Active</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {weeklyShifts.map((shift, i) => (
                            <div key={i} className={`relative p-5 rounded-[2rem] border transition-all cursor-pointer ${shift.status === 'active'
                                ? 'bg-blue-600 dark:bg-blue-600 border-blue-600 dark:border-blue-500 text-white shadow-xl shadow-blue-100 dark:shadow-blue-900/40 scale-105 z-10'
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/50'
                                }`}>
                                <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${shift.status === 'active' ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {shift.day}
                                </p>
                                <p className={`text-2xl font-black mb-4 ${shift.status === 'active' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                    {shift.date}
                                </p>

                                <div className="space-y-1">
                                    <p className={`text-[10px] font-bold ${shift.status === 'active' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {shift.time === 'Off' ? 'Enjoy your day!' : shift.time}
                                    </p>
                                    <p className={`text-[10px] font-black uppercase ${shift.status === 'active' ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>
                                        {shift.type}
                                    </p>
                                </div>
                                {shift.status === 'completed' && (
                                    <CheckCircle size={14} className="absolute top-4 right-4 text-emerald-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Shift Swaps --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <RefreshCw size={20} className="text-emerald-600" />
                                    Swap Requests
                                </h3>
                                <Button variant="link" className="text-blue-600">View All Requests</Button>
                            </div>

                            <div className="space-y-4">
                                {shiftSwapRequests.map((request, i) => (
                                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all group">
                                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                                            <img src={request.avatar} className="w-12 h-12 rounded-2xl shadow-sm" alt="avatar" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{request.requester}</h4>
                                                <Badge variant={request.status === 'Approved' ? 'default' : 'secondary'} className="text-xs">
                                                    {request.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-white dark:bg-slate-900/50 px-6 py-3 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                                            <div className="text-center">
                                                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Current</p>
                                                <p className="text-xs font-black text-slate-700 dark:text-slate-300">{request.from}</p>
                                            </div>
                                            <ArrowRight size={16} className="text-slate-300 dark:text-slate-600" />
                                            <div className="text-center">
                                                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Proposed</p>
                                                <p className="text-xs font-black text-blue-600 dark:text-blue-400">{request.to}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4 md:mt-0">
                                            <Button variant="ghost" size="sm">Details</Button>
                                            {request.status === 'Pending' && (
                                                <Button size="sm" className="bg-slate-900 hover:bg-slate-800">Respond</Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* --- Sidebar: Upcoming --- */}
                    <div className="space-y-6">
                        <Card className="p-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Plus size={20} className="text-indigo-600 dark:text-indigo-400" />
                                Next Shifts
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { date: 'Mon, 19 Jun', type: 'Morning', loc: 'Office', icon: <MapPin size={14} /> },
                                    { date: 'Tue, 20 Jun', type: 'Morning', loc: 'Remote', icon: <Laptop size={14} /> },
                                    { date: 'Wed, 21 Jun', type: 'Afternoon', loc: 'Office', icon: <MapPin size={14} /> },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all cursor-default group hover:bg-slate-100 dark:hover:bg-slate-800/60">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm group-hover:scale-110 transition-transform">
                                            <Calendar size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{s.date}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{s.type}</span>
                                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">
                                                    {s.icon} {s.loc}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button className="w-full mt-6 bg-slate-900 hover:bg-slate-800">
                                Full Schedule
                            </Button>
                        </Card>

                        {/* Team Availability */}
                        <Card className="bg-indigo-600 p-8 text-white border-0">
                            <div className="relative z-10">
                                <Users className="mb-4 text-indigo-200" size={24} />
                                <h4 className="text-lg font-bold mb-1">Team on Shift</h4>
                                <p className="text-indigo-100 text-xs mb-6">4 members are currently working.</p>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <img key={i} src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-8 h-8 rounded-full border-2 border-indigo-600" alt="team" />
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                        +4
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Shift;