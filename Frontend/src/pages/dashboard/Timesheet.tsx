import { Save, AlertCircle } from 'lucide-react';

const Timesheet = () => {
    const days = ['Mon, 12', 'Tue, 13', 'Wed, 14', 'Thu, 15', 'Fri, 16', 'Sat, 17', 'Sun, 18'];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Weekly Timesheet</h2>
                    <p className="text-sm text-gray-500">Aug 12 - Aug 18, 2024</p>
                </div>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
                    <Save size={16} className="mr-2" />
                    Save & Submit
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Project / Task</th>
                            {days.map(day => (
                                <th key={day} className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[80px]">
                                    {day}
                                </th>
                            ))}
                            <th className="px-4 py-4 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[1, 2, 3].map((row) => (
                            <tr key={row}>
                                <td className="px-6 py-4">
                                    <input type="text" placeholder="Enter task..." className="w-full border-none focus:ring-0 text-sm p-0" defaultValue={row === 1 ? 'Frontend Development' : ''} />
                                </td>
                                {days.map((_d, i) => (
                                    <td key={i} className="px-4 py-2">
                                        <input type="number" className="w-full text-center border border-gray-200 rounded-md py-1 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500" defaultValue="8" />
                                    </td>
                                ))}
                                <td className="px-4 py-4 text-center font-bold text-gray-900">56</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex items-start gap-2 p-4 bg-yellow-50 text-yellow-700 rounded-xl text-sm border border-yellow-100">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <p>Ensure all hours are logged correctly before submission. Once approved by the manager, no changes can be made.</p>
            </div>
        </div>
    );
};

export default Timesheet;
