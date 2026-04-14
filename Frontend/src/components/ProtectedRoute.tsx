import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  const isEmployeePath = location.pathname.startsWith('/employee');
  const isHRPath = location.pathname.startsWith('/dashboard');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isHRUser = user?.role === 'HR';
  const isHR = user?.roleName === 'HR';
  const isEmployee = user?.roleName === 'Employee';

  if (isHRPath && !isHRUser && !isHR) {
    return <Navigate to="/login" replace />;
  }

  if (isEmployeePath && !isEmployee) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
export { ProtectedRoute };
