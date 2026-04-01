import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Employees from './pages/dashboard/Employees';
import Attendance from './pages/dashboard/Attendance';
import Payroll from './pages/dashboard/Payroll';
import Recruitment from './pages/dashboard/Recruitment';
import { ShiftPlanner as Shift } from './pages/dashboard/Shift';
import Documents from './pages/dashboard/Documents';
import { LeaveManagement as Leave } from './pages/dashboard/Leave';
import Timesheet from './pages/dashboard/Timesheet';
import Analytics from './pages/dashboard/Analytics';
import OrganizationTree from './pages/dashboard/OrganizationTree';
import EmployeeOverview from './pages/employee/EmployeeOverview';
import EmployeeProfile from './pages/employee/EmployeeProfile';
import EmployeeAttendancePage from './pages/employee/EmployeeAttendancePage';
import EmployeeLeavePage from './pages/employee/EmployeeLeavePage';
import { TooltipProvider } from '@/components/ui/tooltip';

// Super Admin Imports
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';
import RoleManagementPage from './pages/admin/RoleManagementPage';
import UserRightsPage from './pages/admin/UserRightsPage';
import MenuManagementPage from './pages/admin/MenuManagementPage';
import BlogManagementPage from './pages/admin/BlogManagementPage';
import BlogCategoryPage from './pages/admin/BlogCategoryPage';
import BlogTagPage from './pages/admin/BlogTagPage';

function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
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

          {/* Super Admin Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="roles" element={<RoleManagementPage />} />
              <Route path="rights" element={<UserRightsPage />} />
              <Route path="menus" element={<MenuManagementPage />} />
              <Route path="blogs" element={<BlogManagementPage />} />
              <Route path="blog-categories" element={<BlogCategoryPage />} />
              <Route path="blog-tags" element={<BlogTagPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
}

export default App;
