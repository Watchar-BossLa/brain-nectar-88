import React, { createContext, useContext } from 'react';

/**
 * @typedef {import('./types').AuthContextType} AuthContextType
 */

/**
 * Auth context for managing authentication state
 * @type {React.Context<AuthContextType|undefined>}
 */
const AuthContext = createContext(undefined);

/**
 * Hook for accessing auth context
 * @returns {AuthContextType} Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };
