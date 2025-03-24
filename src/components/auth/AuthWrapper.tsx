
import React from 'react';
import { useAuth } from '@/context/AuthContext';

type AuthWrapperProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const AuthenticatedOnly = ({ children, fallback }: AuthWrapperProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};

export const UnauthenticatedOnly = ({ children, fallback }: AuthWrapperProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (user) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};
