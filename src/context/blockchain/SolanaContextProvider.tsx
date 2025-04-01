
import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { SolanaContext } from './SolanaContext';
import { useToast } from '@/components/ui/use-toast';

export const SolanaContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signMessage: walletSignMessage, connected, disconnect, connecting } = useWallet();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Fetch balance when wallet is connected or publicKey changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        try {
          setIsLoading(true);
          const walletBalance = await connection.getBalance(publicKey);
          setBalance(walletBalance / 1000000000); // Convert lamports to SOL
        } catch (error) {
          console.error('Failed to fetch balance:', error);
          toast({
            title: 'Balance Error',
            description: 'Failed to fetch your wallet balance.',
            variant: 'destructive',
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setBalance(0);
      }
    };

    fetchBalance();
  }, [publicKey, connection, toast]);

  // Wrap signMessage to return the expected format
  const signMessage = async (message: Uint8Array): Promise<{ signature: Uint8Array }> => {
    if (!walletSignMessage) {
      throw new Error('Wallet does not support message signing');
    }
    
    const signature = await walletSignMessage(message);
    return { signature };
  };

  // Connect wallet function
  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // This is a placeholder - the actual connection is handled by Wallet Adapter
      console.log("Attempting to connect wallet...");
      // The actual connection UI is shown by the WalletMultiButton component
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect your wallet.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Placeholder functions for blockchain operations
  const mintAchievementNFT = async (achievementData: any): Promise<string | null> => {
    // Implementation would go here in a real app
    console.log("Minting achievement NFT:", achievementData);
    return "simulated-transaction-id";
  };

  const processPayment = async (amount: number, description: string): Promise<boolean> => {
    // Implementation would go here in a real app
    console.log(`Processing payment of ${amount} SOL for: ${description}`);
    return true;
  };

  const sendTokenReward = async (amount: number): Promise<boolean> => {
    // Implementation would go here in a real app
    console.log(`Sending token reward of ${amount}`);
    return true;
  };

  return (
    <SolanaContext.Provider
      value={{
        publicKey,
        balance,
        sendTransaction,
        signMessage,
        connected,
        disconnect,
        isLoading,
        mintAchievementNFT,
        processPayment,
        sendTokenReward,
        connectWallet,
        isConnecting: isConnecting || connecting,
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};
