
import { createContext } from 'react';
import { SolanaContextType } from './types';

export const SolanaContext = createContext<SolanaContextType | undefined>(undefined);
