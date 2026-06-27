import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg-l0">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-slate-500 font-semibold animate-pulse uppercase tracking-wider">Verifying Session State...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // If not authenticated, redirect to landing page instead of login screen, 
    // retaining the path and intent.
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
export default ProtectedRoute;
