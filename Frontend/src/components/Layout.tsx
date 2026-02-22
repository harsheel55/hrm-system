import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Users, Menu, X } from 'lucide-react';
import { AnimatedThemeToggler } from './ui/animated-theme-toggler';

const Layout = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div className="min-h-screen flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
            {/* --- Navigation --- */}
            <nav className="fixed w-full z-50 bg-card/80 backdrop-blur-md border-b border-border transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="bg-blue-600 p-2 rounded-lg">
                                    <Users className="text-white w-6 h-6" />
                                </div>
                                <span className="text-xl font-bold text-foreground tracking-tight">HRM<span className="text-blue-600">Flow</span></span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/#features" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition">Features</Link>
                            <Link to="/#stats" className="text-sm font-medium text-muted-foreground hover:text-blue-600 transition">Solutions</Link>
                            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-blue-600">Log in</Link>
                            <AnimatedThemeToggler className="inline-flex items-center justify-center" />
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
                    <div className="md:hidden bg-card border-t border-border transition-colors duration-300">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/#features" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-muted">Features</Link>
                            <Link to="/#stats" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-muted">Solutions</Link>
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-blue-600 hover:bg-muted">Log in</Link>
                            <div className="px-3 py-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">Theme</span>
                                <AnimatedThemeToggler />
                            </div>
                            <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">Get Started Free</Link>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-grow pt-16">
                <Outlet />
            </main>

            <footer className="bg-card text-foreground py-6 mt-auto border-t border-border transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                    &copy; {new Date().getFullYear()} HRM Service System. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Layout;
