import { Calendar, Check, X, Clock } from 'lucide-react';

const Leave = () => {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Leave Management</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                    Apply for Leave
                </button>
            </div>

            {/* Leave Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <LeaveCard title="Annual Leave" used={12} total={20} color="bg-blue-500" />
                <LeaveCard title="Sick Leave" used={3} total={10} color="bg-green-500" />
                <LeaveCard title="Unpaid Leave" used={0} total={5} color="bg-purple-500" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">JD</div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">John Doe</p>
                            <p className="text-xs text-gray-500">Software Engineer</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">Annual Leave</p>
                        <div className="flex items-center text-xs text-gray-500">
                            <Calendar size={12} className="mr-1" /> Aug 12 - Aug 15 (4 days)
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100"><Check size={18} /></button>
                        <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"><X size={18} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LeaveCard = ({ title, used, total, color }: { title: string, used: number, total: number, color: string }) => {
    const percentage = (used / total) * 100;
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-900">{total - used} <span className="text-sm font-normal text-gray-400">abc left</span></h3>
                </div>
                <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
                    <Clock size={20} />
                </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">{used} days used of {total}</p>
        </div>
    );
}

export default Leave;
