
import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth'; // Updated import path
import { MultiAgentSystem } from '@/services/agents';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // Initialize the multi-agent system when a user signs in
  useEffect(() => {
    if (user && !loading) {
      console.log('Auth wrapper initializing multi-agent system for user:', user.id);
      
      MultiAgentSystem.initialize(user.id)
        .then(() => {
          console.log('Multi-agent system initialized successfully');
        })
        .catch(error => {
          console.error('Error initializing multi-agent system:', error);
        });
    }
  }, [user, loading]);

  return <>{children}</>;
};

export default AuthWrapper;
