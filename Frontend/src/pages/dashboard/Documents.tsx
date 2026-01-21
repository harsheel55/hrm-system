import { FileText, Upload, Folder, MoreHorizontal } from 'lucide-react';

const Documents = () => {
    const docs = [
        { name: 'Employment Contract.pdf', type: 'PDF', size: '2.4 MB', date: 'Jan 12, 2024' },
        { name: 'Onboarding Checklist.docx', type: 'DOCX', size: '156 KB', date: 'Jan 15, 2024' },
        { name: 'Company Policy v2.pdf', type: 'PDF', size: '4.1 MB', date: 'Feb 01, 2024' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Documents</h2>
                <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm">
                    <Upload size={16} className="mr-2" />
                    Upload File
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Folders */}
                {['Personal', 'Tax', 'Performance', 'Polices'].map((folder) => (
                    <div key={folder} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3 hover:shadow-md cursor-pointer transition-shadow">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <Folder size={24} />
                        </div>
                        <span className="font-medium text-gray-700">{folder}</span>
                    </div>
                ))}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Files</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                            <th className="px-6 py-3 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {docs.map((doc, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <FileText size={18} className="text-gray-400 mr-3" />
                                        <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.size}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Documents;
