
import { createContext } from 'react';
import { AuthContextType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export * from './AuthProvider'; // Re-export from AuthProvider
