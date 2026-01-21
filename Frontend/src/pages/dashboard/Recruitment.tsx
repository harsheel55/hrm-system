import { Briefcase, MapPin, Users } from 'lucide-react';

const Recruitment = () => {
    const jobs = [
        { title: 'Senior Frontend Developer', type: 'Full-time', location: 'Remote', candidates: 12 },
        { title: 'Product Designer', type: 'Full-time', location: 'New York, NY', candidates: 8 },
        { title: 'Marketing Manager', type: 'Contract', location: 'London, UK', candidates: 24 },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recruitment</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
                    Post New Job
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Briefcase size={20} />
                            </div>
                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{job.type}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                            <MapPin size={14} className="mr-1" />
                            {job.location}
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-600">
                                <Users size={16} className="mr-2 text-gray-400" />
                                <span className="font-bold text-gray-900 mr-1">{job.candidates}</span> Candidates
                            </div>
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-800">Manage</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Recruitment;
