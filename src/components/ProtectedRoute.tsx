import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'founder' | 'investor';
  requireCompleteProfile?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  requireCompleteProfile = false 
}: ProtectedRouteProps) => {
  const { 
    user, 
    loading: authLoading, 
    profile, 
    isFounder, 
    isInvestor,
    hasCompleteStartupProfile 
  } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If no profile exists, redirect to auth (this shouldn't happen after proper signup)
  if (!profile) {
    return <Navigate to="/auth" replace />;
  }

  // Role-based access control
  if (requiredRole) {
    if (requiredRole === 'founder' && !isFounder) {
      return <Navigate to="/upload" replace />;
    }
    if (requiredRole === 'investor' && !isInvestor) {
      return <Navigate to="/complete-profile" replace />;
    }
  }

  // For founders accessing dashboard: redirect to complete-profile if no startup profile exists
  if (isFounder && !hasCompleteStartupProfile && location.pathname === '/dashboard') {
    return <Navigate to="/complete-profile" replace />;
  }

  // For complete-profile page: only allow founders
  if (location.pathname === '/complete-profile' && !isFounder) {
    return <Navigate to="/upload" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
