
import { createContext, useContext } from 'react';
import { PublicKey } from '@solana/web3.js';

export interface SolanaContextType {
  publicKey: PublicKey | null;
  balance: number;
  connected: boolean;
  disconnect: () => Promise<void>;
  isLoading: boolean;
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  sendTransaction?: any;
  
  // Missing properties that components are trying to use
  mintAchievementNFT?: (achievementData: any) => Promise<string | null>;
  processPayment?: (amount: number, description: string) => Promise<boolean>;
  sendTokenReward?: (amount: number) => Promise<boolean>;
  connectWallet?: () => Promise<void>;
  isConnecting?: boolean;
}

export const SolanaContext = createContext<SolanaContextType>({
  publicKey: null,
  balance: 0,
  connected: false,
  disconnect: async () => {},
  isLoading: false,
});

export const useSolana = () => useContext(SolanaContext);
