import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
    Bell,
    Search,
    Home,
    Settings,
    Grid,
    Users,
    ChevronUp,
    User2,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useAuth } from '@/contexts/AuthContext';

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleSignOut = () => {
        logout();
        navigate('/login');
    };

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
        { name: 'Organization', href: '/dashboard/organization', icon: Users },
    ];

    return (
        <SidebarProvider>
            <Sidebar collapsible="icon">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link to="/dashboard">
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                                        <Grid className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-bold text-gradient">HRMFlow</span>
                                        <span className="truncate text-xs text-muted-foreground">Enterprise</span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {apps.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <SidebarMenuItem key={item.name}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={item.name}
                                                className={`transition-all ${isActive ? 'scale-105 shadow-sm' : 'hover:scale-102'}`}
                                            >
                                                <Link to={item.href}>
                                                    <item.icon className={isActive ? 'text-blue-600' : ''} />
                                                    <span className={isActive ? 'font-semibold' : ''}>{item.name}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarMenu>

                        {/* User Dropdown */}
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500">
                                            <User2 className="size-4 text-white" />
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user?.name || 'User'}</span>
                                            <span className="truncate text-xs text-muted-foreground">{user?.email || 'user@email.com'}</span>
                                        </div>
                                        <ChevronUp className="ml-auto size-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                    side="bottom"
                                    align="end"
                                    sideOffset={4}
                                >
                                    <DropdownMenuItem>
                                        <User2 className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleSignOut}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset>
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-white/20 dark:border-slate-800/50 px-4 glass dark:bg-slate-900/80 backdrop-blur-xl animate-slide-down transition-colors">
                    <SidebarTrigger className="-ml-1 hover:bg-blue-50 hover:text-blue-600 transition-all rounded-lg" />
                    <div className="flex items-center gap-2 flex-1">
                        <div className="relative flex-1 max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-blue-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search anything..."
                                className="w-full bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 focus:border-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:text-slate-400 dark:text-slate-200"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Dark Mode Toggle */}
                        <AnimatedThemeToggler className="relative text-muted-foreground hover:text-blue-600 dark:hover:text-yellow-400 transition-all rounded-xl" />

                        <button className="relative p-2.5 text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 group">
                            <Bell size={20} className="group-hover:animate-pulse" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse ring-2 ring-white"></span>
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
