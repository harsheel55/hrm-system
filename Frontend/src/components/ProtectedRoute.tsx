<<<<<<< HEAD
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
=======
import { authStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  if (!authStore.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
>>>>>>> f3aa6659ac8e2b3bad09505ba5a3258b75b89903
