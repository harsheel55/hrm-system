import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    Clock,
    Calendar,
    FileText,
    PieChart,
    ClipboardList,
    RefreshCw,
    Banknote,
    Briefcase,
    LogOut,
    Menu,
    Bell,
    Search,
    Home,
    Settings,
    Grid
} from 'lucide-react';

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Main Navigation (Sidebar Icons)
    const apps = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Attendance', href: '/dashboard/attendance', icon: Clock },
        { name: 'Leave', href: '/dashboard/leave', icon: Calendar },
        { name: 'Timesheet', href: '/dashboard/timesheet', icon: ClipboardList },
        { name: 'Performance', href: '/dashboard/analytics', icon: PieChart },
        { name: 'Expenses', href: '/dashboard/payroll', icon: Banknote },
        { name: 'Recruitment', href: '/dashboard/recruitment', icon: Briefcase },
        { name: 'Documents', href: '/dashboard/documents', icon: FileText },
        { name: 'Roster', href: '/dashboard/shift', icon: RefreshCw },
    ];

    // Top Level Tabs (Context)
    const contextTabs = ['My Space', 'Team', 'Organization'];
    const [activeContext, setActiveContext] = useState('My Space');

    // Sub Level Tabs (Page)
    const pageTabs = [
        { name: 'Overview', href: '/dashboard' },
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Calendar', href: '/dashboard/leave' }, // Map to relevant pages
    ];

    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* --- Mobile Sidebar Overlay --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* --- Left Icon Rail (Sidebar) --- */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-20 bg-[#0F172A] text-slate-400 flex flex-col items-center py-6 gap-6 transition-transform duration-300 ease-in-out border-r border-slate-800
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static
            `}>
                {/* Logo */}
                <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/20 mb-2">
                    <Grid className="text-white w-6 h-6" />
                </div>

                {/* Icons */}
                <nav className="flex-1 flex flex-col gap-2 w-full px-2 overflow-y-auto no-scrollbar">
                    {apps.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`
                                    flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-200 group
                                    ${isActive
                                        ? 'bg-white/10 text-white shadow-sm'
                                        : 'hover:bg-white/5 hover:text-slate-100'}
                                `}
                            >
                                <item.icon strokeWidth={1.5} size={22} className={`mb-1 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : ''}`} />
                                <span className="text-[10px] font-medium tracking-wide opacity-80">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="flex flex-col gap-4 mt-auto w-full px-2">
                    <button className="flex flex-col items-center justify-center py-2 text-slate-500 hover:text-white transition-colors">
                        <Settings strokeWidth={1.5} size={22} />
                    </button>
                    <button className="flex flex-col items-center justify-center py-2 text-slate-500 hover:text-white transition-colors">
                        <LogOut strokeWidth={1.5} size={22} />
                    </button>
                </div>
            </aside>

            {/* --- Main Content Area --- */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC]">

                {/* --- Top Header (Double Layer) --- */}
                <header className="bg-[#1E293B] text-white shadow-md z-30">
                    {/* Level 1: Global Context & User */}
                    <div className="h-14 px-6 flex items-center justify-between border-b border-slate-700">
                        {/* Mobile Menu Button Display */}
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden mr-4 text-slate-400">
                            <Menu size={24} />
                        </button>

                        <div className="flex items-center gap-8">
                            <h1 className="text-lg font-bold tracking-tight hidden sm:block">HRM<span className="text-blue-400">Flow</span></h1>
                            <div className="hidden md:flex items-center gap-1">
                                {contextTabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveContext(tab)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeContext === tab ? 'bg-slate-700 text-white shadow-inner' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-slate-800 border-none rounded-full py-1.5 pl-9 pr-4 text-sm text-slate-200 focus:ring-1 focus:ring-blue-500 w-48 transition-all"
                                />
                            </div>
                            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                                <Bell size={20} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#1E293B]"></span>
                            </button>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[2px]">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" alt="User" className="rounded-full border-2 border-[#1E293B]" />
                            </div>
                        </div>
                    </div>

                    {/* Level 2: Page Tabs */}
                    <div className="h-12 px-6 flex items-center gap-6 bg-white text-slate-600 shadow-sm border-b border-slate-200">
                        {pageTabs.map((tab) => (
                            <Link
                                key={tab.name}
                                to={tab.href}
                                className="relative h-full flex items-center px-1 text-sm font-semibold hover:text-blue-600 transition-colors"
                            >
                                {tab.name}
                                {/* Active Indicator (Mock logic) */}
                                {tab.name === 'Overview' && location.pathname === '/dashboard' && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></span>
                                )}
                            </Link>
                        ))}
                    </div>
                </header>

                {/* --- Viewport --- */}
                <main className="flex-1 overflow-y-auto relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
