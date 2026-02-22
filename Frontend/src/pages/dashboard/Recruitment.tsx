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
    Send,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

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
        <div className="min-h-screen bg-background text-foreground pb-12 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">Talent Acquisition</h1>
                        <p className="text-muted-foreground text-sm font-medium mt-1">Source, track, and hire the best talent for your teams.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden lg:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                type="text"
                                placeholder="Search candidates..."
                                className="pl-10 w-64 bg-background text-foreground border-border placeholder:text-muted-foreground"
                            />
                        </div>
                        <Button
                            onClick={() => setShowJobModal(true)}
                            className="rounded-2xl shadow-lg"
                        >
                            <Plus size={18} className="mr-2" />
                            Post New Job
                        </Button>
                    </div>
                </div>

                {/* --- Insights --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {recruitmentStats.map((stat, i) => (
                        <Card key={i} className="rounded-[2rem] p-6 border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all group cursor-pointer">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={22} />
                                </div>
                                {stat.change && (
                                    <Badge variant="secondary" className="text-[10px] font-bold px-2 py-1 rounded-lg">
                                        {stat.change}
                                    </Badge>
                                )}
                            </div>
                            <h3 className="text-2xl font-black text-foreground">{stat.value}</h3>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- Job Listings --- */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <Briefcase size={20} className="text-primary" />
                                Active Openings
                            </h3>
                            <Button variant="link" className="text-sm font-bold text-primary h-fit p-0">View All Positions</Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {jobOpenings.map((job, idx) => (
                                <Card key={idx} className="rounded-[2rem] p-6 border-border bg-card text-card-foreground hover:shadow-xl transition-all group cursor-pointer border-b-4 border-b-transparent hover:border-b-primary">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${job.urgency === 'High' ? 'bg-destructive' : 'bg-amber-400'}`}></span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{job.urgency} Priority</span>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground transition-colors h-fit w-fit p-0"><MoreHorizontal size={20} /></Button>
                                    </div>

                                    <h4 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{job.title}</h4>

                                    <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mb-6">
                                        <div className="flex items-center gap-1">
                                            <Globe size={14} className="text-muted-foreground" />
                                            {job.location}
                                        </div>
                                        <span>•</span>
                                        <div>{job.type}</div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                                                    <img src={`https://i.pravatar.cc/100?img=${idx + i}`} alt="avatar" />
                                                </div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                                                +{job.candidates}
                                            </div>
                                        </div>
                                        <Button className="px-4 py-2 rounded-xl h-fit" variant="secondary">
                                            Manage
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* --- Recent Applicants Sidebar --- */}
                    <div className="space-y-6">
                        <Card className="rounded-[2.5rem] border-border bg-card text-card-foreground shadow-sm p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-bold text-foreground">New Applicants</h3>
                                <Filter size={18} className="text-muted-foreground cursor-pointer hover:text-primary transition-colors" />
                            </div>

                            <div className="space-y-6">
                                {recentApplications.map((app, i) => (
                                    <div key={i} className="flex items-center justify-between group cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-muted flex items-center justify-center font-bold text-muted-foreground text-sm shadow-sm">
                                                {app.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{app.name}</p>
                                                <p className="text-[11px] font-medium text-muted-foreground">{app.position}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[10px] font-bold px-2 py-1 rounded-lg mb-1 ${app.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                app.status === 'Interview' ? 'bg-purple-100 text-purple-700' : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {app.status}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground font-bold">{app.applied}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button variant="secondary" className="w-full mt-8 py-3 rounded-2xl">
                                View Full Pipeline
                            </Button>
                        </Card>

                        {/* Quick Tips / Meta Info */}
                        <Card className="rounded-[2.5rem] p-8 bg-card text-card-foreground border-border relative overflow-hidden">
                            <div className="relative z-10">
                                <TrendingUp className="text-primary mb-4" size={24} />
                                <h4 className="text-lg font-bold mb-2">Hiring Velocity</h4>
                                <p className="text-muted-foreground text-xs leading-relaxed mb-4">Your average time-to-hire is <span className="text-foreground font-bold">18 days</span>. This is 4 days faster than the industry average.</p>
                                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div className="w-3/4 h-full bg-primary"></div>
                                </div>
                            </div>
                            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                        </Card>
                    </div>

                </div>
            </div>

            {/* Post New Job Modal */}
            <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
                <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Post New Position</DialogTitle>
                        <DialogDescription>
                            Create a new job opening to attract qualified candidates.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        className="space-y-8"
                        onSubmit={(e) => {
                            e.preventDefault();
                            console.log('Job posting submitted:', formData);
                            setShowJobModal(false);
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
                    >
                        <div className="space-y-6">
                            <h4 className="text-lg font-bold">Basic Information</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Job Title *</Label>
                                    <Input
                                        value={formData.jobTitle}
                                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                        placeholder="e.g. Senior Frontend Developer"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Department *</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Engineering">Engineering</SelectItem>
                                            <SelectItem value="Design">Design</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Sales">Sales</SelectItem>
                                            <SelectItem value="Product">Product</SelectItem>
                                            <SelectItem value="HR">HR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label>Location *</Label>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g. Remote, New York, NY"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Job Type *</Label>
                                    <Select
                                        value={formData.jobType}
                                        onValueChange={(value) => setFormData({ ...formData, jobType: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select job type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Full-time">Full-time</SelectItem>
                                            <SelectItem value="Part-time">Part-time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Experience Level</Label>
                                    <Select
                                        value={formData.experience}
                                        onValueChange={(value) => setFormData({ ...formData, experience: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Entry Level">Entry Level</SelectItem>
                                            <SelectItem value="Mid Level">Mid Level</SelectItem>
                                            <SelectItem value="Senior Level">Senior Level</SelectItem>
                                            <SelectItem value="Lead/Manager">Lead/Manager</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Salary Range</Label>
                                    <Input
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        placeholder="e.g. $80,000 - $120,000"
                                    />
                                </div>

                                <div className="flex items-center gap-3 pt-6">
                                    <Switch
                                        checked={formData.urgent}
                                        onCheckedChange={(checked) => setFormData({ ...formData, urgent: checked })}
                                    />
                                    <span className="text-sm font-medium">Mark as Urgent</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-lg font-bold">Job Details</h4>

                            <div className="space-y-2">
                                <Label>Job Description *</Label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Provide a comprehensive description of the role, responsibilities, and what the candidate will be doing..."
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Requirements *</Label>
                                <Textarea
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    placeholder="List the required qualifications, skills, and experience..."
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Benefits & Perks</Label>
                                <Textarea
                                    value={formData.benefits}
                                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                    placeholder="Highlight the benefits, perks, and company culture..."
                                    rows={3}
                                />
                            </div>
                        </div>

                        <Alert className="bg-amber-50 border-amber-200">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <AlertDescription>
                                <h4 className="font-semibold text-amber-900 mb-1">Posting Guidelines</h4>
                                <ul className="text-xs text-amber-700 space-y-1">
                                    <li>• Ensure job description is clear and comprehensive</li>
                                    <li>• Include specific requirements to attract qualified candidates</li>
                                    <li>• Competitive salary ranges increase application rates</li>
                                    <li>• Urgent positions receive priority visibility</li>
                                </ul>
                            </AlertDescription>
                        </Alert>

                        <DialogFooter className="gap-3">
                            <Button variant="ghost" type="button" onClick={() => setShowJobModal(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="flex items-center gap-2">
                                <Send size={18} />
                                Post Job Opening
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Recruitment;