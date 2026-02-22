import { authStore } from "@/store/authStore";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  if (!authStore.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
