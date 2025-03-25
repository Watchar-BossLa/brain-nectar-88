
import React, { useCallback, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { SolanaContext } from './SolanaContext';
import { AchievementData } from './types';
import { toast } from '@/components/ui/use-toast';

export const SolanaContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey, connected, connecting, select, wallet } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  const connectWallet = useCallback(() => {
    if (!connected && !connecting) {
      // Open the wallet modal which handles selection properly
      select();
    }
  }, [connected, connecting, select]);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) return null;
    
    try {
      const lamports = await connection.getBalance(publicKey);
      const solBalance = lamports / LAMPORTS_PER_SOL;
      setBalance(solBalance);
      return solBalance;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return null;
    }
  }, [connection, publicKey]);

  // Mock implementation for NFT minting - would need to be implemented with Metaplex
  const mintAchievementNFT = useCallback(async (achievementData: AchievementData): Promise<string | null> => {
    if (!publicKey || !connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint an NFT",
        variant: "destructive"
      });
      return null;
    }

    try {
      // This is a placeholder - real implementation would use Metaplex to mint NFTs
      console.log(`Minting NFT for ${achievementData.title}`);
      
      // Mock successful mint with a fake transaction ID
      const txId = `mock_tx_${Date.now().toString(16)}`;
      
      toast({
        title: "Achievement NFT Minted!",
        description: `Your achievement "${achievementData.title}" has been minted as an NFT on Solana.`,
      });
      
      return txId;
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: "NFT Minting Failed",
        description: "There was an error minting your achievement NFT.",
        variant: "destructive"
      });
      return null;
    }
  }, [connected, publicKey]);

  // Mock implementation for token rewards
  const sendTokenReward = useCallback(async (amount: number): Promise<boolean> => {
    if (!publicKey || !connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to receive rewards",
        variant: "destructive"
      });
      return false;
    }

    try {
      // This is a placeholder - real implementation would send tokens
      console.log(`Sending ${amount} STUDY tokens to ${publicKey.toString()}`);
      
      toast({
        title: "Study Rewards Received!",
        description: `You've received ${amount} STUDY tokens for your achievement.`,
      });
      
      return true;
    } catch (error) {
      console.error('Error sending token reward:', error);
      toast({
        title: "Reward Failed",
        description: "There was an error sending your token rewards.",
        variant: "destructive"
      });
      return false;
    }
  }, [connected, publicKey]);

  // Mock implementation for payments
  const processPayment = useCallback(async (amount: number, description: string): Promise<boolean> => {
    if (!publicKey || !connected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to make a payment",
        variant: "destructive"
      });
      return false;
    }

    if (balance === null || balance < amount) {
      toast({
        title: "Insufficient Balance",
        description: `You need at least ${amount} SOL for this payment.`,
        variant: "destructive"
      });
      return false;
    }

    try {
      // This is a placeholder - real implementation would create a transaction
      console.log(`Processing payment of ${amount} SOL for ${description}`);
      
      toast({
        title: "Payment Successful",
        description: `Your payment of ${amount} SOL for ${description} has been processed.`,
      });
      
      // Update balance after payment
      fetchBalance();
      
      return true;
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment.",
        variant: "destructive"
      });
      return false;
    }
  }, [connected, publicKey, balance, fetchBalance]);

  // Fetch balance whenever the wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
    }
  }, [connected, publicKey, fetchBalance]);

  const value = {
    connected,
    publicKey,
    balance,
    connectWallet,
    isConnecting: connecting,
    fetchBalance,
    mintAchievementNFT,
    sendTokenReward,
    processPayment
  };

  return <SolanaContext.Provider value={value}>{children}</SolanaContext.Provider>;
};
