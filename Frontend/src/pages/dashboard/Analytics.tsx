import { TrendingUp, Users, UserMinus, Award } from 'lucide-react';

const Analytics = () => {
    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">HR Analytics</h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <AnalyticsCard title="Total Headcount" value="1,284" change="+12%" icon={<Users size={20} />} color="blue" />
                <AnalyticsCard title="Turnover Rate" value="4.2%" change="-1.1%" icon={<UserMinus size={20} />} color="red" />
                <AnalyticsCard title="Offer Acceptance" value="88%" change="+3.2%" icon={<TrendingUp size={20} />} color="green" />
                <AnalyticsCard title="Avg Tenure" value="3.2 Yrs" change="+0.4" icon={<Award size={20} />} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Placeholder Chart 1 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Hiring vs Attrition</h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-4">
                        {[40, 60, 45, 70, 50, 65, 55, 80, 60, 75, 50, 90].map((h, i) => (
                            <div key={i} className="w-full bg-blue-100 rounded-t-sm relative group">
                                <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-sm transition-all hover:bg-blue-600" style={{ height: `${h}%` }}></div>
                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">M{i + 1}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Placeholder Chart 2 */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Department Distribution</h3>
                    <div className="space-y-4">
                        <DistributionBar label="Engineering" value={45} color="bg-blue-500" />
                        <DistributionBar label="Sales & Marketing" value={25} color="bg-green-500" />
                        <DistributionBar label="Product" value={15} color="bg-purple-500" />
                        <DistributionBar label="Customer Support" value={10} color="bg-yellow-500" />
                        <DistributionBar label="HR & Admin" value={5} color="bg-red-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const AnalyticsCard = ({ title, value, change, icon, color }: { title: string, value: string, change: string, icon: React.ReactNode, color: string }) => {
    const isPositive = change.startsWith('+');
    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
                    {icon}
                </div>
            </div>
            <div className="mt-2 flex items-center text-sm">
                <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {change}
                </span>
                <span className="text-gray-400 ml-2">vs last month</span>
            </div>
        </div>
    );
};

const DistributionBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div>
        <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="text-gray-500">{value}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
            <div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }}></div>
        </div>
    </div>
);

export default Analytics;
