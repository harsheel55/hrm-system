import {
    FileText,
    Upload,
    Folder,
    AlertCircle,
    Download,
    Search,
    FileCode,
    PieChart,
    HardDrive,
    Eye
} from 'lucide-react';

const Documents = () => {
    const documentStats = [
        { label: 'Total Files', value: '248', change: '+12', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Downloads', value: '1,204', change: '+14%', icon: Download, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Pending Signature', value: '03', change: 'Urgent', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Cloud Usage', value: '24%', change: '2.4GB', icon: HardDrive, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const folders = [
        { name: 'Personal', count: 45, size: '124 MB', color: 'bg-blue-500' },
        { name: 'Tax Docs', count: 12, size: '45 MB', color: 'bg-amber-500' },
        { name: 'Performance', count: 28, size: '89 MB', color: 'bg-emerald-500' },
        { name: 'Contracts', count: 8, size: '234 MB', color: 'bg-indigo-500' },
    ];

    const recentFiles = [
        { name: 'Employment_Contract_2024.pdf', type: 'PDF', size: '2.4 MB', date: 'Jan 12', status: 'Approved' },
        { name: 'Onboarding_Checklist.docx', type: 'DOCX', size: '156 KB', date: 'Jan 15', status: 'Approved' },
        { name: 'Policy_Manual_v2.pdf', type: 'PDF', size: '4.1 MB', date: 'Feb 01', status: 'Approved' },
        { name: 'Performance_Review.pdf', type: 'PDF', size: '1.2 MB', date: 'Feb 10', status: 'Pending' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-12">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                
                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Document Vault</h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">Access your secure HR documents and personal records.</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search all files..."
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none w-64 transition-all"
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 font-bold text-sm">
                            <Upload size={18} />
                            Upload New File
                        </button>
                    </div>
                </div>

                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {documentStats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.change.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-0.5">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- Main Content: Folders & Files --- */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Folder Grid */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <Folder size={20} className="text-amber-500" />
                                    Library
                                </h3>
                                <button className="text-sm font-bold text-blue-600">New Folder</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {folders.map((folder, i) => (
                                    <div key={i} className="bg-white border border-slate-100 rounded-3xl p-5 hover:border-blue-200 transition-all cursor-pointer group">
                                        <div className={`w-10 h-10 rounded-xl ${folder.color} flex items-center justify-center text-white shadow-lg mb-4`}>
                                            <Folder size={20} fill="currentColor" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{folder.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{folder.count} Files • {folder.size}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Files List */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Recent Documents</h3>
                                <button className="text-sm font-bold text-slate-400 hover:text-blue-600">Filter By Date</button>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                                            <th className="px-4 py-3">File Name</th>
                                            <th className="px-4 py-3">Size</th>
                                            <th className="px-4 py-3">Date</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {recentFiles.map((file, i) => (
                                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${file.type === 'PDF' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                                                            {file.type === 'PDF' ? <FileText size={18} /> : <FileCode size={18} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{file.name}</p>
                                                            <p className="text-[10px] font-medium text-slate-400">Application/{file.type}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5 text-xs font-mono font-bold text-slate-500">{file.size}</td>
                                                <td className="px-4 py-5 text-xs font-bold text-slate-700">{file.date}</td>
                                                <td className="px-4 py-5">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                                                        file.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                        {file.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all shadow-sm"><Eye size={16}/></button>
                                                        <button className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-white rounded-lg transition-all shadow-sm"><Download size={16}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* --- Sidebar --- */}
                    <div className="space-y-6">
                        {/* Storage Health */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <PieChart size={20} className="text-indigo-600" />
                                Storage Health
                            </h3>
                            <div className="space-y-6">
                                <div className="relative pt-1">
                                    <div className="flex mb-2 items-center justify-between">
                                        <div>
                                            <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-50">
                                                24% Used
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold inline-block text-slate-400 uppercase">
                                                2.4 / 10 GB
                                            </span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100">
                                        <div style={{ width: "24%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">PDF Documents</span>
                                        <span className="text-slate-700">1.8 GB</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">Images & Media</span>
                                        <span className="text-slate-700">0.4 GB</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">Other Files</span>
                                        <span className="text-slate-700">0.2 GB</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all">
                                Upgrade Storage
                            </button>
                        </div>

                        {/* Recent Activity Mini-Feed */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                            <h3 className="text-lg font-bold mb-6 relative z-10">Quick Support</h3>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6 relative z-10">
                                Having trouble finding a file? Contact your HR manager or check the FAQ.
                            </p>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-xs font-bold transition-all border border-white/10 relative z-10">
                                View Help Center
                            </button>
                            {/* Decorative element */}
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Documents;