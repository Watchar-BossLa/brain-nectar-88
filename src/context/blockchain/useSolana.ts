
import { useContext } from 'react';
import { SolanaContext } from './SolanaContext';

export const useSolana = () => {
  const context = useContext(SolanaContext);
  if (context === undefined) {
    throw new Error('useSolana must be used within a SolanaProvider');
  }
  return context;
};
