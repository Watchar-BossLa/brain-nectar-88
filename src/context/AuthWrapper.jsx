import React, { useEffect } from 'react';
import { useAuth } from './auth';
import { MultiAgentSystem } from '@/services/agents';

/**
 * Auth wrapper component that initializes the multi-agent system
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Auth wrapper component
 */
const AuthWrapper = ({ children }) => {
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
