import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    ArrowLeft,
    ShieldCheck,
    Zap,
    Star
} from 'lucide-react';

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-white flex">

            {/* --- Left Side: Branding & Info (Hidden on Mobile) --- */}
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-12 flex-col justify-between text-white relative overflow-hidden">
                {/* Abstract background shapes */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-blue-500 rounded-full opacity-50 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-96 h-96 bg-indigo-600 rounded-full opacity-50 blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-12">
                        <div className="bg-white p-1.5 rounded-lg">
                            <ShieldCheck className="text-blue-600 w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">HRM<span className="opacity-80">Flow</span></span>
                    </div>

                    <h2 className="text-4xl font-bold leading-tight mb-6">
                        Join 500+ companies <br />
                        optimizing their workforce.
                    </h2>

                    <div className="space-y-6">
                        <BenefitItem
                            icon={<Zap className="w-5 h-5" />}
                            title="Quick Setup"
                            desc="Get your dashboard ready in less than 2 minutes."
                        />
                        <BenefitItem
                            icon={<CheckCircle2 className="w-5 h-5" />}
                            title="Compliance Ready"
                            desc="Built-in tax and labor law compliance features."
                        />
                        <BenefitItem
                            icon={<Star className="w-5 h-5" />}
                            title="Top Rated Support"
                            desc="24/7 access to our dedicated HR specialists."
                        />
                    </div>
                </div>

                <div className="relative z-10 bg-blue-700/30 p-6 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
                    <p className="italic text-blue-100 mb-4">
                        "Switching to HRMFlow saved our operations team 15 hours a week on payroll alone. It's a game changer."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden border-2 border-blue-400">
                            <img src="https://i.pravatar.cc/100?img=32" alt="Avatar" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Sarah Jenkins</p>
                            <p className="text-xs text-blue-200">HR Director, TechCorp</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Right Side: Registration Form --- */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-20 py-12 relative">
                <div className="absolute top-8 right-8 lg:left-20">
                    <Link to="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to home
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
                        <p className="mt-2 text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Work Email</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all outline-none"
                                    placeholder="john@company.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all outline-none"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Must be at least 8 characters with a number and a symbol.
                            </p>
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    required
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-gray-600">
                                    I agree to the{' '}
                                    <a href="#" className="text-blue-600 font-medium hover:underline">Terms of Service</a> and{' '}
                                    <a href="#" className="text-blue-600 font-medium hover:underline">Privacy Policy</a>.
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98]"
                        >
                            Create My Account
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-400 uppercase tracking-widest">
                        No credit card required for trial
                    </p>
                </div>
            </div>
        </div>
    );
};

/* Helper Component for Benefits */
const BenefitItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-500/50 rounded-lg flex items-center justify-center">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-blue-100 text-sm">{desc}</p>
        </div>
    </div>
);

export default RegisterPage;