
import { createContext } from 'react';
import { SolanaContextType } from './types';

// Create and export the context
export const SolanaContext = createContext<SolanaContextType | undefined>(undefined);
