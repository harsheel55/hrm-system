import { useState } from 'react';
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Camera,
    User,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Employees = () => {
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        location: '',
        startDate: '',
        salary: '',
        status: 'Active',
        profileImage: '',
        address: '',
        emergencyContact: '',
        workSchedule: 'Full-time',
        manager: ''
    });

    const employees = [
        {
            id: 1,
            firstName: 'Jane',
            lastName: 'Cooper',
            email: 'jane.cooper@example.com',
            phone: '+1 (555) 123-4567',
            role: 'Regional Manager',
            department: 'Sales & Marketing',
            status: 'Active',
            location: 'New York, USA',
            startDate: '2020-03-15',
            salary: '$85,000',
            manager: 'John Smith',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
        },
        {
            id: 2,
            firstName: 'Cody',
            lastName: 'Fisher',
            email: 'cody.fisher@example.com',
            phone: '+1 (555) 234-5678',
            role: 'Product Directives Officer',
            department: 'Engineering',
            status: 'Active',
            location: 'San Francisco, CA',
            startDate: '2021-07-20',
            salary: '$92,000',
            manager: 'Sarah Johnson',
            image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
        },
        {
            id: 3,
            firstName: 'Esther',
            lastName: 'Howard',
            email: 'esther.howard@example.com',
            phone: '+1 (555) 345-6789',
            role: 'Forward Response Developer',
            department: 'Engineering',
            status: 'On Leave',
            location: 'Austin, TX',
            startDate: '2019-11-10',
            salary: '$78,000',
            manager: 'Sarah Johnson',
            image: 'https://images.unsplash.com/photo-1520813792240-56fc4a37b1a9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
        },
        {
            id: 4,
            firstName: 'Robert',
            lastName: 'Fox',
            email: 'robert.fox@example.com',
            phone: '+1 (555) 456-7890',
            role: 'HR Specialist',
            department: 'Human Resources',
            status: 'Active',
            location: 'Boston, MA',
            startDate: '2022-01-05',
            salary: '$65,000',
            manager: 'Lisa Chen',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Employees</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your team members</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingEmployee(null);
                        setFormData({
                            firstName: '',
                            lastName: '',
                            email: '',
                            phone: '',
                            role: '',
                            department: '',
                            location: '',
                            startDate: '',
                            salary: '',
                            status: 'Active',
                            profileImage: '',
                            address: '',
                            emergencyContact: '',
                            workSchedule: 'Full-time',
                            manager: ''
                        });
                        setShowEmployeeModal(true);
                    }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                    <Plus size={18} className="mr-2" />
                    Add Employee
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                    <Input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button variant="outline">
                    <Filter size={18} className="mr-2" />
                    Filter
                </Button>
            </div>

            {/* Table */}
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Employee</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((person) => (
                            <TableRow key={person.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-800">
                                            <img className="h-full w-full object-cover" src={person.image} alt="" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {person.firstName} {person.lastName}
                                            </div>
                                            <div className="text-sm text-muted-foreground">{person.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm text-slate-900 dark:text-white font-medium">{person.role}</div>
                                    <div className="text-sm text-muted-foreground">{person.department}</div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={person.status === 'Active' ? 'default' : 'secondary'} 
                                           className={person.status === 'Active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                                        {person.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical size={18} />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>View Details</DropdownMenuItem>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Employee Management Dialog */}
            <Dialog open={showEmployeeModal} onOpenChange={setShowEmployeeModal}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingEmployee ? 'Update employee information' : 'Create a new employee record'}
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-6">
                        {/* Profile Photo Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    {formData.profileImage ? (
                                        <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User size={32} className="text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    size="icon"
                                    className="absolute bottom-0 right-0 h-7 w-7 rounded-full"
                                >
                                    <Camera size={14} />
                                </Button>
                            </div>
                            <div>
                                <h4 className="font-semibold">Profile Photo</h4>
                                <p className="text-sm text-muted-foreground">Upload a professional headshot</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Personal Information</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                                    <Input
                                        id="emergencyContact"
                                        value={formData.emergencyContact}
                                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Job Information */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-lg">Job Information</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role/Position</Label>
                                    <Input
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Engineering">Engineering</SelectItem>
                                            <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                                            <SelectItem value="Human Resources">Human Resources</SelectItem>
                                            <SelectItem value="Finance">Finance</SelectItem>
                                            <SelectItem value="Operations">Operations</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="salary">Salary</Label>
                                    <Input
                                        id="salary"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        placeholder="e.g. $60,000"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="workSchedule">Work Schedule</Label>
                                    <Select
                                        value={formData.workSchedule}
                                        onValueChange={(value) => setFormData({ ...formData, workSchedule: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
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
                                    <Label htmlFor="manager">Manager</Label>
                                    <Input
                                        id="manager"
                                        value={formData.manager}
                                        onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => setFormData({ ...formData, status: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="On Leave">On Leave</SelectItem>
                                            <SelectItem value="Terminated">Terminated</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Important Information */}
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                                <p className="font-semibold mb-1">Employee Guidelines</p>
                                <ul className="text-xs space-y-0.5 ml-4 list-disc">
                                    <li>Ensure all required fields are completed accurately</li>
                                    <li>Professional email addresses are required for system access</li>
                                    <li>Emergency contacts will be used for urgent communications</li>
                                    <li>New employees will receive onboarding materials via email</li>
                                </ul>
                            </AlertDescription>
                        </Alert>
                    </form>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowEmployeeModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                console.log('Employee data:', formData);
                                setShowEmployeeModal(false);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                        >
                            {editingEmployee ? 'Update Employee' : 'Add Employee'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Employees;