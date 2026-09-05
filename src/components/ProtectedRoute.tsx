import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

const ProtectedRoute = ({ children, requireProfile = false }: ProtectedRouteProps) => {
  const { user, loading, checkProfileCompletion } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(requireProfile);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (requireProfile && user) {
        const isComplete = await checkProfileCompletion();
        setHasProfile(isComplete);
        setCheckingProfile(false);
      }
    };
    checkProfile();
  }, [user, requireProfile, checkProfileCompletion]);

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background/80">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireProfile && !hasProfile) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
