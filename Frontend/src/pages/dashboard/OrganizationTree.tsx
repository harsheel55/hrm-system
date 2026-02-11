import { useState } from 'react';
import {
    Users,
    ChevronRight,
    ChevronDown,
    Search,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Calendar,
    MoreHorizontal,
    Edit3,
    UserCheck,
    Building2,
    Crown,
    Shield
} from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
    status: 'online' | 'offline' | 'busy' | 'away';
    level: number;
    parentId?: string;
    children?: Employee[];
    joinDate: string;
    reports: number;
}

const OrganizationTree = () => {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ceo', 'cto', 'cfo']));
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

    // Mock organization data
    const organizationData: Employee = {
        id: 'ceo',
        name: 'Sarah Mitchell',
        position: 'Chief Executive Officer',
        department: 'Executive',
        email: 'sarah.mitchell@company.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, NY',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'online',
        level: 0,
        joinDate: '2018-03-15',
        reports: 3,
        children: [
            {
                id: 'cto',
                name: 'Michael Chen',
                position: 'Chief Technology Officer',
                department: 'Technology',
                email: 'michael.chen@company.com',
                phone: '+1 (555) 234-5678',
                location: 'San Francisco, CA',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                status: 'online',
                level: 1,
                parentId: 'ceo',
                joinDate: '2019-01-20',
                reports: 4,
                children: [
                    {
                        id: 'eng-manager',
                        name: 'Jennifer Davis',
                        position: 'Engineering Manager',
                        department: 'Engineering',
                        email: 'jennifer.davis@company.com',
                        phone: '+1 (555) 345-6789',
                        location: 'San Francisco, CA',
                        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                        status: 'busy',
                        level: 2,
                        parentId: 'cto',
                        joinDate: '2020-06-10',
                        reports: 8,
                        children: [
                            {
                                id: 'senior-dev1',
                                name: 'Alex Thompson',
                                position: 'Senior Frontend Developer',
                                department: 'Engineering',
                                email: 'alex.thompson@company.com',
                                phone: '+1 (555) 456-7890',
                                location: 'Remote',
                                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                                status: 'online',
                                level: 3,
                                parentId: 'eng-manager',
                                joinDate: '2021-03-15',
                                reports: 0
                            },
                            {
                                id: 'senior-dev2',
                                name: 'Maria Rodriguez',
                                position: 'Senior Backend Developer',
                                department: 'Engineering',
                                email: 'maria.rodriguez@company.com',
                                phone: '+1 (555) 567-8901',
                                location: 'Austin, TX',
                                avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                                status: 'away',
                                level: 3,
                                parentId: 'eng-manager',
                                joinDate: '2020-11-20',
                                reports: 0
                            }
                        ]
                    },
                    {
                        id: 'product-manager',
                        name: 'David Kim',
                        position: 'Product Manager',
                        department: 'Product',
                        email: 'david.kim@company.com',
                        phone: '+1 (555) 678-9012',
                        location: 'Seattle, WA',
                        avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                        status: 'online',
                        level: 2,
                        parentId: 'cto',
                        joinDate: '2019-08-15',
                        reports: 3,
                        children: [
                            {
                                id: 'product-designer',
                                name: 'Emma Wilson',
                                position: 'Product Designer',
                                department: 'Product',
                                email: 'emma.wilson@company.com',
                                phone: '+1 (555) 789-0123',
                                location: 'Portland, OR',
                                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                                status: 'offline',
                                level: 3,
                                parentId: 'product-manager',
                                joinDate: '2021-01-10',
                                reports: 0
                            }
                        ]
                    }
                ]
            },
            {
                id: 'cfo',
                name: 'Robert Johnson',
                position: 'Chief Financial Officer',
                department: 'Finance',
                email: 'robert.johnson@company.com',
                phone: '+1 (555) 890-1234',
                location: 'New York, NY',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                status: 'online',
                level: 1,
                parentId: 'ceo',
                joinDate: '2018-07-22',
                reports: 2,
                children: [
                    {
                        id: 'finance-manager',
                        name: 'Lisa Anderson',
                        position: 'Finance Manager',
                        department: 'Finance',
                        email: 'lisa.anderson@company.com',
                        phone: '+1 (555) 901-2345',
                        location: 'New York, NY',
                        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                        status: 'online',
                        level: 2,
                        parentId: 'cfo',
                        joinDate: '2019-04-10',
                        reports: 5
                    }
                ]
            }
        ]
    };

    const toggleNode = (nodeId: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-emerald-500';
            case 'busy': return 'bg-red-500';
            case 'away': return 'bg-amber-500';
            case 'offline': return 'bg-slate-400';
            default: return 'bg-slate-400';
        }
    };

    const getLevelIcon = (level: number) => {
        switch (level) {
            case 0: return <Crown className="w-4 h-4 text-purple-600" />;
            case 1: return <Shield className="w-4 h-4 text-blue-600" />;
            default: return <UserCheck className="w-4 h-4 text-slate-600" />;
        }
    };

    const renderEmployeeNode = (employee: Employee) => {
        const isExpanded = expandedNodes.has(employee.id);
        const hasChildren = employee.children && employee.children.length > 0;
        const isSearchMatch = searchTerm && employee.name.toLowerCase().includes(searchTerm.toLowerCase());

        return (
            <div key={employee.id} className="select-none">
                <div
                    className={`flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-all group ${isSearchMatch ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700' : ''
                        }`}
                    onClick={() => {
                        if (hasChildren) toggleNode(employee.id);
                        setSelectedEmployee(employee);
                    }}
                >
                    {/* Expand/Collapse Icon */}
                    {hasChildren && (
                        <div className="w-5 h-5 flex items-center justify-center">
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            )}
                        </div>
                    )}
                    {!hasChildren && <div className="w-5" />}

                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(employee.status)}`} />
                    </div>

                    {/* Employee Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            {getLevelIcon(employee.level)}
                            <p className="font-semibold text-slate-900 dark:text-white truncate">{employee.name}</p>
                            {isSearchMatch && <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded-full">Match</span>}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{employee.position}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-400 dark:text-slate-500">{employee.department}</span>
                            {employee.reports > 0 && (
                                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{employee.reports} reports</span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <Mail size={14} className="text-slate-400 dark:text-slate-500" />
                        </button>
                        <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            <MoreHorizontal size={14} className="text-slate-400 dark:text-slate-500" />
                        </button>
                    </div>
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div className="ml-8 mt-2 space-y-1 border-l-2 border-slate-100 dark:border-slate-700 pl-4">
                        {employee.children?.map(child => renderEmployeeNode(child))}
                    </div>
                )}
            </div>
        );
    };

    const filteredOrg = (employee: Employee): Employee => {
        if (!searchTerm) return employee;

        if (employee.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            return employee;
        }

        if (employee.children) {
            const filteredChildren = employee.children
                .map(child => filteredOrg(child))
                .filter(child => child.name.toLowerCase().includes(searchTerm.toLowerCase()) || child.children?.length);

            return { ...employee, children: filteredChildren };
        }

        return employee;
    };

    return (
        <div className="min-h-screen pb-12 animate-fade-in bg-[#f8fafc] dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Organization</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Organization Tree</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Visualize your company hierarchy and team structure.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/20 outline-none w-64 transition-all backdrop-blur-sm"
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-2xl hover:shadow-xl hover:scale-105 transition-all shadow-lg shadow-blue-100 dark:shadow-blue-900/20 font-bold text-sm">
                            <UserPlus size={18} />
                            Add Employee
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Organization Tree */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm p-8 transition-colors backdrop-blur-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Users size={20} className="text-blue-600 dark:text-blue-400" />
                                    Company Hierarchy
                                </h3>
                                <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Away</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Busy</span>
                                </div>
                            </div>

                            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                                {renderEmployeeNode(filteredOrg(organizationData))}
                            </div>
                        </div>
                    </div>

                    {/* Employee Details Sidebar */}
                    <div className="space-y-6">
                        {selectedEmployee ? (
                            <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm p-8 transition-colors backdrop-blur-sm">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Employee Details</h3>
                                    <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <Edit3 size={18} />
                                    </button>
                                </div>

                                <div className="text-center mb-6">
                                    <div className="relative inline-block mb-4">
                                        <img
                                            src={selectedEmployee.avatar}
                                            alt={selectedEmployee.name}
                                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                        <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-3 border-white ${getStatusColor(selectedEmployee.status)}`} />
                                    </div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">{selectedEmployee.name}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{selectedEmployee.position}</p>
                                    <div className="flex items-center justify-center gap-1 mt-2">
                                        {getLevelIcon(selectedEmployee.level)}
                                        <span className="text-xs text-slate-400 dark:text-slate-500">{selectedEmployee.department}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-transparent dark:border-white/5">
                                        <Mail size={16} className="text-slate-400 dark:text-slate-500" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 dark:text-slate-500">Email</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedEmployee.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-transparent dark:border-white/5">
                                        <Phone size={16} className="text-slate-400 dark:text-slate-500" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 dark:text-slate-500">Phone</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedEmployee.phone}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-transparent dark:border-white/5">
                                        <MapPin size={16} className="text-slate-400 dark:text-slate-500" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 dark:text-slate-500">Location</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedEmployee.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-transparent dark:border-white/5">
                                        <Calendar size={16} className="text-slate-400 dark:text-slate-500" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 dark:text-slate-500">Joined</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-transparent dark:border-white/5">
                                        <Briefcase size={16} className="text-slate-400 dark:text-slate-500" />
                                        <div className="flex-1">
                                            <p className="text-xs text-slate-400 dark:text-slate-500">Reports</p>
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedEmployee.reports} direct reports</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <button className="py-2 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:scale-105 transition-all">
                                        Send Message
                                    </button>
                                    <button className="py-2 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent dark:border-white/5">
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-900 dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] p-8 text-white relative overflow-hidden transition-colors border border-transparent dark:border-white/10">
                                <Users className="mb-4 text-slate-400 dark:text-slate-500" size={32} />
                                <h3 className="text-xl font-bold mb-2">Select an Employee</h3>
                                <p className="text-slate-400 dark:text-slate-500 text-sm leading-relaxed">
                                    Click on any employee in the organization tree to view their detailed information and manage their profile.
                                </p>
                                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
                            </div>
                        )}

                        {/* Statistics */}
                        <div className="bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm p-8 transition-colors backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Organization Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Total Employees</span>
                                    <span className="text-lg font-black text-blue-600 dark:text-blue-400">24</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Departments</span>
                                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">6</span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Avg. Team Size</span>
                                    <span className="text-lg font-black text-amber-600 dark:text-amber-400">4.2</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrganizationTree;
