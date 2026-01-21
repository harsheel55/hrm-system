import { Clock, RefreshCw } from 'lucide-react';

const Shift = () => {
    const shifts = [
        { day: 'Monday', time: '09:00 AM - 05:00 PM', role: 'Morning Shift', team: 'Development' },
        { day: 'Tuesday', time: '09:00 AM - 05:00 PM', role: 'Morning Shift', team: 'Development' },
        { day: 'Wednesday', time: '09:00 AM - 05:00 PM', role: 'Morning Shift', team: 'Development' },
        { day: 'Thursday', time: '09:00 AM - 05:00 PM', role: 'Morning Shift', team: 'Development' },
        { day: 'Friday', time: '09:00 AM - 05:00 PM', role: 'Morning Shift', team: 'Development' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Shift Management</h2>
                <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm">
                    <RefreshCw size={16} className="mr-2" />
                    Swap Request
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {shifts.map((shift, i) => (
                        <div key={i} className="p-6 hover:bg-slate-50 transition-colors">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-2 uppercase tracking-wide">
                                {shift.day}
                            </span>
                            <div className="flex items-center text-gray-900 font-semibold mb-1">
                                <Clock size={16} className="mr-2 text-gray-400" />
                                {shift.time}
                            </div>
                            <p className="text-sm text-gray-500">{shift.role}</p>
                            <p className="text-xs text-gray-400 mt-2">{shift.team}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Shift;
