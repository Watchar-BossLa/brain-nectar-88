
import React, { useState } from 'react';
import { SolanaContext } from './SolanaContext';
import { AchievementData } from './types';
import { PublicKey } from '@solana/web3.js';
import { mintAchievement, createSimulatedPublicKey, fetchWalletBalance } from '@/lib/blockchain-stubs';
import { useToast } from '@/components/ui/use-toast';

interface SolanaContextProviderProps {
  children: React.ReactNode;
}

export const SolanaContextProvider: React.FC<SolanaContextProviderProps> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const { toast } = useToast();

  // Connect wallet functionality
  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const simulatedPublicKey = createSimulatedPublicKey();
      setPublicKey(simulatedPublicKey);
      
      const balanceValue = await fetchWalletBalance();
      setBalance(balanceValue);
      
      setConnected(true);
      
      toast({
        title: "Wallet Connected",
        description: "Your Solana wallet has been successfully connected.",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      
      toast({
        title: "Connection Failed",
        description: "There was a problem connecting your wallet. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Fetch balance
  const fetchBalance = async (): Promise<number | null> => {
    if (!connected) return null;
    
    try {
      const balanceValue = await fetchWalletBalance();
      setBalance(balanceValue);
      return balanceValue;
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      return balance;
    }
  };

  // Mint NFT achievement
  const mintAchievementNFT = async (achievementData: AchievementData): Promise<string | null> => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to mint an NFT.",
        variant: "destructive"
      });
      throw new Error("Wallet not connected");
    }
    
    try {
      const txId = await mintAchievement(achievementData);
      
      if (txId) {
        toast({
          title: "Achievement Minted",
          description: `Your ${achievementData.title} achievement has been minted as an NFT.`,
        });
      }
      
      return txId;
    } catch (error) {
      console.error("Failed to mint achievement:", error);
      
      toast({
        title: "Minting Failed",
        description: "There was a problem minting your achievement NFT. Please try again.",
        variant: "destructive"
      });
      
      return null;
    }
  };

  // Send token reward
  const sendTokenReward = async (amount: number): Promise<boolean> => {
    if (!connected) return false;
    
    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Rewards Sent",
        description: `${amount} STUDY tokens have been sent to your wallet.`,
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to send ${amount} tokens:`, error);
      
      toast({
        title: "Transaction Failed",
        description: "There was a problem sending your rewards. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Process payment
  const processPayment = async (amount: number, description: string): Promise<boolean> => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a payment.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update balance after payment
      const newBalance = balance ? balance - amount : null;
      setBalance(newBalance);
      
      toast({
        title: "Payment Successful",
        description: `You have successfully paid ${amount} SOL for ${description}.`,
      });
      
      return true;
    } catch (error) {
      console.error(`Failed to process payment of ${amount} SOL:`, error);
      
      toast({
        title: "Payment Failed",
        description: "There was a problem processing your payment. Please try again.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const value = {
    connected,
    isConnecting,
    publicKey,
    balance,
    connectWallet,
    fetchBalance,
    mintAchievementNFT,
    sendTokenReward,
    processPayment
  };

  return (
    <SolanaContext.Provider value={value}>
      {children}
    </SolanaContext.Provider>
  );
};
