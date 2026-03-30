import { useEffect, useMemo, useState } from 'react';
import {
    Calendar as CalendarIcon,
    CheckCircle,
    Bell,
    Clock,
    Plus,
    Users,
    UserRound,
    XCircle,
    Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { leaveService, type LeaveBalance, type LeaveRequest } from '@/services/leave.service';

const Leave = () => {
    type LeaveTab = 'overview' | 'requests' | 'balances' | 'calendar';

    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [activeTab, setActiveTab] = useState<LeaveTab>('overview');
    const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
    const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        leaveType: 'Annual Leave',
        startDate: '',
        endDate: '',
        reason: '',
        emergencyContact: ''
    });

    const totalEmployees = 48;
    const totalDepartments = 8;

    const leaveToday = [
        { initials: 'MC', name: 'Michael', type: 'Sick', days: '2d' },
        { initials: 'AP', name: 'Aisha', type: 'Maternity', days: '90d' },
        { initials: 'DP', name: 'David', type: 'Sick', days: '1d' },
    ];

    // Helper to calculate business days (simplified for UI feedback)
    const calculatedDays = useMemo(() => {
        if (!formData.startDate || !formData.endDate) return 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(Number(end) - Number(start));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? diffDays : 0;
    }, [formData.startDate, formData.endDate]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setServerError(null);
                setIsLoading(true);
                const response = await leaveService.getDashboard();
                setLeaveBalance(response.data.balances);
                setLeaveRequests(response.data.requests);
            } catch (error) {
                setServerError(error instanceof Error ? error.message : 'Failed to load leave data.');
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const getTheme = (leaveType: string) => {
        const normalized = leaveType.toLowerCase();
        if (normalized.includes('annual')) return 'indigo';
        if (normalized.includes('sick')) return 'emerald';
        if (normalized.includes('personal')) return 'purple';
        if (normalized.includes('paternity')) return 'amber';
        return 'indigo';
    };

    const resetForm = () => {
        setFormData({
            leaveType: 'Annual Leave',
            startDate: '',
            endDate: '',
            reason: '',
            emergencyContact: ''
        });
        setStartDate(undefined);
        setEndDate(undefined);
    };

    const handleSubmitRequest = async () => {
        if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
            setServerError('Please select dates and enter a reason.');
            return;
        }

        try {
            setIsSubmitting(true);
            setServerError(null);

            await leaveService.createRequest({
                leaveType: formData.leaveType,
                startDate: formData.startDate,
                endDate: formData.endDate,
                reason: formData.reason,
                emergencyContact: formData.emergencyContact
            });

            const dashboard = await leaveService.getDashboard();
            setLeaveBalance(dashboard.data.balances);
            setLeaveRequests(dashboard.data.requests);
            resetForm();
            setShowLeaveModal(false);
        } catch (error) {
            setServerError(error instanceof Error ? error.message : 'Failed to submit leave request.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const pendingCount = useMemo(
        () => leaveRequests.filter((request) => request.status === 'pending').length,
        [leaveRequests]
    );

    const approvedThisMonth = useMemo(() => {
        const now = new Date();
        return leaveRequests.filter((request) => {
            if (request.status !== 'approved') return false;
            const created = new Date(request.createdAt);
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;
    }, [leaveRequests]);

    const onLeaveTodayCount = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return leaveRequests.filter((request) => {
            if (request.status !== 'approved') return false;
            const start = new Date(request.startDate);
            const end = new Date(request.endDate);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return today >= start && today <= end;
        }).length;
    }, [leaveRequests]);

    const topStats = [
        {
            label: 'Pending Requests',
            value: pendingCount,
            sub: 'Awaiting review',
            icon: Clock,
            accent: 'text-amber-600 bg-amber-50',
        },
        {
            label: 'Approved This Month',
            value: approvedThisMonth,
            sub: format(new Date(), 'MMMM yyyy'),
            icon: CheckCircle,
            accent: 'text-emerald-600 bg-emerald-50',
        },
        {
            label: 'On Leave Today',
            value: onLeaveTodayCount,
            sub: `Out of ${totalEmployees} employees`,
            icon: UserRound,
            accent: 'text-violet-600 bg-violet-50',
        },
        {
            label: 'Total Employees',
            value: totalEmployees,
            sub: `${totalDepartments} departments`,
            icon: Users,
            accent: 'text-sky-600 bg-sky-50',
        },
    ];

    const statusClass = (status: LeaveRequest['status']) => {
        if (status === 'approved') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        if (status === 'rejected') return 'bg-rose-50 text-rose-700 border-rose-200';
        return 'bg-amber-50 text-amber-700 border-amber-200';
    };

    const leaveTypeClass = (leaveType: string) => {
        const normalized = leaveType.toLowerCase();
        if (normalized.includes('annual')) return 'bg-violet-50 text-violet-700';
        if (normalized.includes('sick')) return 'bg-sky-50 text-sky-700';
        if (normalized.includes('personal')) return 'bg-emerald-50 text-emerald-700';
        return 'bg-slate-100 text-slate-700';
    };

    const tabs: Array<{ key: LeaveTab; label: string }> = [
        { key: 'overview', label: 'Overview' },
        { key: 'requests', label: `Requests ${leaveRequests.length}` },
        { key: 'balances', label: 'Leave Balances' },
        { key: 'calendar', label: 'Calendar' },
    ];

    return (
        <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 pb-8 transition-colors">
            <div className="w-full px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="p-0 sm:p-0 mb-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Leave Management</h1>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Manage leave requests and balances</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                                    <Bell size={16} />
                                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
                                </Button>
                                <Button
                                    onClick={() => setShowLeaveModal(true)}
                                    className="h-8 rounded-md bg-violet-600 hover:bg-violet-700 px-3 text-xs"
                                >
                                    <Plus size={14} className="mr-1" />
                                    Apply for Leave
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        {serverError && (
                            <Alert className="mb-4 border-red-200 bg-red-50 text-red-700">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
                            {topStats.map((item) => (
                                <Card key={item.label} className="border border-slate-200 dark:border-slate-800 shadow-none">
                                    <CardContent className="p-3">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="text-[11px] text-slate-500">{item.label}</p>
                                            <div className={`h-5 w-5 rounded-full grid place-items-center ${item.accent}`}>
                                                <item.icon size={11} />
                                            </div>
                                        </div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{item.value}</p>
                                        <p className="text-[10px] text-slate-400 mt-2">{item.sub}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 p-1 text-[11px] mb-4 gap-1">
                            {tabs.map((tab) => (
                                <Button
                                    key={tab.key}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`h-7 px-2.5 text-[11px] ${activeTab === tab.key
                                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {tab.label}
                                </Button>
                            ))}
                        </div>

                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                                <Card className="xl:col-span-2 border border-slate-200 dark:border-slate-800 shadow-none">
                                    <CardHeader className="p-3 pb-2 flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-sm font-semibold">Recent Requests</CardTitle>
                                        <Button variant="link" className="h-auto p-0 text-xs text-violet-600" onClick={() => setActiveTab('requests')}>View all</Button>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-1 space-y-2">
                                        {isLoading && <p className="text-xs text-slate-400">Loading requests...</p>}
                                        {!isLoading && leaveRequests.length === 0 && (
                                            <p className="text-xs text-slate-400">No requests yet.</p>
                                        )}
                                        {leaveRequests.slice(0, 4).map((request) => (
                                            <div key={request.id} className="rounded-lg border border-slate-100 dark:border-slate-800 px-2.5 py-2 flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{request.reason}</p>
                                                    <p className="text-[10px] text-slate-500">
                                                        {format(new Date(request.startDate), 'yyyy-MM-dd')} - {format(new Date(request.endDate), 'yyyy-MM-dd')} • {request.days}d
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <Badge className={`text-[10px] rounded-full px-2 h-5 border-0 ${leaveTypeClass(request.leaveType)}`}>
                                                        {request.leaveType.replace(' Leave', '')}
                                                    </Badge>
                                                    <Badge className={`text-[10px] rounded-full px-2 h-5 border ${statusClass(request.status)}`}>
                                                        {request.status[0].toUpperCase() + request.status.slice(1)}
                                                    </Badge>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-emerald-600" aria-label="Approve">
                                                        <CheckCircle size={14} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-rose-600" aria-label="Reject">
                                                        <XCircle size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <div className="space-y-3">
                                    <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
                                        <CardHeader className="p-3 pb-2">
                                            <CardTitle className="text-sm font-semibold">Your Balance</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-1 space-y-2.5">
                                            {leaveBalance.map((leave) => {
                                                const percent = leave.total === 0 ? 0 : (leave.remaining / leave.total) * 100;
                                                const theme = getTheme(leave.leaveType);
                                                const barColor: Record<string, string> = {
                                                    indigo: 'bg-violet-500',
                                                    emerald: 'bg-emerald-500',
                                                    purple: 'bg-cyan-500',
                                                    amber: 'bg-amber-500',
                                                };

                                                return (
                                                    <div key={leave.leaveType}>
                                                        <div className="flex items-center justify-between text-[11px] mb-1">
                                                            <span className="text-slate-600 dark:text-slate-300">{leave.leaveType}</span>
                                                            <span className="text-slate-500">{leave.remaining} left</span>
                                                        </div>
                                                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                                            <div className={`h-full ${barColor[theme] ?? 'bg-violet-500'}`} style={{ width: `${percent}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </CardContent>
                                    </Card>

                                    <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
                                        <CardHeader className="p-3 pb-2">
                                            <CardTitle className="text-sm font-semibold">On Leave Today</CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-3 pt-1 space-y-2">
                                            {leaveToday.map((person) => (
                                                <div key={person.name} className="flex items-center gap-2">
                                                    <div className="h-6 w-6 rounded-full bg-slate-100 text-[10px] grid place-items-center font-semibold text-slate-600">
                                                        {person.initials}
                                                    </div>
                                                    <div className="leading-tight">
                                                        <p className="text-xs font-medium text-slate-800 dark:text-slate-100">{person.name}</p>
                                                        <p className="text-[10px] text-slate-500">{person.type} • {person.days}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
                                <CardHeader className="p-4 pb-3">
                                    <CardTitle className="text-sm font-semibold">All Leave Requests</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 space-y-2">
                                    {isLoading && <p className="text-xs text-slate-400">Loading requests...</p>}
                                    {!isLoading && leaveRequests.length === 0 && <p className="text-xs text-slate-400">No requests found.</p>}
                                    {leaveRequests.map((request) => (
                                        <div key={request.id} className="rounded-lg border border-slate-100 dark:border-slate-800 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{request.reason}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {format(new Date(request.startDate), 'dd MMM yyyy')} - {format(new Date(request.endDate), 'dd MMM yyyy')} • {request.days} day(s)
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`text-[10px] rounded-full px-2 h-5 border-0 ${leaveTypeClass(request.leaveType)}`}>
                                                    {request.leaveType}
                                                </Badge>
                                                <Badge className={`text-[10px] rounded-full px-2 h-5 border ${statusClass(request.status)}`}>
                                                    {request.status[0].toUpperCase() + request.status.slice(1)}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'balances' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {leaveBalance.map((leave) => {
                                    const percentUsed = leave.total === 0 ? 0 : (leave.used / leave.total) * 100;
                                    const theme = getTheme(leave.leaveType);
                                    const barColor: Record<string, string> = {
                                        indigo: 'bg-violet-500',
                                        emerald: 'bg-emerald-500',
                                        purple: 'bg-cyan-500',
                                        amber: 'bg-amber-500',
                                    };
                                    return (
                                        <Card key={leave.leaveType} className="border border-slate-200 dark:border-slate-800 shadow-none">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{leave.leaveType}</p>
                                                    <Badge variant="outline" className="text-[10px]">{leave.remaining} left</Badge>
                                                </div>
                                                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-2">
                                                    <div className={`h-full ${barColor[theme] ?? 'bg-violet-500'}`} style={{ width: `${100 - percentUsed}%` }} />
                                                </div>
                                                <p className="text-xs text-slate-500">Used {leave.used} of {leave.total}</p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}

                        {activeTab === 'calendar' && (
                            <Card className="border border-slate-200 dark:border-slate-800 shadow-none">
                                <CardHeader className="p-4 pb-3">
                                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                        <CalendarIcon size={15} className="text-violet-600" />
                                        Leave Calendar
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="w-full overflow-x-auto">
                                        <Calendar mode="single" selected={calendarDate} onSelect={setCalendarDate} className="rounded-lg border w-fit" />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
            </div>

            {/* --- Application Dialog --- */}
            <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Time Off Request</DialogTitle>
                        <DialogDescription>
                            Fill in the details for your supervisor to review.
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-6">
                        {serverError && (
                            <Alert className="bg-red-50 border-red-200 text-red-700">
                                <AlertDescription>{serverError}</AlertDescription>
                            </Alert>
                        )}

                        {/* Type Selector */}
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-wider">
                                Leave Category
                            </Label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {['Annual Leave', 'Sick Leave', 'Personal', 'Paternity'].map((type) => (
                                    <Button
                                        key={type}
                                        type="button"
                                        variant={formData.leaveType === type ? "default" : "outline"}
                                        onClick={() => setFormData({ ...formData, leaveType: type })}
                                        className={`text-xs ${formData.leaveType === type ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                    >
                                        {type}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                setStartDate(date);
                                                if (date) {
                                                    setFormData({ ...formData, startDate: format(date, 'yyyy-MM-dd') });
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start text-left font-normal"
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(date) => {
                                                setEndDate(date);
                                                if (date) {
                                                    setFormData({ ...formData, endDate: format(date, 'yyyy-MM-dd') });
                                                }
                                            }}
                                            disabled={(date) => startDate ? date < startDate : false}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        {/* Dynamic Day Display */}
                        {calculatedDays > 0 && (
                            <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                <AlertDescription className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                            <span className="font-bold text-lg">{calculatedDays}</span>
                                        </div>
                                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-200">
                                            Total days being requested
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="text-xs">Estimated</Badge>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason / Description</Label>
                            <Textarea
                                id="reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="Tell us a little about your time off plans..."
                                rows={4}
                            />
                        </div>
                    </form>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowLeaveModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isLoading}
                            onClick={(e) => {
                                e.preventDefault();
                                void handleSubmitRequest();
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
                            <Send size={16} className="ml-2" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Leave;
