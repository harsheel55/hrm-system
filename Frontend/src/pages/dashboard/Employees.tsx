import { useState } from 'react';
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    X,
    Save,
    Camera,
    User,
    AlertCircle
} from 'lucide-react';

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
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-900">Employees</h2>
                <button
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
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all shadow-sm group"
                >
                    <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
                    Add Employee
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 group">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-300 text-gray-700 hover:text-blue-600 transition-all">
                    <Filter size={18} className="mr-2" />
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="card-premium rounded-xl shadow-sm border border-gray-200 overflow-hidden hover-lift">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employees.map((person) => (
                            <tr key={person.id} className="hover:bg-gradient-to-r hover:from-blue-50/40 hover:to-purple-50/40 transition-all group">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 group-hover:scale-110 transition-transform">
                                            <img className="h-10 w-10 rounded-full ring-2 ring-white group-hover:ring-blue-300 transition-all" src={person.image} alt="" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{person.firstName} {person.lastName}</div>
                                            <div className="text-sm text-gray-500">{person.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{person.role}</div>
                                    <div className="text-sm text-gray-500">{person.department}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${person.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {person.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Employee Management Modal */}
            {showEmployeeModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="card-premium rounded-[2.5rem] w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl animate-scale-in custom-scrollbar">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {editingEmployee ? 'Update employee information' : 'Create a new employee record'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowEmployeeModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X size={20} className="text-gray-400" />
                                </button>
                            </div>

                            <form className="space-y-8">
                                {/* Profile Photo Section */}
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                                            {formData.profileImage ? (
                                                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User size={32} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                                        >
                                            <Camera size={16} />
                                        </button>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Profile Photo</h4>
                                        <p className="text-sm text-gray-500">Upload a professional headshot</p>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-bold text-gray-900">Personal Information</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                value={formData.firstName}
                                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                value={formData.lastName}
                                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                                            <input
                                                type="text"
                                                value={formData.emergencyContact}
                                                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Job Information */}
                                <div className="space-y-6">
                                    <h4 className="text-lg font-bold text-gray-900">Job Information</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Role/Position</label>
                                            <input
                                                type="text"
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                            <select
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                required
                                            >
                                                <option value="">Select department</option>
                                                <option value="Engineering">Engineering</option>
                                                <option value="Sales & Marketing">Sales & Marketing</option>
                                                <option value="Human Resources">Human Resources</option>
                                                <option value="Finance">Finance</option>
                                                <option value="Operations">Operations</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                value={formData.startDate}
                                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                                            <input
                                                type="text"
                                                value={formData.salary}
                                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                                placeholder="e.g. $60,000"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Work Schedule</label>
                                            <select
                                                value={formData.workSchedule}
                                                onChange={(e) => setFormData({ ...formData, workSchedule: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="Full-time">Full-time</option>
                                                <option value="Part-time">Part-time</option>
                                                <option value="Contract">Contract</option>
                                                <option value="Internship">Internship</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Manager</label>
                                            <input
                                                type="text"
                                                value={formData.manager}
                                                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="On Leave">On Leave</option>
                                                <option value="Terminated">Terminated</option>
                                                <option value="Pending">Pending</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Important Information */}
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle size={20} className="text-blue-600 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-blue-900 mb-2">Employee Guidelines</p>
                                            <ul className="text-xs text-blue-700 space-y-1">
                                                <li>• Ensure all required fields are completed accurately</li>
                                                <li>• Professional email addresses are required for system access</li>
                                                <li>• Emergency contacts will be used for urgent communications</li>
                                                <li>• New employees will receive onboarding materials via email</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEmployeeModal(false)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            // Handle form submission here
                                            console.log('Employee data:', formData);
                                            setShowEmployeeModal(false);
                                        }}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-xl hover:scale-105 font-medium transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={18} />
                                        {editingEmployee ? 'Update Employee' : 'Add Employee'}
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

export default Employees;
