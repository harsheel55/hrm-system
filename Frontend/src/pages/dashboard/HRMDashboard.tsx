import { useState, useEffect } from 'react';
import {
  Home,
  CalendarCheck,
  Palmtree,
  Clock,
  Target,
  Book,
  Folder,
  MoreHorizontal,
  Settings,
  FileText,
  MessageSquare,
  Search,
  Bell,
  Settings as SettingsIcon,
  Grid3x3,
  Moon,
  CheckCircle,
  AlertCircle,
  Filter,
  HelpCircle,
  Umbrella,
  Calendar
} from 'lucide-react';

const HRMDashboard = () => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('hrm_timeTracker_elapsedSeconds');
    const parsed = saved ? Number(saved) : NaN;
    if (Number.isFinite(parsed) && parsed >= 0) return parsed;
    return 6 * 60 * 60 + 45 * 60 + 51;
  });
  const [isTracking, setIsTracking] = useState<boolean>(() => {
    const saved = localStorage.getItem('hrm_timeTracker_isTracking');
    return saved === 'true';
  });
  const [activeTab, setActiveTab] = useState('Activities');
  const [activeNav, setActiveNav] = useState('My Space');

  useEffect(() => {
    localStorage.setItem('hrm_timeTracker_elapsedSeconds', String(elapsedSeconds));
  }, [elapsedSeconds]);

  useEffect(() => {
    localStorage.setItem('hrm_timeTracker_isTracking', String(isTracking));
  }, [isTracking]);

  useEffect(() => {
    if (!isTracking) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isTracking]);

  const formatElapsed = (totalSeconds: number) => {
    const safe = Number.isFinite(totalSeconds) && totalSeconds >= 0 ? totalSeconds : 0;
    const hours = Math.floor(safe / 3600);
    const minutes = Math.floor((safe % 3600) / 60);
    const seconds = safe % 60;
    return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
  };

  const sidebarItems = [
    { icon: Home, label: 'Home', active: true },
    { icon: CalendarCheck, label: 'Attendance' },
    { icon: Palmtree, label: 'Leave' },
    { icon: Clock, label: 'Timesheet' },
    { icon: Target, label: 'Performance' },
    { icon: Book, label: 'LMS' },
    { icon: Folder, label: 'Cases' },
    { icon: MoreHorizontal, label: 'More' }
  ];

  const bottomSidebarItems = [
    { icon: Settings, label: 'Settings' },
    { icon: FileText, label: 'Reports' },
    { icon: MessageSquare, label: 'AI Assistant' }
  ];

  const tabs = [
    'Activities', 'Feeds', 'Career History', 'Profile', 'Approvals',
    'Attendance', 'Leave', 'Time Logs', 'Feedback', 'Cases', 'Related Data', '...'
  ];

  const activities = [
    {
      id: 1,
      type: 'timesheet',
      title: 'ZY198 - Christine Spalding',
      description: 'has made a request for Timesheet',
      time: '23-May-2024 04:14 PM',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Check-out reminder',
      description: 'Your shift has already ended',
      time: '06:45 Hrs',
      icon: Clock
    },
    {
      id: 3,
      type: 'reminder',
      title: 'Check-out reminder',
      description: 'Your shift has already ended',
      time: '05:35 Hrs',
      icon: Clock
    }
  ];

  const holidays = [
    { name: 'Native American day', date: '2-Jun, Sunday', type: 'regular' },
    { name: 'Bakrid', date: '17-Jun, Monday', type: 'restricted' },
    { name: 'US Independence Day', date: '4-Jul, Thursday', type: 'regular' }
  ];

  const weekDays = [
    { day: 'Sun', date: 26, type: 'weekend' },
    { day: 'Mon', date: 27, type: 'active', status: 'Remote In', hours: '06:45 Hrs' },
    { day: 'Tue', date: 28, type: 'regular' },
    { day: 'Wed', date: 29, type: 'regular' },
    { day: 'Thu', date: 30, type: 'regular' },
    { day: 'Fri', date: 31, type: 'regular' },
    { day: 'Sat', date: 1, type: 'weekend' }
  ];

  return (
    <div className="h-screen flex flex-col bg-[#f5f6f8]">
      {/* Top Navigation Bar */}
      <header className="bg-[#2c3e50] h-[60px] flex items-center justify-between px-6 text-white">
        <div className="flex items-center gap-8">
          {/* Company Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded"></div>
            <span className="font-bold text-lg">YLKER</span>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="flex gap-6">
            {['My Space', 'Team', 'Organization'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveNav(tab)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeNav === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Search className="w-5 h-5 cursor-pointer hover:text-gray-300" />
          <div className="relative">
            <Bell className="w-5 h-5 cursor-pointer hover:text-gray-300" />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">1</span>
          </div>
          <SettingsIcon className="w-5 h-5 cursor-pointer hover:text-gray-300" />
          <div className="w-8 h-8 bg-gray-400 rounded-full cursor-pointer"></div>
          <Grid3x3 className="w-5 h-5 cursor-pointer hover:text-gray-300" />
        </div>
      </header>

      {/* Secondary Navigation Bar */}
      <div className="bg-white h-[45px] border-b border-gray-200 flex items-center px-6">
        {['Overview', 'Dashboard', 'Calendar'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === 'Dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-[50px] bg-[#1e3a5f] flex flex-col items-center py-4">
          {/* Main Navigation */}
          <div className="flex-1 flex flex-col gap-4">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                className={`p-2 rounded-lg transition-all ${
                  item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-200/80 hover:text-white hover:bg-white/10'
                }`}
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-4">
            {bottomSidebarItems.map((item, index) => (
              <button
                key={index}
                className="p-2 text-slate-200/80 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                title={item.label}
              >
                <item.icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </aside>

        {/* Employee Profile Card */}
        <div className="w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto">
          <div
            className="rounded-t-2xl h-32 relative overflow-hidden"
            style={{
              backgroundColor: '#fbf2df',
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 200%27%3E%3Cpath d=%27M0 120 C 200 80 400 160 600 120 C 800 80 1000 160 1200 120 L 1200 200 L 0 200 Z%27 fill=%27%23f3e2c8%27/%3E%3Cpath d=%27M0 140 C 200 100 400 180 600 140 C 800 100 1000 180 1200 140 L 1200 200 L 0 200 Z%27 fill=%27%23ead3b0%27 fill-opacity=%270.8%27/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                <div className="w-full h-full bg-gray-300 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-xs text-gray-500 font-medium">ID: ZY198</p>
            <h3 className="font-bold text-gray-900 text-lg">Christine Spalding</h3>
            <p className="text-sm text-gray-600">HR Manager</p>
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                isTracking ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {isTracking ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <AlertCircle className="w-3 h-3 mr-1" />
              )}
              {isTracking ? 'Remote In' : 'Checked Out'}
            </div>
          </div>

          {/* Time Tracker */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4">
            <div className="text-center">
              <div className="text-2xl font-mono text-gray-900 mb-2">{formatElapsed(elapsedSeconds)}</div>
              <button
                onClick={() => setIsTracking((prev) => !prev)}
                className={`px-4 py-2 border rounded-lg transition-colors text-sm font-medium ${
                  isTracking
                    ? 'border-[#ef4444] text-[#ef4444] hover:bg-red-50'
                    : 'border-[#14b8a6] text-[#14b8a6] hover:bg-teal-50'
                }`}
              >
                {isTracking ? 'Check-out' : 'Check-in'}
              </button>
            </div>
          </div>

          {/* Reporting Structure */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Reporting To</h4>
            <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60" 
                  alt="Manager" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">ID: ZY190</p>
                <p className="text-sm font-medium text-gray-900">Jones Terri</p>
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Yet to check-in
                </p>
              </div>
            </div>
          </div>

          {/* Reportees */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Reportees</h4>
            </div>
            <div className="space-y-2">
              {[
                { id: 'HR204', name: 'Randall Gladstone', status: 'Remote In', statusColor: 'green' },
                { id: 'ZY181', name: 'Rodriguez Sue', status: 'On Duty', statusColor: 'gray' },
                { id: '1237', name: 'Mary Hansley', status: 'Yet to check-in', statusColor: 'red' }
              ].map((reportee, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-500">{reportee.id} -</span>
                    <span className="text-gray-900 ml-1">{reportee.name}</span>
                  </div>
                  <span className={`text-xs ${
                    reportee.statusColor === 'green' ? 'text-green-600' :
                    reportee.statusColor === 'gray' ? 'text-gray-600' : 'text-red-600'
                  }`}>
                    {reportee.status}
                  </span>
                </div>
              ))}
              <button className="text-teal-600 text-sm font-medium hover:text-teal-700">
                +5 More
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 bg-[#f5f6f8] overflow-y-auto">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab 
                        ? 'text-blue-600 border-b-2 border-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <Filter className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">YLKER</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Good Evening Christine Spalding</h2>
                    <p className="text-gray-600">Have a productive day!</p>
                  </div>
                </div>
                <Moon className="w-8 h-8 text-gray-400" />
              </div>
              <blockquote className="mt-4 pl-4 border-l-4 border-gray-300 italic text-gray-600">
                "Don't let what you cannot do interfere with what you can do." - Margaret Thatcher
              </blockquote>
            </div>

            {/* Activity Feed Cards */}
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    {activity.avatar ? (
                      <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                        <img src={activity.avatar} alt={activity.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-red-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-600">
                        {activity.description.includes('Timesheet') ? (
                          <>has made a request for <span className="font-semibold">Timesheet</span></>
                        ) : (
                          activity.description
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.type === 'timesheet' ? 'Raised on' : 'Total Hours'}
                      </p>
                      <p className="text-sm font-medium text-gray-700">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Work Schedule Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Work Schedule</h3>
                  <p className="text-sm text-gray-600">26-May-2024 → 01-Jun-2024</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-teal-500">
                <p className="font-medium text-gray-900">Full day shift</p>
                <p className="text-sm text-gray-600">9:00 AM - 6:00 PM</p>
              </div>

              {/* Weekly Calendar View */}
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center">
                    <p className="text-xs text-gray-500 mb-1">{day.day}</p>
                    <div className={`relative rounded-lg p-2 ${
                      day.type === 'active' ? 'bg-blue-500 text-white' :
                      day.type === 'weekend' ? 'bg-orange-100 text-orange-600' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      <p className="text-sm font-medium">{day.date}</p>
                      {day.status && (
                        <p className="text-xs mt-1">{day.status}</p>
                      )}
                      {day.hours && (
                        <p className="text-xs mt-1">{day.hours}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Holidays Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <Umbrella className="w-5 h-5 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Upcoming Holidays</h3>
                </div>
                <button className="text-teal-600 text-sm font-medium hover:text-teal-700">
                  View all
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto">
                {holidays.map((holiday, index) => (
                  <div key={index} className={`flex-shrink-0 rounded-lg p-4 border ${
                    holiday.type === 'restricted' 
                      ? 'bg-amber-50 border-amber-200' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <h4 className="font-medium text-gray-900 text-sm">{holiday.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{holiday.date}</p>
                    {holiday.type === 'restricted' && (
                      <p className="text-xs text-amber-600 mt-1">Restricted holiday</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Right Side Elements */}
        <div className="relative">
          <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-5 h-5" />
          </button>
          <button className="absolute bottom-4 right-4 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Bottom Bar */}
      <footer className="bg-white border-t border-gray-200 h-12 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
            <div className="w-6 h-6 bg-green-500 rounded-full"></div>
            <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
          </div>
          <span className="text-sm text-gray-600">Here is your Smart Chat (Ctrl+Space)</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Metric indicators */}
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        </div>
      </footer>
    </div>
  );
};

export default HRMDashboard;
