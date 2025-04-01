
import React, { createContext, useContext } from 'react';
import { AuthContextType, PLATFORM_OWNER } from './auth/types';

// Create the auth context with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  isAdmin: false
});

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Re-export the platform owner
export { PLATFORM_OWNER };
