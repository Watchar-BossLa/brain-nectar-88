
import React, { useState } from 'react';
import { SolanaContext } from './SolanaContext';
import type { SolanaContextType, AchievementData } from './types';

export const SolanaContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock disconnect function that returns void as required by the type
  const disconnect = async (): Promise<void> => {
    setPublicKey(null);
    setBalance(0);
    setConnected(false);
    // Return void
  };
  
  // Mock sign message function
  const signMessage = async (message: Uint8Array) => {
    console.log("Signing message:", message);
    return {
      signature: new Uint8Array(64) // Mock signature
    };
  };
  
  // Mock send transaction function
  const sendTransaction = async (transaction: any) => {
    console.log("Sending transaction:", transaction);
    return "mock-signature";
  };
  
  // Mock mint achievement NFT function
  const mintAchievementNFT = async (achievementData: AchievementData): Promise<string | null> => {
    console.log("Minting achievement NFT:", achievementData);
    return "mock-nft-address";
  };
  
  // Mock process payment function
  const processPayment = async (amount: number, description: string): Promise<boolean> => {
    console.log(`Processing payment of ${amount} for: ${description}`);
    return true;
  };
  
  // Mock send token reward function
  const sendTokenReward = async (amount: number): Promise<boolean> => {
    console.log(`Sending token reward of ${amount}`);
    return true;
  };
  
  // Mock connect wallet function
  const connectWallet = async (): Promise<void> => {
    setIsConnecting(true);
    
    try {
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPublicKey({ toBase58: () => "mock-wallet-address" });
      setBalance(100);
      setConnected(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };
  
  const contextValue: SolanaContextType = {
    publicKey,
    balance,
    connected,
    disconnect,
    isLoading,
    signMessage,
    sendTransaction,
    mintAchievementNFT,
    processPayment,
    sendTokenReward,
    connectWallet,
    isConnecting
  };
  
  return (
    <SolanaContext.Provider value={contextValue}>
      {children}
    </SolanaContext.Provider>
  );
};

export default SolanaContextProvider;
