import { useState } from 'react';
import {
    Briefcase,
    Users,
    Calendar,
    CheckCircle,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Globe,
    TrendingUp,
    X,
    Send,
    MapPin,
    DollarSign,
    Clock,
    AlertCircle
} from 'lucide-react';

const Recruitment = () => {
    const [showJobModal, setShowJobModal] = useState(false);
    const [formData, setFormData] = useState({
        jobTitle: '',
        department: '',
        location: '',
        jobType: 'Full-time',
        experience: '',
        salary: '',
        description: '',
        requirements: '',
        benefits: '',
        urgent: false
    });

    const recruitmentStats = [
        { label: 'Active Openings', value: '12', change: '+2', icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'New Applicants', value: '156', change: '+24', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Interviews', value: '08', change: 'Today', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Hired (MoM)', value: '88%', icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    const jobOpenings = [
        { title: 'Senior Frontend Developer', type: 'Full-time', location: 'Remote', candidates: 12, posted: '2d ago', urgency: 'High' },
        { title: 'Product Designer', type: 'Full-time', location: 'New York, NY', candidates: 8, posted: '1w ago', urgency: 'Medium' },
        { title: 'Marketing Manager', type: 'Contract', location: 'London, UK', candidates: 24, posted: '3d ago', urgency: 'Low' },
        { title: 'Backend Engineer', type: 'Full-time', location: 'Remote', candidates: 18, posted: '5d ago', urgency: 'High' },
    ];

    const recentApplications = [
        { name: 'Sarah Johnson', position: 'Senior Frontend', applied: '2h ago', status: 'New', color: 'blue' },
        { name: 'Michael Chen', position: 'Product Designer', applied: '5h ago', status: 'Reviewing', color: 'amber' },
        { name: 'Emily Davis', position: 'Marketing Manager', applied: '1d ago', status: 'Interview', color: 'purple' },
        { name: 'James Wilson', position: 'Backend Engineer', applied: '2d ago', status: 'Shortlisted', color: 'emerald' },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 pb-12 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Talent Acquisition</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Source, track, and hire the best talent for your teams.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none w-64 transition-all text-slate-600 dark:text-slate-200"
                            />
                        </div>
                        <button
                            onClick={() => setShowJobModal(true)}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 font-bold text-sm"
                        >
                            <Plus size={18} />
                            Post New Job
                        </button>
                    </div>
                </div>

                {/* --- Insights --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {recruitmentStats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                {stat.change && (
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${stat.change.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                                        {stat.change}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Job Listings --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <Briefcase size={20} className="text-indigo-600" />
                                Active Openings
                            </h3>
                            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">View All Positions</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {jobOpenings.map((job, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all group cursor-pointer border-b-4 border-b-transparent hover:border-b-indigo-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${job.urgency === 'High' ? 'bg-red-500' : 'bg-amber-400'}`}></span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.urgency} Priority</span>
                                        </div>
                                        <button className="text-slate-300 group-hover:text-slate-600 transition-colors"><MoreHorizontal size={20} /></button>
                                    </div>

                                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{job.title}</h4>

                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Globe size={14} className="text-slate-300" />
                                            {job.location}
                                        </div>
                                        <span>•</span>
                                        <div>{job.type}</div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?img=${idx + i}`} alt="avatar" />
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                                +{job.candidates}
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all">
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- Recent Applicants Sidebar --- */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">New Applicants</h3>
                                <Filter size={18} className="text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" />
                            </div>

                            <div className="space-y-6">
                                {recentApplications.map((app, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 text-sm shadow-sm`}>
                                                {app.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{app.name}</p>
                                                <p className="text-[11px] font-medium text-slate-400">{app.position}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[10px] font-bold px-2 py-1 rounded-lg mb-1 ${app.status === 'New' ? 'bg-blue-50 text-blue-600' :
                                                app.status === 'Interview' ? 'bg-purple-50 text-purple-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {app.status}
                                            </div>
                                            <p className="text-[10px] text-slate-300 font-bold">{app.applied}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-8 py-3 bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-2xl text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800">
                                View Full Pipeline
                            </button>
                        </div>

                        {/* Quick Tips / Meta Info */}
                        <div className="bg-indigo-900 dark:bg-slate-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <TrendingUp className="text-indigo-300 mb-4" size={24} />
                                <h4 className="text-lg font-bold mb-2">Hiring Velocity</h4>
                                <p className="text-indigo-200 text-xs leading-relaxed mb-4">Your average time-to-hire is <span className="text-white font-bold">18 days</span>. This is 4 days faster than the industry average.</p>
                                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-indigo-400"></div>
                                </div>
                            </div>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Post New Job Modal */}
            {showJobModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-slate-700">
                        <div className="p-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Post New Position</h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Create a new job opening to attract qualified candidates.</p>
                                </div>
                                <button
                                    onClick={() => setShowJobModal(false)}
                                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form className="space-y-8">
                                {/* Basic Information */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Basic Information</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Job Title *</label>
                                            <input
                                                type="text"
                                                value={formData.jobTitle}
                                                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                                placeholder="e.g. Senior Frontend Developer"
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 dark:text-white"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Department *</label>
                                            <select
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 dark:text-white"
                                                required
                                            >
                                                <option value="">Select department</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Design">Design</option>
                                                <option value="Marketing">Marketing</option>
                                                <option value="Sales">Sales</option>
                                                <option value="Product">Product</option>
                                                <option value="HR">HR</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="relative">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Location *</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    placeholder="e.g. Remote, New York, NY"
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Job Type *</label>
                                            <select
                                                value={formData.jobType}
                                                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                                className="w-full p-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 dark:text-white"
                                                required
                                            >
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Internship">Internship</option>
                                            </select>
                                        </div>

                                        <div className="relative">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Experience Level</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <select
                                                    value={formData.experience}
                                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 dark:text-white"
                                                >
                                                    <option value="">Select level</option>
                                                    <option value="Entry Level">Entry Level</option>
                                                    <option value="Mid Level">Mid Level</option>
                                                    <option value="Senior Level">Senior Level</option>
                                                    <option value="Lead/Manager">Lead/Manager</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Salary Range</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={formData.salary}
                                                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                                    placeholder="e.g. $80,000 - $120,000"
                                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-bold text-slate-700 dark:text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.urgent}
                                                    onChange={(e) => setFormData({ ...formData, urgent: e.target.checked })}
                                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                                                />
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Mark as Urgent</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Details */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Job Details</h4>

                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Job Description *</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Provide a comprehensive description of the role, responsibilities, and what the candidate will be doing..."
                                            rows={4}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-700 border-none rounded-3xl focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 dark:text-white resize-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Requirements *</label>
                                        <textarea
                                            value={formData.requirements}
                                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                            placeholder="List the required qualifications, skills, and experience..."
                                            rows={3}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-700 border-none rounded-3xl focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 dark:text-white resize-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Benefits & Perks</label>
                                        <textarea
                                            value={formData.benefits}
                                            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                            placeholder="Highlight the benefits, perks, and company culture..."
                                            rows={3}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-700 border-none rounded-3xl focus:ring-2 focus:ring-indigo-500 font-medium text-slate-700 dark:text-white resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Important Information */}
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle size={20} className="text-indigo-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-2">Posting Guidelines</p>
                                            <ul className="text-xs text-indigo-700 dark:text-indigo-300 space-y-1">
                                                <li>• Ensure job description is clear and comprehensive</li>
                                                <li>• Include specific requirements to attract qualified candidates</li>
                                                <li>• Competitive salary ranges increase application rates</li>
                                                <li>• Urgent positions receive priority visibility</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowJobModal(false)}
                                        className="flex-1 px-8 py-4 text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 font-bold transition-all order-2 sm:order-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Handle form submission here
                                            console.log('Job posting submitted:', formData);
                                            setShowJobModal(false);
                                            // Reset form
                                            setFormData({
                                                jobTitle: '',
                                                department: '',
                                                location: '',
                                                jobType: 'Full-time',
                                                experience: '',
                                                salary: '',
                                                description: '',
                                                requirements: '',
                                                benefits: '',
                                                urgent: false
                                            });
                                        }}
                                        className="flex-[2] px-8 py-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 font-bold transition-all shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 flex items-center justify-center gap-3 order-1 sm:order-2"
                                    >
                                        <Send size={18} />
                                        Post Job Opening
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

export default Recruitment;