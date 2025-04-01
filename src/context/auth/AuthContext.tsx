
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './types';

// Create the context but don't export a useAuth hook from this file
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Only export the context itself
export { AuthContext };
