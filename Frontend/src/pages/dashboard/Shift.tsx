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
        <div className="min-h-screen bg-[#f8fafc] pb-12">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                
                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Shift Planner</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">View your roster and manage schedule flexibility.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-700 text-sm font-bold transition-all">
                            <Calendar size={18} className="mr-2 text-slate-400" />
                            This Week
                        </button>
                        <button className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-sm font-bold">
                            <RefreshCw size={18} className="mr-2" />
                            New Swap Request
                        </button>
                    </div>
                </div>

                {/* --- Stats --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {shiftStats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md uppercase tracking-wider">{stat.change}</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* --- Weekly Timeline Strip --- */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 mb-10 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={20} className="text-blue-600" />
                            Weekly Timeline
                        </h3>
                        <div className="flex gap-2">
                             <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed</span>
                                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Active</span>
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {weeklyShifts.map((shift, i) => (
                            <div key={i} className={`relative p-5 rounded-[2rem] border transition-all cursor-pointer ${
                                shift.status === 'active' 
                                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-105 z-10' 
                                : 'bg-slate-50 border-slate-100 hover:border-blue-200'
                            }`}>
                                <p className={`text-[11px] font-black uppercase tracking-widest mb-1 ${shift.status === 'active' ? 'text-blue-100' : 'text-slate-400'}`}>
                                    {shift.day}
                                </p>
                                <p className={`text-2xl font-black mb-4 ${shift.status === 'active' ? 'text-white' : 'text-slate-900'}`}>
                                    {shift.date}
                                </p>
                                
                                <div className="space-y-1">
                                    <p className={`text-[10px] font-bold ${shift.status === 'active' ? 'text-blue-100' : 'text-slate-500'}`}>
                                        {shift.time === 'Off' ? 'Enjoy your day!' : shift.time}
                                    </p>
                                    <p className={`text-[10px] font-black uppercase ${shift.status === 'active' ? 'text-white' : 'text-blue-600'}`}>
                                        {shift.type}
                                    </p>
                                </div>
                                {shift.status === 'completed' && (
                                    <CheckCircle size={14} className="absolute top-4 right-4 text-emerald-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- Shift Swaps --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <RefreshCw size={20} className="text-emerald-600" />
                                    Swap Requests
                                </h3>
                                <button className="text-sm font-bold text-blue-600 hover:underline">View All Requests</button>
                            </div>

                            <div className="space-y-4">
                                {shiftSwapRequests.map((request, i) => (
                                    <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group">
                                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                                            <img src={request.avatar} className="w-12 h-12 rounded-2xl shadow-sm" alt="avatar" />
                                            <div>
                                                <h4 className="font-bold text-slate-900">{request.requester}</h4>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${request.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {request.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
                                            <div className="text-center">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Current</p>
                                                <p className="text-xs font-black text-slate-700">{request.from}</p>
                                            </div>
                                            <ArrowRight size={16} className="text-slate-300" />
                                            <div className="text-center">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">Proposed</p>
                                                <p className="text-xs font-black text-blue-600">{request.to}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4 md:mt-0">
                                            <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">Details</button>
                                            {request.status === 'Pending' && (
                                                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Respond</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- Sidebar: Upcoming --- */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <Plus size={20} className="text-indigo-600" />
                                Next Shifts
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { date: 'Mon, 19 Jun', type: 'Morning', loc: 'Office', icon: <MapPin size={14}/> },
                                    { date: 'Tue, 20 Jun', type: 'Morning', loc: 'Remote', icon: <Laptop size={14}/> },
                                    { date: 'Wed, 21 Jun', type: 'Afternoon', loc: 'Office', icon: <MapPin size={14}/> },
                                ].map((s, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-default">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                                            <Calendar size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">{s.date}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{s.type}</span>
                                                <span className="text-slate-300">•</span>
                                                <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase">
                                                    {s.icon} {s.loc}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all">
                                Full Schedule
                            </button>
                        </div>

                        {/* Team Availability */}
                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <Users className="mb-4 text-indigo-200" size={24} />
                                <h4 className="text-lg font-bold mb-1">Team on Shift</h4>
                                <p className="text-indigo-100 text-xs mb-6">4 members are currently working.</p>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-8 h-8 rounded-full border-2 border-indigo-600" alt="team" />
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                        +4
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Shift;