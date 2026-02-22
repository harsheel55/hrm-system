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
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pb-12 animate-fade-in transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-slide-up">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight text-gradient">Document Vault</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Access your secure HR documents and personal records.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                type="text"
                                placeholder="Search all files..."
                                className="pl-10 w-64"
                            />
                        </div>
                        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
                            <Upload size={18} className="mr-2" />
                            Upload New File
                        </Button>
                    </div>
                </div>

                {/* --- Stats Grid --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {documentStats.map((stat, i) => (
                        <Card key={i} className="p-6 hover:shadow-md transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={22} className="group-hover:animate-pulse" />
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {stat.change}
                                </Badge>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-0.5">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Main Content: Folders & Files --- */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Folder Grid */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Folder size={20} className="text-amber-500" />
                                    Library
                                </h3>
                                <Button variant="link" className="text-blue-600">New Folder</Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {folders.map((folder, i) => (
                                    <Card key={i} className="p-5 hover:border-blue-300 dark:hover:border-blue-500/50 cursor-pointer transition-all">
                                        <div className={`w-10 h-10 rounded-xl ${folder.color} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                                            <Folder size={20} fill="currentColor" className="group-hover:animate-pulse" />
                                        </div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{folder.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">{folder.count} Files • {folder.size}</p>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Recent Files List */}
                        <Card className="overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Documents</h3>
                                <Button variant="ghost" size="sm">Filter By Date</Button>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>File Name</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentFiles.map((file, i) => (
                                            <TableRow key={i} className="group">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg ${file.type === 'PDF' ? 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'} group-hover:scale-110 transition-transform`}>
                                                            {file.type === 'PDF' ? <FileText size={18} className="group-hover:animate-pulse" /> : <FileCode size={18} className="group-hover:animate-pulse" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
                                                            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Application/{file.type}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-mono font-bold text-slate-500 dark:text-slate-400">{file.size}</TableCell>
                                                <TableCell className="font-bold">{file.date}</TableCell>
                                                <TableCell>
                                                    <Badge variant={file.status === 'Approved' ? 'default' : 'secondary'}>
                                                        {file.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Eye size={16} />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <Download size={16} />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </Card>
                    </div>

                    {/* --- Sidebar --- */}
                    <div className="space-y-6">
                        {/* Storage Health */}
                        <Card className="p-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
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
                                    <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div style={{ width: "24%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse-glow"></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">PDF Documents</span>
                                        <span className="text-slate-700 dark:text-slate-300">1.8 GB</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">Images & Media</span>
                                        <span className="text-slate-700 dark:text-slate-300">0.4 GB</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">Other Files</span>
                                        <span className="text-slate-700 dark:text-slate-300">0.2 GB</span>
                                    </div>
                                </div>
                            </div>
                            <Button className="w-full mt-8 bg-slate-900 hover:bg-slate-800">
                                Upgrade Storage
                            </Button>
                        </Card>

                        {/* Recent Activity Mini-Feed */}
                        <Card className="bg-slate-900 p-8 text-white border-0">
                            <h3 className="text-lg font-bold mb-6 relative z-10">Quick Support</h3>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6">
                                Having trouble finding a file? Contact your HR manager or check the FAQ.
                            </p>
                            <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                                View Help Center
                            </Button>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Documents;