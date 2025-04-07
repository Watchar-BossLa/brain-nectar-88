import { useContext } from 'react';
import { SolanaContext } from './SolanaContext';

/**
 * Hook for accessing Solana context
 * @returns {import('./types').SolanaContextType} Solana context
 */
export const useSolana = () => {
  const context = useContext(SolanaContext);
  if (context === undefined) {
    throw new Error('useSolana must be used within a SolanaProvider');
  }
  return context;
};
