import React from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    ShieldCheck,
    BarChart3,
    Clock,
    ArrowRight
} from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="bg-slate-50">
            {/* --- Hero Section --- */}
            <section className="pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                        <div className="sm:text-center lg:text-left lg:col-span-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                New: Automated Payroll Processing
                            </div>
                            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                Manage your team <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                    without the stress.
                                </span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0">
                                The all-in-one HR platform to recruit, onboard, and manage your workforce.
                                Built for modern companies who value their people.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/register" className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 group">
                                    Start your free trial
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link to="/login" className="flex items-center justify-center px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                                    Book a Demo
                                </Link>
                            </div>
                            <div className="mt-8 flex items-center gap-4 text-sm text-gray-500 justify-center lg:justify-start">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                        </div>
                                    ))}
                                </div>
                                <p>Trusted by <span className="font-bold text-gray-900">500+</span> growing teams</p>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="mt-16 lg:mt-0 lg:col-span-6 relative">
                            <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-3xl p-2 shadow-2xl transform rotate-2">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-inner flex items-center justify-center h-[400px]">
                                    {/* Simple Dashboard Mockup placeholder */}
                                    <div className="p-8 w-full h-full">
                                        <div className="flex gap-4 mb-8">
                                            <div className="h-12 w-12 rounded bg-blue-100 animate-pulse" />
                                            <div className="flex-1 space-y-3 py-1">
                                                <div className="h-4 bg-gray-100 rounded w-3/4" />
                                                <div className="h-4 bg-gray-100 rounded w-1/2" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-32 bg-slate-50 rounded-xl border border-dashed border-gray-300" />
                                            <div className="h-32 bg-slate-50 rounded-xl border border-dashed border-gray-300" />
                                        </div>
                                        <div className="mt-6 h-24 bg-blue-50 rounded-xl border border-blue-100 flex items-center justify-center text-blue-400">
                                            <BarChart3 size={40} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Features --- */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm">Features</h2>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Everything you need in one place
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-blue-600" />}
                            title="Employee Management"
                            desc="Centralized database for all employee records, documents, and history."
                        />
                        <FeatureCard
                            icon={<Clock className="w-6 h-6 text-blue-600" />}
                            title="Time & Attendance"
                            desc="Track hours, manage time-off requests, and monitor shifts effortlessly."
                        />
                        <FeatureCard
                            icon={<ShieldCheck className="w-6 h-6 text-blue-600" />}
                            title="Secure Payroll"
                            desc="Automated calculations and tax compliance with top-tier security."
                        />
                    </div>
                </div>
            </section>

            {/* --- Simple Footer --- */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="flex justify-center items-center gap-2 mb-6">
                        <Users className="text-blue-500 w-6 h-6" />
                        <span className="text-xl font-bold text-white uppercase tracking-wider">HRMFlow</span>
                    </div>
                    <p className="mb-8">Making people management human again.</p>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm">© 2024 HRMFlow Inc. All rights reserved.</p>
                        <div className="flex gap-6 text-sm">
                            <a href="#" className="hover:text-white transition">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{desc}</p>
        <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group cursor-pointer">
            Learn more <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
    </div>
);

export default LandingPage;