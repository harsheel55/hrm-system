import { useState, useMemo } from 'react';
import {
    Calendar,
    CheckCircle,
    Clock,
    Plus,
    History,
    PieChart,
    ArrowUpRight,
    X,
    Send,
    HeartPulse
} from 'lucide-react';

const Leave = () => {
    const [showLeaveModal, setShowLeaveModal] = useState(false);
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
        <div className="min-h-screen bg-[#f8fafc] pb-12">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                
                {/* --- Header --- */}
                <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Time Off</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leave Management</h1>
                        <p className="text-sm font-medium text-slate-500">Track, plan, and apply for your time off.</p>
                    </div>
                    <button 
                        onClick={() => setShowLeaveModal(true)}
                        className="group flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 font-bold text-sm active:scale-95"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        Apply for Leave
                    </button>
                </div>

                {/* --- Balance Grid --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {leaveBalance.map((leave, i) => {
                        const percentUsed = (Number(leave.used) / Number(leave.total)) * 100;
                        const colorMap: {[key: string]: string} = {
                            indigo: 'bg-indigo-600 text-indigo-600 border-indigo-100',
                            emerald: 'bg-emerald-600 text-emerald-600 border-emerald-100',
                            purple: 'bg-purple-600 text-purple-600 border-purple-100',
                            amber: 'bg-amber-500 text-amber-500 border-amber-100',
                        };
                        return (
                            <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 group-hover:scale-110 transition-transform`}>
                                        <PieChart size={22} className="text-slate-400 group-hover:text-blue-600" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Quotas</span>
                                </div>
                                
                                <h4 className="font-bold text-slate-900 mb-1">{leave.type}</h4>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-3xl font-black text-slate-900">{leave.remaining}</span>
                                    <span className="text-xs font-bold text-slate-400">/ {leave.total} Days Left</span>
                                </div>

                                <div className="relative w-full h-2.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
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
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                                    <div className="p-2 bg-slate-900 text-white rounded-xl"><History size={20} /></div>
                                    Recent Requests
                                </h3>
                                <button className="text-sm font-bold text-blue-600 hover:underline">Full History</button>
                            </div>

                            <div className="space-y-4">
                                {leaveRequests.map((request, i) => (
                                    <div key={i} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-3xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/20 transition-all">
                                        <div className="flex items-center gap-5">
                                            <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold ${
                                                request.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                                <span className="text-[10px] uppercase">{request.startDate.split(' ')[0]}</span>
                                                <span className="text-lg">{request.startDate.split(' ')[1]}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-900">{request.type} Leave</h4>
                                                    <span className="text-[10px] bg-white border border-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-black uppercase">{request.days} Days</span>
                                                </div>
                                                <p className="text-xs font-medium text-slate-400 mt-1">{request.reason}</p>
                                            </div>
                                        </div>

                                        <div className={`mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs border ${
                                            request.status === 'pending' 
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
                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all border border-white/10">
                                    Planning Tool
                                </button>
                            </div>
                            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
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
                                            <p className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{h.name}</p>
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

            {/* --- Application Modal --- */}
            {showLeaveModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl border border-white/20">
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Time Off Request</h3>
                                    <p className="text-sm font-medium text-slate-500 mt-1">Fill in the details for your supervisor to review.</p>
                                </div>
                                <button 
                                    onClick={() => setShowLeaveModal(false)}
                                    className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 hover:text-slate-900"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form className="space-y-8">
                                {/* Type Selector Chips */}
                                <div>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                                        Leave Category
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {['Annual Leave', 'Sick Leave', 'Personal', 'Paternity'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({...formData, leaveType: type})}
                                                className={`py-3 px-2 rounded-2xl text-[11px] font-bold transition-all border ${
                                                    formData.leaveType === type 
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                                                    : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Start Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">End Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input 
                                                type="date"
                                                value={formData.endDate}
                                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic Day Display */}
                                {calculatedDays > 0 && (
                                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100 animate-in slide-in-from-top-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                                <span className="font-black text-lg">{calculatedDays}</span>
                                            </div>
                                            <p className="text-sm font-bold text-blue-900">Total days being requested</p>
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Estimated</span>
                                    </div>
                                )}

                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Reason / Description</label>
                                    <textarea 
                                        value={formData.reason}
                                        onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                        placeholder="Tell us a little about your time off plans..."
                                        rows={3}
                                        className="w-full p-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 resize-none"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowLeaveModal(false)}
                                        className="flex-1 px-8 py-4 text-slate-500 rounded-2xl hover:bg-slate-50 font-bold transition-all order-2 sm:order-1"
                                    >
                                        Dismiss
                                    </button>
                                    <button 
                                        type="submit"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowLeaveModal(false);
                                        }}
                                        className="flex-[2] px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 font-bold transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 order-1 sm:order-2"
                                    >
                                        Confirm & Submit
                                        <Send size={18} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leave;