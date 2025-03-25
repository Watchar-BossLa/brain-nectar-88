
import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // If authentication is done loading and user is not authenticated,
    // redirect to sign in with the return path
    if (!loading && !user) {
      navigate('/signin', {
        state: { from: location.pathname }
      });
    }
  }, [user, loading, navigate, location]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Render children if authenticated
  return user ? <>{children}</> : null;
};

export default ProtectedRoute;
