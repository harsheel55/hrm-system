import { DollarSign, FileText, Send } from 'lucide-react';

const Payroll = () => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900">Payroll Processing</h2>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                    <Send size={18} className="mr-2" />
                    Run Payroll
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex items-center">
                        <DollarSign className="text-gray-400 mr-2" size={20} />
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Payroll History</h3>
                    </div>
                </div>
                <div className="divide-y divide-gray-200">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">January 2026 Salary</p>
                                    <p className="text-xs text-gray-500">Processed on Jan 31, 2026</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Completed
                                </span>
                                <span className="text-sm font-bold text-gray-900">$142,500.00</span>
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Payroll;
