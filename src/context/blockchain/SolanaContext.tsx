
import { createContext, useContext } from 'react';
import { PublicKey } from '@solana/web3.js';

export interface SolanaContextType {
  publicKey: PublicKey | null;
  balance: number;
  connected: boolean;
  disconnect: () => Promise<void>;
  isLoading: boolean;
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  sendTransaction?: any; // Add missing sendTransaction property
}

export const SolanaContext = createContext<SolanaContextType>({
  publicKey: null,
  balance: 0,
  connected: false,
  disconnect: async () => {},
  isLoading: false,
});

export const useSolana = () => useContext(SolanaContext);
