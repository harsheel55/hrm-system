import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Users, Menu, X } from 'lucide-react';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen flex flex-col font-sans bg-slate-50">
            {/* --- Navigation --- */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Users className="text-white w-6 h-6" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 tracking-tight">HRM<span className="text-blue-600">Flow</span></span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Features</Link>
                            <Link to="/#stats" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">Solutions</Link>
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">Log in</Link>
                            <Link to="/register" className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                                Get Started Free
                            </Link>
                        </div>

                        {/* Mobile Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X /> : <Menu />}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/#features" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Features</Link>
                            <Link to="/#stats" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Solutions</Link>
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Log in</Link>
                            <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">Get Started Free</Link>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-grow pt-16">
                <Outlet />
            </main>

            <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                    &copy; {new Date().getFullYear()} HRM Service System. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
