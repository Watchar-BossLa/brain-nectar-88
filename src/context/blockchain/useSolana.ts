
import { useContext } from 'react';
import { SolanaContext } from './SolanaContext';

export const useSolana = () => useContext(SolanaContext);
