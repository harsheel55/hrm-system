import {
    Clock,
    LogOut,
    MoreHorizontal,
    Sun,
    Briefcase
} from 'lucide-react';

const DashboardHome = () => {
    return (
        <div className="pb-12">
            {/* --- Banner Section --- */}
            <div className="h-48 w-full bg-gradient-to-r from-slate-800 to-slate-700 relative overflow-hidden">
                {/* Abstract Pattern Layer */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* --- Left Column (Profile & Org) --- */}
                    <div className="w-full lg:w-80 flex flex-col gap-6">

                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col items-center p-6 text-center">
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-full p-1 bg-white shadow-md">
                                    <img
                                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
                                    <span className="sr-only">Online</span>
                                </div>
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Jane Cooper</h2>
                            <p className="text-sm text-slate-500 mb-4">Regional Manager</p>

                            <div className="w-full bg-green-50 text-green-700 py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wide mb-6">
                                Remote In
                            </div>

                            <div className="mb-6">
                                <span className="text-3xl font-mono font-bold text-slate-800">06:46:13</span>
                                <p className="text-xs text-slate-400 mt-1">Hrs Worked</p>
                            </div>

                            <button className="w-full py-2.5 px-4 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors border border-red-100 flex items-center justify-center gap-2">
                                <LogOut size={18} />
                                Check-out
                            </button>
                        </div>

                        {/* Reporting To */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Reporting To</p>
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                                    alt="Manager"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Tom Cook</p>
                                    <p className="text-xs text-red-500 font-medium">Yet to check-in</p>
                                </div>
                            </div>
                        </div>

                        {/* Reportees */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reportees</p>
                                <span className="text-xs text-blue-600 font-semibold">4 Total</span>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { name: 'Wade Warren', status: 'Remote In', color: 'green', img: '1500648767791-00dcc994a43e' },
                                    { name: 'Esther Howard', status: 'On Duty', color: 'blue', img: '1520813792240-56fc4a37b1a9' },
                                    { name: 'Cameron Williamson', status: 'Yet to check-in', color: 'red', img: '1570295999919-56ceb5ecca61' },
                                ].map((person, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <img
                                            src={`https://images.unsplash.com/photo-${person.img}?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80`}
                                            alt={person.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{person.name}</p>
                                            <p className={`text-xs font-medium ${person.color === 'green' ? 'text-green-600' : person.color === 'blue' ? 'text-blue-600' : 'text-red-500'}`}>
                                                {person.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-4 text-xs font-bold text-blue-600 hover:text-blue-700 text-left">
                                + 5 More
                            </button>
                        </div>

                    </div>

                    {/* --- Right Column (Main Content) --- */}
                    <div className="flex-1 flex flex-col gap-6">

                        {/* Tabs Navigation */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 flex items-center gap-1 overflow-x-auto">
                            {['Activities', 'Feeds', 'Career History', 'Profile', 'Approvals', 'Attendance', 'Leave'].map((tab, i) => (
                                <button
                                    key={tab}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${i === 0 ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Alerts / Reminders */}
                        <div className="space-y-3">
                            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex items-start gap-4">
                                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl mt-1">
                                    <Clock size={20} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900">Check-out reminder</h4>
                                    <p className="text-sm text-slate-500">Your shift ended 15 mins ago.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 mb-1">Total Hours</p>
                                    <p className="text-sm font-bold text-slate-900">08:45 Hrs</p>
                                </div>
                            </div>
                        </div>

                        {/* Work Schedule (Timeline) */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                        <Briefcase size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-slate-900">Work Schedule</h3>
                                        <p className="text-xs text-slate-500">26 May 2024 - 01 Jun 2024</p>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal /></button>
                            </div>

                            {/* Timeline Visual */}
                            <div className="relative pt-8 pb-4 overflow-x-auto">
                                <div className="flex justify-between min-w-[600px] relative z-10">
                                    {['Sun 26', 'Mon 27', 'Tue 28', 'Wed 29', 'Thu 30', 'Fri 31', 'Sat 01'].map((date, i) => (
                                        <div key={i} className="text-center w-24 flex-shrink-0 relative group cursor-pointer">

                                            {/* Line Node */}
                                            <div className="absolute top-[-33px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-slate-200 bg-white group-hover:border-blue-500 transition-colors z-10"></div>

                                            {/* Active Pill */}
                                            {i === 1 && (
                                                <div className="absolute top-[-45px] left-1/2 -translate-x-1/2">
                                                    <div className="bg-blue-600 text-white text-[10px] py-1 px-2 rounded-lg font-bold shadow-lg shadow-blue-200 whitespace-nowrap">
                                                        09:00 - 18:00
                                                    </div>
                                                    <div className="w-0.5 h-3 bg-blue-600 mx-auto"></div>
                                                </div>
                                            )}

                                            <p className="text-sm font-bold text-slate-700">{date}</p>
                                            <p className={`text-xs mt-1 ${i === 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                                                {i === 0 ? 'Weekend' : '09:00 - 18:00'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {/* Connecting Line */}
                                <div className="absolute top-[3px] left-10 right-10 h-0.5 bg-slate-100 z-0"></div>
                            </div>
                        </div>

                        {/* Upcoming Holidays */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Sun size={20} />
                                </div>
                                <h3 className="text-base font-bold text-slate-900">Upcoming Holidays</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl border-l-4 border-l-blue-500">
                                    <p className="text-sm font-bold text-slate-900">Native American Day</p>
                                    <p className="text-xs text-slate-500 mt-1">2 Jun, Sunday</p>
                                </div>
                                <div className="p-4 border border-yellow-100 bg-yellow-50/50 rounded-xl border-l-4 border-l-yellow-500">
                                    <p className="text-sm font-bold text-slate-900">Bakrid</p>
                                    <p className="text-xs text-slate-500 mt-1">17 Jun, Monday</p>
                                </div>
                                <div className="flex items-center justify-center text-sm font-bold text-blue-600 cursor-pointer hover:underline">
                                    View all holidays
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
