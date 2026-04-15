import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Attendance from './pages/dashboard/Attendance';
import Payroll from './pages/dashboard/Payroll';
import Recruitment from './pages/dashboard/Recruitment';
import { ShiftPlanner as Shift } from './pages/dashboard/Shift';
import Documents from './pages/dashboard/Documents';
import { LeaveManagement as Leave } from './pages/dashboard/Leave';
import Analytics from './pages/dashboard/Analytics';
import OrganizationTree from './pages/dashboard/OrganizationTree';
import EmployeeOverview from './pages/employee/EmployeeOverview';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployeeAttendancePage from './pages/employee/EmployeeAttendancePage';
import EmployeeLeavePage from './pages/employee/EmployeeLeavePage';
import NotFound from './pages/NotFound';
import { TooltipProvider } from '@/components/ui/tooltip';

import UserManagementPage from './pages/admin/UserManagementPage';
 


function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="employees" element={<UserManagementPage />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="payroll" element={<Payroll />} />
              <Route path="recruitment" element={<Recruitment />} />
              <Route path="shift" element={<Shift />} />
              <Route path="documents" element={<Documents />} />
              <Route path="leave" element={<Leave />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="organization" element={<OrganizationTree />} />
            </Route>
          </Route>

          {/* Employee Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/employee" element={<DashboardLayout />}>
              <Route index element={<EmployeeOverview />} />
              <Route path="profile" element={<EmployeeProfile />} />
              <Route path="attendance" element={<EmployeeAttendancePage />} />
              <Route path="leave" element={<EmployeeLeavePage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
