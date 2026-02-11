import { useState } from 'react';
import {
    Users,
    Calendar,
    FileText,
    Clock,
    Award,
    ChevronRight,
    Mail,
    Phone,
    MapPin,
    Building,
    Edit3,
    X,
    Camera,
    Palette,
    User,
    CheckCircle,
    AlertCircle,
    Save,
    Search,
    Bell,
    LogOut,
    UserCheck,
    MoreHorizontal,
    Moon,
    Sun,
    MessageSquare,
    ThumbsUp,
    DollarSign,
    Target,
    PieChart
} from 'lucide-react';

const DashboardHome = () => {
    const [activeTab, setActiveTab] = useState('Activities');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileData, setProfileData] = useState({
        fullName: 'Jane Cooper',
        email: 'jane.cooper@company.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, USA',
        office: 'Headquarters - Floor 12',
        department: 'Sales & Marketing',
        designation: 'Regional Manager',
        employeeId: 'EMP-2024-0156',
        dateOfBirth: '',
        bio: '',
        profileImage: '',
        backgroundImage: '',
        preferences: {
            theme: 'light',
            language: 'English',
            timezone: 'EST',
            notifications: true
        }
    });

    const tabs = ['Activities', 'Feeds', 'Career History', 'Profile', 'Approvals', 'Attendance', 'Leave', 'Time Logs', 'Feedback', 'Cases', 'Related Data'];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Activities':
                return <ActivitiesContent />;
            case 'Feeds':
                return <FeedsContent />;
            case 'Career History':
                return <CareerHistoryContent />;
            case 'Profile':
                return <ProfileContent />;
            case 'Approvals':
                return <ApprovalsContent />;
            case 'Attendance':
                return <AttendanceContent />;
            case 'Leave':
                return <LeaveContent />;
            case 'Time Logs':
                return <TimeLogsContent />;
            case 'Feedback':
                return <FeedbackContent />;
            case 'Cases':
                return <CasesContent />;
            case 'Related Data':
                return <RelatedDataContent />;
            default:
                return <ActivitiesContent />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-12 overflow-x-hidden">
            {/* --- Banner Section --- */}
            <div className="h-60 w-full bg-[#0f172a] relative overflow-hidden">
                {/* Modern Mesh Gradient Effect */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[120%] bg-blue-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-20%] right-[10%] w-[30%] h-[100%] bg-indigo-500/20 blur-[100px] rounded-full"></div>

                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* --- Left Column (Profile & Org) --- */}
                    <div className="w-full lg:w-80 flex flex-col gap-6">

                        {/* Profile Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="relative mb-4 group cursor-pointer">
                                    <div className="w-28 h-28 rounded-full p-1.5 bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-lg">
                                        <img
                                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover border-4 border-white"
                                        />
                                    </div>
                                    <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Jane Cooper</h2>
                                <p className="text-sm font-medium text-slate-500 mb-4 flex items-center gap-1">
                                    <MapPin size={14} className="text-slate-400" /> Regional Manager
                                </p>

                                <div className="flex items-center gap-2 bg-green-50 text-green-700 py-1 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider mb-6 ring-1 ring-green-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                    Remote In
                                </div>

                                <div className="grid grid-cols-2 w-full gap-4 mb-6 pt-6 border-t border-slate-50">
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Hrs Worked</p>
                                        <p className="text-lg font-mono font-bold text-slate-800">06:46:13</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Break Time</p>
                                        <p className="text-lg font-mono font-bold text-slate-800">00:45:00</p>
                                    </div>
                                </div>

                                <button className="w-full py-3 px-4 bg-slate-900 text-white font-semibold rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                                    <LogOut size={18} />
                                    Check-out
                                </button>
                            </div>
                        </div>

                        {/* Organization Section */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-6">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 flex items-center gap-2">
                                        <UserCheck size={14} /> Reporting To
                                    </h4>
                                    <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                                        <img
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                                            alt="Manager"
                                            className="w-10 h-10 rounded-full object-cover shadow-sm"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">Tom Cook</p>
                                            <p className="text-[11px] text-red-500 font-semibold italic">Yet to check-in</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] flex items-center gap-2">
                                            <Users size={14} /> Reportees
                                        </h4>
                                        <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">04</span>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Wade Warren', status: 'Remote In', color: 'green', img: '1500648767791-00dcc994a43e' },
                                            { name: 'Esther Howard', status: 'On Duty', color: 'blue', img: '1520813792240-56fc4a37b1a9' },
                                            { name: 'Cameron Williamson', status: 'Offline', color: 'slate', img: '1570295999919-56ceb5ecca61' },
                                        ].map((person, i) => (
                                            <div key={i} className="flex items-center group cursor-pointer">
                                                <img
                                                    src={`https://images.unsplash.com/photo-${person.img}?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80`}
                                                    alt={person.name}
                                                    className="w-9 h-9 rounded-full object-cover mr-3 grayscale-[0.3] group-hover:grayscale-0 transition-all"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">{person.name}</p>
                                                    <p className={`text-[10px] font-bold ${person.color === 'green' ? 'text-green-600' : person.color === 'blue' ? 'text-blue-600' : 'text-slate-400'}`}>
                                                        {person.status}
                                                    </p>
                                                </div>
                                                <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-500" />
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-5 py-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors border-t border-slate-50 dark:border-slate-700">
                                        View Full Hierarchy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Column (Main Content) --- */}
                    <div className="flex-1 flex flex-col gap-6">

                        {/* Tabs Navigation */}
                        <div className="bg-white dark:bg-slate-800 sticky top-4 z-20 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700 px-4 py-3 flex flex-wrap items-center gap-1 overflow-x-auto no-scrollbar">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === tab
                                        ? 'text-blue-600'
                                        : 'text-slate-600 hover:text-slate-900'}`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 rounded-t-full"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Notifications */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-700 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                                        <span className="text-white font-extrabold text-xs tracking-wide">YLKER</span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">Good Evening&nbsp;&nbsp;Christine Spalding</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">Have a productive day!</p>
                                    </div>
                                </div>
                                <Moon size={28} className="text-slate-400" />
                            </div>
                            <blockquote className="mt-4 pl-4 border-l-4 border-slate-200 italic text-slate-600 text-sm">
                                “Don't let what you cannot do interfere with what you can do.” - Margaret Thatcher
                            </blockquote>
                        </div>

                        {/* Tab Content */}
                        {renderTabContent()}

                        {activeTab === 'Activities' && (
                            <>
                                {/* Work Schedule */}
                                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                                                <Calendar size={22} />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Weekly Schedule</h3>
                                                <p className="text-xs font-medium text-slate-400">May 26 - June 01, 2024</p>
                                            </div>
                                        </div>
                                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
                                            <MoreHorizontal />
                                        </button>
                                    </div>

                                    {/* Refined Timeline Visual */}
                                    <div className="relative flex justify-between">
                                        {['Sun 26', 'Mon 27', 'Tue 28', 'Wed 29', 'Thu 30', 'Fri 31', 'Sat 01'].map((date, i) => (
                                            <div key={i} className="flex flex-col items-center flex-1 group">
                                                <div className="mb-4 text-[10px] font-bold uppercase tracking-tighter text-slate-400 group-hover:text-slate-600 transition-colors">
                                                    {date.split(' ')[0]}
                                                </div>

                                                <div className="relative flex flex-col items-center w-full">
                                                    {/* Vertical Line Background */}
                                                    <div className="absolute top-0 bottom-0 w-px bg-slate-100 left-1/2 -translate-x-1/2 z-0"></div>

                                                    {/* Node */}
                                                    <div className={`w-3.5 h-3.5 rounded-full border-[3px] z-10 transition-all duration-300 ${i === 1
                                                        ? 'bg-blue-600 border-blue-100 scale-125'
                                                        : i === 0 || i === 6
                                                            ? 'bg-slate-200 dark:bg-slate-700 border-white dark:border-slate-800'
                                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 group-hover:border-blue-400'
                                                        }`}></div>

                                                    {/* Time Capsule */}
                                                    <div className="mt-4 text-center">
                                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{date.split(' ')[1]}</p>
                                                        <div className={`mt-2 px-2 py-1 rounded-lg text-[9px] font-bold transition-all ${i === 1
                                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                                            : i === 0 || i === 6
                                                                ? 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                                            }`}>
                                                            {i === 0 || i === 6 ? 'OFF' : '09:00 - 18:00'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Upcoming Holidays */}
                                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                                            <Sun size={22} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upcoming Holidays</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {[
                                            { title: 'Native American Day', date: '2 Jun, Sunday', color: 'blue' },
                                            { title: 'Bakrid / Eid al-Adha', date: '17 Jun, Monday', color: 'amber' },
                                        ].map((holiday, i) => (
                                            <div key={i} className="p-5 border border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 rounded-2xl hover:border-blue-200 transition-all cursor-default group">
                                                <div className={`w-8 h-1 rounded-full mb-3 ${holiday.color === 'blue' ? 'bg-blue-400' : 'bg-amber-400'}`}></div>
                                                <p className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{holiday.title}</p>
                                                <p className="text-[11px] font-medium text-slate-500 mt-1">{holiday.date}</p>
                                            </div>
                                        ))}
                                        <div className="flex items-center justify-center p-5 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-bold text-blue-600 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 transition-all">
                                            View Holiday Calendar
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    function ActivitiesContent() {
        const activityFeed = [
            {
                type: 'timesheet',
                title: 'ZY198 - Christine Spalding',
                desc: 'has made a request for Timesheet',
                metaLabel: 'Raised on',
                metaValue: '23-May-2024 04:14 PM',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=96&h=96&q=80'
            },
            {
                type: 'reminder',
                title: 'Check-out reminder',
                desc: 'Your shift has already ended',
                metaLabel: 'Total Hours',
                metaValue: '06:45 Hrs'
            },
            {
                type: 'reminder',
                title: 'Check-out reminder',
                desc: 'Your shift has already ended',
                metaLabel: 'Total Hours',
                metaValue: '05:35 Hrs'
            }
        ];

        return (
            <div className="space-y-6">
                <div className="space-y-4">
                    {activityFeed.map((item, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm p-5">
                            <div className="flex items-center gap-4">
                                {item.type === 'timesheet' ? (
                                    <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                                        <img src={item.avatar} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                                        <Clock size={20} className="text-red-500" />
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.title}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {item.type === 'timesheet' ? (
                                            <>
                                                has made a request for <span className="font-semibold">Timesheet</span>
                                            </>
                                        ) : (
                                            item.desc
                                        )}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{item.metaLabel}</p>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.metaValue}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    function FeedsContent() {
        const feeds = [
            {
                type: 'announcement',
                title: 'New HR Policy Update',
                desc: 'Updated remote work policy effective next month',
                time: '2 hours ago',
                author: 'HR Team',
                likes: 24,
                relatedTab: 'Profile',
                action: 'Update work preferences'
            },
            {
                type: 'achievement',
                title: 'Team Milestone Achieved!',
                desc: 'Sales team exceeded Q2 targets by 15%',
                time: '5 hours ago',
                author: 'Sarah Chen',
                likes: 45,
                relatedTab: 'Activities',
                action: 'View team performance'
            },
            {
                type: 'reminder',
                title: 'Performance Reviews Due',
                desc: 'Complete self-assessment by Friday',
                time: '1 day ago',
                author: 'Management',
                likes: 12,
                relatedTab: 'Career History',
                action: 'Update achievements'
            },
            {
                type: 'celebration',
                title: 'Welcome New Team Members!',
                desc: '5 new developers joined this week',
                time: '2 days ago',
                author: 'IT Department',
                likes: 67,
                relatedTab: 'Activities',
                action: 'View team structure'
            },
            {
                type: 'leave',
                title: 'Leave Policy Update',
                desc: 'Additional leave days approved for next quarter',
                time: '3 days ago',
                author: 'HR Team',
                likes: 31,
                relatedTab: 'Leave',
                action: 'Check leave balance'
            },
        ];

        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Company Feeds</h3>
                        <div className="flex items-center gap-3">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Post Update</button>
                            <button
                                className="text-sm text-slate-600 hover:text-slate-700 font-medium"
                                onClick={() => setActiveTab('Activities')}
                            >
                                View Activity Feed →
                            </button>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {feeds.map((feed, i) => (
                            <div key={i} className="border-b border-slate-100 dark:border-slate-700 last:border-0 pb-6 last:pb-0">
                                <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-xl ${feed.type === 'announcement' ? 'bg-blue-50 text-blue-600' : feed.type === 'achievement' ? 'bg-green-50 text-green-600' : feed.type === 'reminder' ? 'bg-amber-50 text-amber-600' : feed.type === 'celebration' ? 'bg-purple-50 text-purple-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                        <MessageSquare size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-slate-900 dark:text-white">{feed.title}</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{feed.desc}</p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <span className="text-xs text-slate-400">{feed.author} • {feed.time}</span>
                                            <button className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600">
                                                <ThumbsUp size={12} />
                                                {feed.likes}
                                            </button>
                                            {feed.relatedTab && (
                                                <button
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                    onClick={() => setActiveTab(feed.relatedTab)}
                                                >
                                                    {feed.action} →
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Connected Activity Summary */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">Related to Your Activities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                    <CheckCircle size={16} />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">Recent Check-ins</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">5 consecutive days</p>
                            <button
                                className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium"
                                onClick={() => setActiveTab('Attendance')}
                            >
                                View Details →
                            </button>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                    <Calendar size={16} />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">Leave Status</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">1 request pending</p>
                            <button
                                className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium"
                                onClick={() => setActiveTab('Leave')}
                            >
                                Check Status →
                            </button>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                                    <Award size={16} />
                                </div>
                                <span className="text-sm font-semibold text-slate-900 dark:text-white">Achievements</span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">2 new this month</p>
                            <button
                                className="text-xs text-blue-600 hover:text-blue-700 mt-2 font-medium"
                                onClick={() => setActiveTab('Career History')}
                            >
                                View Career →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function CareerHistoryContent() {
        const careerHistory = [
            { title: 'Regional Manager', department: 'Sales', period: '2022 - Present', location: 'New York', achievements: ['Led team of 15', 'Increased sales by 30%', 'Expanded to 3 new territories'] },
            { title: 'Senior Sales Executive', department: 'Sales', period: '2019 - 2022', location: 'Boston', achievements: ['Top performer 2021', 'Managed key accounts', 'Mentored 5 junior executives'] },
            { title: 'Sales Executive', department: 'Sales', period: '2017 - 2019', location: 'Boston', achievements: ['Exceeded targets consistently', 'Received Rising Star award'] },
            { title: 'Sales Associate', department: 'Sales', period: '2015 - 2017', location: 'Chicago', achievements: ['Completed sales training', 'Built client portfolio'] },
        ];

        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Career Progression</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Download Resume</button>
                    </div>
                    <div className="space-y-6">
                        {careerHistory.map((role, i) => (
                            <div key={i} className="relative pl-8 pb-6 border-l-2 border-slate-200 dark:border-slate-700 last:border-0">
                                <div className="absolute left-0 top-0 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-slate-800 -translate-x-1/2"></div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{role.title}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{role.department} • {role.location}</p>
                                        </div>
                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">{role.period}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {role.achievements.map((achievement, j) => (
                                            <div key={j} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <Award size={14} className="text-amber-500" />
                                                {achievement}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    function ProfileContent() {
        const profileStats = [
            { label: 'Years at Company', value: '9', icon: Award, color: 'amber', relatedTab: 'Career History' },
            { label: 'Pending Approvals', value: '3', icon: FileText, color: 'red', relatedTab: 'Approvals' },
            { label: 'Team Size', value: '15', icon: Users, color: 'blue', relatedTab: 'Activities' },
            { label: 'Attendance Rate', value: '92%', icon: CheckCircle, color: 'green', relatedTab: 'Attendance' },
        ];


        return (
            <div className="space-y-6">
                {/* Profile Stats with Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {profileStats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => setActiveTab(stat.relatedTab)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-xl ${stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : stat.color === 'red' ? 'bg-red-50 text-red-600' : stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                    <stat.icon size={20} />
                                </div>
                                <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <p className="text-xs text-blue-600 mt-2 font-medium">View Details →</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h3>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowProfileModal(true)}
                                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                <Edit3 size={16} />
                                Edit Profile
                            </button>
                            <button
                                className="text-sm text-slate-600 hover:text-slate-700 font-medium"
                                onClick={() => setActiveTab('Career History')}
                            >
                                View Career →
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">Jane Cooper</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee ID</label>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">EMP-2024-0156</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</label>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">Sales & Marketing</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Designation</label>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">Regional Manager</p>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Mail size={14} /> Email
                                </label>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">jane.cooper@company.com</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Phone size={14} /> Phone
                                </label>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">+1 (555) 123-4567</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <MapPin size={14} /> Location
                                </label>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">New York, USA</p>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Building size={14} /> Office
                                </label>
                                <p className="mt-1 font-semibold text-slate-900 dark:text-white">Headquarters - Floor 12</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Actions */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/40 dark:to-purple-900/40 rounded-3xl p-6 border border-blue-100 dark:border-blue-900">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            className="bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors border border-slate-200"
                            onClick={() => setActiveTab('Career History')}
                        >
                            Update Profile
                        </button>
                        <button
                            className="bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors border border-slate-200"
                            onClick={() => setActiveTab('Approvals')}
                        >
                            Check Approvals
                        </button>
                        <button
                            className="bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors border border-slate-200"
                            onClick={() => setActiveTab('Leave')}
                        >
                            Request Leave
                        </button>
                        <button
                            className="bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors border border-slate-200"
                            onClick={() => setActiveTab('Activities')}
                        >
                            View Activities
                        </button>
                    </div>
                </div>

                {/* Additional Action Options */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900">Profile Actions</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All Options</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left"
                            onClick={() => setActiveTab('Leave')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                                    <Calendar size={18} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Request Leave</h4>
                                    <p className="text-sm text-slate-500">Apply for time off</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-400" />
                        </button>
                        <button
                            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left"
                            onClick={() => setActiveTab('Activities')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-green-50 text-green-600">
                                    <Target size={18} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">View Activities</h4>
                                    <p className="text-sm text-slate-500">Check recent activities</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-400" />
                        </button>
                        <button
                            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left"
                            onClick={() => setActiveTab('Career History')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                    <Edit3 size={18} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Update Profile</h4>
                                    <p className="text-sm text-slate-500">Edit personal information</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-400" />
                        </button>
                        <button
                            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-left"
                            onClick={() => setActiveTab('Approvals')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900">Check Approvals</h4>
                                    <p className="text-sm text-slate-500">Review pending requests</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Recent Profile Activity */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900">Recent Profile Updates</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                                <Edit3 size={18} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900">Profile Information Updated</h4>
                                <p className="text-sm text-slate-500">Phone number and contact details</p>
                            </div>
                            <span className="text-xs text-slate-400">2 days ago</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="p-2 rounded-xl bg-green-50 text-green-600">
                                <Award size={18} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900">New Achievement Added</h4>
                                <p className="text-sm text-slate-500">5 years of service milestone</p>
                            </div>
                            <span className="text-xs text-slate-400">1 week ago</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function ApprovalsContent() {
        const approvals = [
            { type: 'leave', title: 'Annual Leave Request', employee: 'John Doe', days: '3 days', status: 'pending', date: 'Jun 15-17, 2024' },
            { type: 'expense', title: 'Travel Reimbursement', employee: 'Sarah Smith', amount: '$1,250', status: 'pending', date: 'Submitted 2 days ago' },
            { type: 'timesheet', title: 'Overtime Approval', employee: 'Mike Johnson', hours: '12 hours', status: 'pending', date: 'May 28, 2024' },
            { type: 'leave', title: 'Medical Leave', employee: 'Emily Brown', days: '2 days', status: 'approved', date: 'Jun 10-11, 2024' },
        ];

        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pending Approvals</h3>
                        <div className="flex items-center gap-2">
                            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">4 Pending</span>
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {approvals.map((approval, i) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-xl ${approval.type === 'leave' ? 'bg-blue-50 text-blue-600' : approval.type === 'expense' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'}`}>
                                            {approval.type === 'leave' ? <Calendar size={18} /> : approval.type === 'expense' ? <DollarSign size={18} /> : <Clock size={18} />}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white">{approval.title}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{approval.employee}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{approval.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${approval.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                            {approval.status === 'pending' ? 'Pending' : 'Approved'}
                                        </span>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700">
                                                Approve
                                            </button>
                                            <button className="px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700">
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    function AttendanceContent() {
        const attendanceData = [
            { date: 'Jun 1', checkIn: '09:00 AM', checkOut: '06:15 PM', hours: '9h 15m', status: 'present', relatedTab: 'Activities' },
            { date: 'Jun 2', checkIn: '08:45 AM', checkOut: '06:30 PM', hours: '9h 45m', status: 'present', relatedTab: 'Activities' },
            { date: 'Jun 3', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: '8h 45m', status: 'present', relatedTab: 'Activities' },
            { date: 'Jun 4', checkIn: '-', checkOut: '-', hours: '-', status: 'absent', relatedTab: 'Leave' },
            { date: 'Jun 5', checkIn: '08:30 AM', checkOut: '06:45 PM', hours: '10h 15m', status: 'present', relatedTab: 'Activities' },
        ];

        const attendanceStats = [
            { label: 'Attendance Rate', value: '92%', icon: CheckCircle, color: 'green', relatedTab: 'Profile' },
            { label: 'Hours This Month', value: '168.5', icon: Clock, color: 'blue', relatedTab: 'Activities' },
            { label: 'Late Arrivals', value: '2', icon: AlertCircle, color: 'amber', relatedTab: 'Profile' },
            { label: 'Leave Days', value: '3', icon: Calendar, color: 'purple', relatedTab: 'Leave' },
        ];

        return (
            <div className="space-y-6">
                {/* Attendance Stats with Navigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {attendanceStats.map((stat, i) => (
                        <div
                            key={i}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer group"
                            onClick={() => setActiveTab(stat.relatedTab)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-xl ${stat.color === 'green' ? 'bg-green-50 text-green-600' : stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'}`}>
                                    <stat.icon size={20} />
                                </div>
                                <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <p className="text-xs text-blue-600 mt-2 font-medium">View Details →</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Attendance Records</h3>
                        <div className="flex items-center gap-3">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Export Report</button>
                            <button
                                className="text-sm text-slate-600 hover:text-slate-700 font-medium"
                                onClick={() => setActiveTab('Activities')}
                            >
                                View Activity Log →
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check In</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Check Out</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Hours</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceData.map((record, i) => (
                                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="py-3 px-4 text-sm font-medium text-slate-900 dark:text-white">{record.date}</td>
                                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{record.checkIn}</td>
                                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{record.checkOut}</td>
                                        <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">{record.hours}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {record.status === 'present' ? 'Present' : 'Absent'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {record.relatedTab && (
                                                <button
                                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                    onClick={() => setActiveTab(record.relatedTab)}
                                                >
                                                    View {record.relatedTab} →
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Related Actions */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/40 dark:to-green-900/40 rounded-3xl p-6 border border-blue-100 dark:border-blue-900">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
                            onClick={() => setActiveTab('Leave')}
                        >
                            Request Leave
                        </button>
                        <button
                            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
                            onClick={() => setActiveTab('Activities')}
                        >
                            View Activities
                        </button>
                        <button
                            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
                            onClick={() => setActiveTab('Profile')}
                        >
                            Update Profile
                        </button>
                        <button
                            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors border border-slate-200 dark:border-slate-700"
                            onClick={() => setActiveTab('Approvals')}
                        >
                            Check Approvals
                        </button>
                    </div>
                </div>

                {/* Attendance Summary */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Summary</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Details</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/30">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">22</div>
                            <p className="text-sm font-medium text-green-700">Days Present</p>
                        </div>
                        <div className="text-center p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">2</div>
                            <p className="text-sm font-medium text-amber-700">Days Absent</p>
                        </div>
                        <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">176.5</div>
                            <p className="text-sm font-medium text-blue-700">Total Hours</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function LeaveContent() {
        const leaveBalance = [
            { type: 'Annual Leave', total: 21, used: 5, remaining: 16, color: 'blue' },
            { type: 'Sick Leave', total: 10, used: 2, remaining: 8, color: 'green' },
            { type: 'Personal Leave', total: 5, used: 1, remaining: 4, color: 'purple' },
            { type: 'Maternity/Paternity', total: 90, used: 0, remaining: 90, color: 'amber' },
        ];

        const leaveRequests = [
            { type: 'Annual', startDate: 'Jun 15', endDate: 'Jun 17', days: 3, status: 'pending', reason: 'Family vacation' },
            { type: 'Sick', startDate: 'May 20', endDate: 'May 20', days: 1, status: 'approved', reason: 'Medical appointment' },
            { type: 'Personal', startDate: 'Apr 10', endDate: 'Apr 10', days: 1, status: 'approved', reason: 'Personal work' },
        ];

        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leave Balance</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Request Leave</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {leaveBalance.map((leave, i) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-slate-900 dark:text-white">{leave.type}</h4>
                                    <div className={`w-2 h-2 rounded-full ${leave.color === 'blue' ? 'bg-blue-600' : leave.color === 'green' ? 'bg-green-600' : leave.color === 'purple' ? 'bg-purple-600' : 'bg-amber-600'}`}></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Total:</span>
                                        <span className="font-medium">{leave.total} days</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Used:</span>
                                        <span className="font-medium text-red-600">{leave.used} days</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-semibold">
                                        <span className="text-slate-700">Remaining:</span>
                                        <span className="text-green-600">{leave.remaining} days</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-3">
                                        <div
                                            className={`h-2 rounded-full ${leave.color === 'blue' ? 'bg-blue-600' : leave.color === 'green' ? 'bg-green-600' : leave.color === 'purple' ? 'bg-purple-600' : 'bg-amber-600'}`}
                                            style={{ width: `${(leave.remaining / leave.total) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Leave History</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>
                    <div className="space-y-4">
                        {leaveRequests.map((request, i) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-2 rounded-xl ${request.type === 'Annual' ? 'bg-blue-50 text-blue-600' : request.type === 'Sick' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'}`}>
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white">{request.type} Leave</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{request.reason}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{request.startDate} - {request.endDate} ({request.days} days)</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${request.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                        {request.status === 'pending' ? 'Pending' : 'Approved'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-12">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Personal Space</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">My Dashboard</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Welcome back, Jane! Here's your personalized workspace.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-64 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                            />
                        </div>
                        <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                            <Bell size={18} className="text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>
                </div>

                {/* --- Tab Navigation --- */}
                <div className="flex items-center gap-1 mb-10 bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* --- Tab Content --- */}
                {renderTabContent()}
            </div>

            {/* Profile Editing Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-5xl max-h-[95vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-slate-700">
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Edit Profile</h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Update your personal information and preferences.</p>
                                </div>
                                <button
                                    onClick={() => setShowProfileModal(false)}
                                    className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form className="space-y-10">
                                {/* Profile Header with Photo and Background */}
                                <div className="relative">
                                    {/* Background Image */}
                                    <div className="relative h-48 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl overflow-hidden">
                                        {profileData.backgroundImage && (
                                            <img src={profileData.backgroundImage} alt="Background" className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/20" />
                                        <button
                                            type="button"
                                            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-all"
                                        >
                                            <Palette size={18} className="text-white" />
                                        </button>
                                    </div>

                                    {/* Profile Photo */}
                                    <div className="absolute -bottom-16 left-10">
                                        <div className="relative">
                                            <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-2xl p-1 shadow-xl">
                                                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden">
                                                    {profileData.profileImage ? (
                                                        <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <User size={40} className="text-slate-400" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg"
                                            >
                                                <Camera size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="ml-44 space-y-2">
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">{profileData.fullName}</h4>
                                    <p className="text-slate-500 dark:text-slate-400">{profileData.designation} • {profileData.department}</p>
                                </div>

                                {/* Personal Information */}
                                <div className="space-y-8">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                                            <input
                                                type="text"
                                                value={profileData.fullName}
                                                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={profileData.dateOfBirth}
                                                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                                            <input
                                                type="email"
                                                value={profileData.email}
                                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={profileData.phone}
                                                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Location</label>
                                            <input
                                                type="text"
                                                value={profileData.location}
                                                onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Office</label>
                                            <input
                                                type="text"
                                                value={profileData.office}
                                                onChange={(e) => setProfileData({ ...profileData, office: e.target.value })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Bio</label>
                                        <textarea
                                            value={profileData.bio}
                                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                            placeholder="Tell us about yourself..."
                                            rows={3}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 dark:text-slate-200 resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Preferences */}
                                <div className="space-y-8">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Preferences</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Theme</label>
                                            <select
                                                value={profileData.preferences.theme}
                                                onChange={(e) => setProfileData({ ...profileData, preferences: { ...profileData.preferences, theme: e.target.value } })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                                            >
                                                <option value="light">Light</option>
                                                <option value="dark">Dark</option>
                                                <option value="auto">Auto</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Language</label>
                                            <select
                                                value={profileData.preferences.language}
                                                onChange={(e) => setProfileData({ ...profileData, preferences: { ...profileData.preferences, language: e.target.value } })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                                            >
                                                <option value="English">English</option>
                                                <option value="Spanish">Spanish</option>
                                                <option value="French">French</option>
                                                <option value="German">German</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Timezone</label>
                                            <select
                                                value={profileData.preferences.timezone}
                                                onChange={(e) => setProfileData({ ...profileData, preferences: { ...profileData.preferences, timezone: e.target.value } })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 dark:text-slate-200"
                                            >
                                                <option value="EST">Eastern Time (EST)</option>
                                                <option value="PST">Pacific Time (PST)</option>
                                                <option value="GMT">Greenwich Mean Time (GMT)</option>
                                                <option value="CET">Central European Time (CET)</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={profileData.preferences.notifications}
                                                    onChange={(e) => setProfileData({ ...profileData, preferences: { ...profileData.preferences, notifications: e.target.checked } })}
                                                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Notifications</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Important Information */}
                                <div className="bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                                        <div className="text-blue-900 dark:text-blue-100">
                                            <p className="text-sm font-bold mb-2">Profile Guidelines</p>
                                            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                                                <li>• Keep your profile information up-to-date for better collaboration</li>
                                                <li>• Professional photos help colleagues recognize you</li>
                                                <li>• Bio should be concise and professional</li>
                                                <li>• Changes may take a few minutes to reflect across the system</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowProfileModal(false)}
                                        className="flex-1 px-8 py-4 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 font-bold transition-all order-2 sm:order-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Handle form submission here
                                            console.log('Profile updated:', profileData);
                                            setShowProfileModal(false);
                                        }}
                                        className="flex-[2] px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 order-1 sm:order-2"
                                    >
                                        <Save size={18} />
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    function TimeLogsContent() {
        const timeLogs = [
            { date: '2024-05-27', checkIn: '09:00 AM', checkOut: '06:15 PM', totalHours: '09:15', status: 'Complete', project: 'Sales Dashboard' },
            { date: '2024-05-26', checkIn: '08:45 AM', checkOut: '06:00 PM', totalHours: '09:15', status: 'Complete', project: 'Client Meeting' },
            { date: '2024-05-25', checkIn: '09:15 AM', checkOut: '05:45 PM', totalHours: '08:30', status: 'Complete', project: 'Team Sync' },
            { date: '2024-05-24', checkIn: '09:00 AM', checkOut: '06:30 PM', totalHours: '09:30', status: 'Complete', project: 'Sales Dashboard' },
        ];

        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Time Logs</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Export Logs</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-700">
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Check In</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Check Out</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Hours</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Project</th>
                                    <th className="text-left py-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {timeLogs.map((log, i) => (
                                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="py-4 px-4 text-sm font-semibold text-slate-900 dark:text-white">{log.date}</td>
                                        <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{log.checkIn}</td>
                                        <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{log.checkOut}</td>
                                        <td className="py-4 px-4 text-sm font-bold text-blue-600 dark:text-blue-400">{log.totalHours}</td>
                                        <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{log.project}</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    function FeedbackContent() {
        const feedbackItems = [
            { from: 'Tom Cook', role: 'VP Sales', date: '2024-05-20', rating: 5, comment: 'Excellent performance on the Q2 campaign. Great leadership skills demonstrated.', type: 'Performance Review' },
            { from: 'Sarah Chen', role: 'Team Lead', date: '2024-04-15', rating: 4, comment: 'Strong collaboration and communication. Keep up the good work!', type: 'Peer Review' },
            { from: 'Management', role: 'HR Department', date: '2024-03-10', rating: 5, comment: 'Outstanding contribution to team success. Exceeded all targets.', type: 'Annual Review' },
        ];

        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Feedback History</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Request Feedback</button>
                    </div>
                    <div className="space-y-6">
                        {feedbackItems.map((feedback, i) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-blue-200 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                            {feedback.from.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white">{feedback.from}</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{feedback.role}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 mb-1">
                                            {[...Array(5)].map((_, j) => (
                                                <span key={j} className={`text-lg ${j < feedback.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-400">{feedback.date}</p>
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-4 mb-3">
                                    <p className="text-sm text-slate-700 dark:text-slate-300">{feedback.comment}</p>
                                </div>
                                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                                    {feedback.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    function CasesContent() {
        const cases = [
            { id: 'CASE-2024-156', title: 'Leave Request - Annual Vacation', status: 'Approved', priority: 'Medium', date: '2024-05-25', assignedTo: 'HR Team' },
            { id: 'CASE-2024-142', title: 'Equipment Request - New Laptop', status: 'In Progress', priority: 'High', date: '2024-05-20', assignedTo: 'IT Support' },
            { id: 'CASE-2024-138', title: 'Reimbursement - Travel Expenses', status: 'Pending', priority: 'Low', date: '2024-05-18', assignedTo: 'Finance' },
            { id: 'CASE-2024-125', title: 'Training Request - Leadership Course', status: 'Approved', priority: 'Medium', date: '2024-05-10', assignedTo: 'L&D Team' },
        ];

        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">My Cases</h3>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors">
                            Create New Case
                        </button>
                    </div>
                    <div className="space-y-4">
                        {cases.map((caseItem, i) => (
                            <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-blue-200 transition-all cursor-pointer group">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{caseItem.title}</h4>
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${caseItem.status === 'Approved' ? 'bg-green-50 text-green-700' :
                                                caseItem.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                                                    'bg-amber-50 text-amber-700'
                                                }`}>
                                                {caseItem.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Case ID: {caseItem.id}</p>
                                        <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {caseItem.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users size={14} />
                                                {caseItem.assignedTo}
                                            </span>
                                            <span className={`px-2 py-1 rounded font-bold ${caseItem.priority === 'High' ? 'bg-red-50 text-red-700' :
                                                caseItem.priority === 'Medium' ? 'bg-amber-50 text-amber-700' :
                                                    'bg-slate-50 text-slate-700'
                                                }`}>
                                                {caseItem.priority} Priority
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    function RelatedDataContent() {
        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Related Data & Documents</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Performance Metrics */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                    <PieChart size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Performance Metrics</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Q2 2024 Summary</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Sales Target Achievement</span>
                                    <span className="text-sm font-bold text-green-600">115%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Customer Satisfaction</span>
                                    <span className="text-sm font-bold text-green-600">4.8/5.0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Team Collaboration</span>
                                    <span className="text-sm font-bold text-blue-600">Excellent</span>
                                </div>
                            </div>
                        </div>

                        {/* Training Records */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                    <Award size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Training & Certifications</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Completed Courses</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Leadership Excellence</span>
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-bold">Certified</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Sales Mastery</span>
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-bold">Certified</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Advanced Analytics</span>
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-bold">In Progress</span>
                                </div>
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Important Documents</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Recent uploads</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer">
                                    <FileText size={16} />
                                    <span>Employment Contract.pdf</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer">
                                    <FileText size={16} />
                                    <span>Tax Documents 2024.pdf</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 cursor-pointer">
                                    <FileText size={16} />
                                    <span>Benefits Enrollment.pdf</span>
                                </div>
                            </div>
                        </div>

                        {/* Payroll Summary */}
                        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-blue-200 transition-all">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">Payroll Summary</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">May 2024</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Gross Salary</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">$8,500</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Deductions</span>
                                    <span className="text-sm font-bold text-red-600">-$1,200</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">Net Pay</span>
                                    <span className="text-lg font-bold text-green-600">$7,300</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

export default DashboardHome;