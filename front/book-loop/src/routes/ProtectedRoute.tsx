import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute() {
  const { isAuthenticated, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) return null; 

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}

export function AdminRoute() {
  const { isAuthenticated, isAdmin, isAuthReady } = useAuth();
  const location = useLocation();

  if (!isAuthReady) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

