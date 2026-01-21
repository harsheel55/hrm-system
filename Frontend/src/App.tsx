import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Employees from './pages/dashboard/Employees';
import Attendance from './pages/dashboard/Attendance';
import Payroll from './pages/dashboard/Payroll';
import Recruitment from './pages/dashboard/Recruitment';
import Shift from './pages/dashboard/Shift';
import Documents from './pages/dashboard/Documents';
import Leave from './pages/dashboard/Leave';
import Timesheet from './pages/dashboard/Timesheet';
import Analytics from './pages/dashboard/Analytics';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="shift" element={<Shift />} />
          <Route path="documents" element={<Documents />} />
          <Route path="leave" element={<Leave />} />
          <Route path="timesheet" element={<Timesheet />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
