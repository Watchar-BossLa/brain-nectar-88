
import React, { useState } from 'react';
import { SolanaContext } from './SolanaContext';

export function SolanaContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // This is a mock implementation of the Solana context
  const contextValue = {
    publicKey: null,
    balance: 0,
    connected: false,
    disconnect: async () => {
      console.log('Mock disconnect called');
      return true;
    },
    isLoading: false,
    isConnecting: isConnecting,
    signMessage: async (message: Uint8Array) => {
      console.log('Mock sign message called');
      return { signature: new Uint8Array(0) };
    },
    sendTransaction: async () => {
      console.log('Mock send transaction called');
      return 'mock-transaction-signature';
    },
    mintAchievementNFT: async (achievementData: any) => {
      console.log('Mock mint achievement NFT called', achievementData);
      return 'mock-nft-signature';
    },
    processPayment: async (amount: number, description: string) => {
      console.log(`Mock process payment called: ${amount} SOL for ${description}`);
      return true;
    },
    sendTokenReward: async (amount: number) => {
      console.log(`Mock send token reward called: ${amount} tokens`);
      return true;
    },
    connectWallet: async () => {
      setIsConnecting(true);
      try {
        console.log('Mock connect wallet called');
        // Simulate connection delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } finally {
        setIsConnecting(false);
      }
    }
  };

  return (
    <SolanaContext.Provider value={contextValue}>
      {children}
    </SolanaContext.Provider>
  );
}
