import { Calendar, Clock, Download } from 'lucide-react';

const Attendance = () => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900">Attendance</h2>
                <div className="flex items-center gap-2">
                    <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-700 text-sm">
                        <Calendar size={16} className="mr-2" />
                        Jan 2026
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
                        <Download size={16} className="mr-2" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Average Hours</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">8h 42m</p>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">On Time Arrival</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Remote Work</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">10%</p>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Timesheet Table Placeholer */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Employee timesheet data will appear here.</p>
            </div>
        </div>
    );
};

export default Attendance;
