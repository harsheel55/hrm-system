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
    Bell,
    Search,
    Home,
    Settings,
    Grid,
    Users,
    ChevronUp,
    User2
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

const DashboardLayout = () => {
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
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                        <Grid className="size-4" />
                                    </div>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">HRMFlow</span>
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
                                            <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                                                <Link to={item.href}>
                                                    <item.icon />
                                                    <span>{item.name}</span>
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
                                            <span className="truncate font-semibold">User Name</span>
                                            <span className="truncate text-xs text-muted-foreground">user@email.com</span>
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
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
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
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex items-center gap-2 flex-1">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-muted/50 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-ring outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[2px]">
                            <img 
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" 
                                alt="User" 
                                className="rounded-full w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;
