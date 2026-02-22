import { useState, useMemo } from 'react';
import {
    Calendar as CalendarIcon,
    CheckCircle,
    Clock,
    Plus,
    History,
    PieChart,
    ArrowUpRight,
    Send,
    HeartPulse
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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

const Leave = () => {
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [formData, setFormData] = useState({
        leaveType: 'Annual Leave',
        startDate: '',
        endDate: '',
        reason: '',
        emergencyContact: ''
    });

    // Helper to calculate business days (simplified for UI feedback)
    const calculatedDays = useMemo(() => {
        if (!formData.startDate || !formData.endDate) return 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(Number(end) - Number(start));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? diffDays : 0;
    }, [formData.startDate, formData.endDate]);

    const leaveBalance = [
        { type: 'Annual Leave', total: 21, used: 5, remaining: 16, theme: 'indigo' },
        { type: 'Sick Leave', total: 10, used: 2, remaining: 8, theme: 'emerald' },
        { type: 'Personal Leave', total: 5, used: 1, remaining: 4, theme: 'purple' },
        { type: 'Paternity', total: 90, used: 0, remaining: 90, theme: 'amber' },
    ];

    const leaveRequests = [
        { type: 'Annual', startDate: 'Jun 15', endDate: 'Jun 17', days: 3, status: 'pending', reason: 'Family vacation' },
        { type: 'Sick', startDate: 'May 20', endDate: 'May 20', days: 1, status: 'approved', reason: 'Medical appointment' },
        { type: 'Personal', startDate: 'Apr 10', endDate: 'Apr 10', days: 1, status: 'approved', reason: 'Personal work' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-12 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Header --- */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Time Off</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Leave Management</h1>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Track, plan, and apply for your time off.</p>
                    </div>
                    <Button
                        onClick={() => setShowLeaveModal(true)}
                        className="bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 transition-all shadow-xl font-bold text-sm rounded-2xl px-8 py-6"
                    >
                        <Plus size={18} className="mr-2" />
                        Apply for Leave
                    </Button>
                </div>

                {/* --- Balance Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {leaveBalance.map((leave, i) => {
                        const percentUsed = (Number(leave.used) / Number(leave.total)) * 100;
                        const colorMap: { [key: string]: string } = {
                            indigo: 'bg-indigo-600 text-indigo-600 border-indigo-100',
                            emerald: 'bg-emerald-600 text-emerald-600 border-emerald-100',
                            purple: 'bg-purple-600 text-purple-600 border-purple-100',
                            amber: 'bg-amber-500 text-amber-500 border-amber-100',
                        };
                        return (
                            <div key={i} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all group">
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 dark:bg-slate-700/50 group-hover:scale-110 transition-transform`}>
                                        <PieChart size={22} className="text-slate-400 group-hover:text-blue-600" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Quotas</span>
                                </div>

                                <h4 className="font-bold text-slate-900 dark:text-white mb-1">{leave.type}</h4>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-3xl font-black text-slate-900 dark:text-white">{leave.remaining}</span>
                                    <span className="text-xs font-bold text-slate-400">/ {leave.total} Days Left</span>
                                </div>

                                <div className="relative w-full h-2.5 bg-slate-50 dark:bg-slate-700 rounded-full overflow-hidden border border-slate-100 dark:border-slate-700">
                                    <div
                                        className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ${colorMap[leave.theme as keyof typeof colorMap].split(' ')[0]}`}
                                        style={{ width: `${100 - percentUsed}%` }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Leave History --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <div className="p-2 bg-slate-900 text-white rounded-xl"><History size={20} /></div>
                                    Recent Requests
                                </h3>
                                <Button variant="link" className="text-sm font-bold text-blue-600 hover:underline h-fit p-0">Full History</Button>
                            </div>

                            <div className="space-y-4">
                                {leaveRequests.map((request, i) => (
                                    <div key={i} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border border-slate-50 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-900 hover:bg-blue-50/20 dark:hover:bg-blue-900/10 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold ${request.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                <span className="text-[10px] uppercase">{request.startDate.split(' ')[0]}</span>
                                                <span className="text-lg">{request.startDate.split(' ')[1]}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{request.type} Leave</h4>
                                                    <span className="text-[10px] bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-lg font-black uppercase">{request.days} Days</span>
                                                </div>
                                                <p className="text-xs font-medium text-slate-400 mt-1">{request.reason}</p>
                                            </div>
                                        </div>

                                        <div className={`mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs border ${request.status === 'pending'
                                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                                            : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                            }`}>
                                            {request.status === 'pending' ? <Clock size={14} /> : <CheckCircle size={14} />}
                                            {request.status.toUpperCase()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- Sidebar --- */}
                    <div className="space-y-6">
                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                            <div className="relative z-10">
                                <HeartPulse className="mb-4 text-indigo-200" size={32} />
                                <h4 className="text-xl font-bold mb-2">Leave Health</h4>
                                <p className="text-indigo-100 text-xs leading-relaxed mb-6">
                                    You've used 12% of your annual quota. We recommend planning your Q3 break soon to avoid burn-out!
                                </p>
                                <Button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10">
                                    Planning Tool
                                </Button>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                <Calendar size={18} className="text-orange-500" />
                                Public Holidays
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Native American Day', date: 'June 2' },
                                    { name: 'Juneteenth', date: 'June 19' },
                                    { name: 'Independence Day', date: 'July 4' },
                                ].map((h, i) => (
                                    <div key={i} className="flex justify-between items-center group cursor-default">
                                        <div>
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{h.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400">{h.date}</p>
                                        </div>
                                        <ArrowUpRight size={14} className="text-slate-200 group-hover:text-blue-600 transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
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
                            onClick={(e) => {
                                e.preventDefault();
                                console.log('Leave request:', formData);
                                setShowLeaveModal(false);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Confirm & Submit
                            <Send size={16} className="ml-2" />
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Leave;