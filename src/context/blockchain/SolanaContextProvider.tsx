
import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { SolanaContext } from './SolanaContext';
import { useToast } from '@/components/ui/use-toast';

export const SolanaContextProvider = ({ children }: { children: React.ReactNode }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signMessage, connected, disconnect } = useWallet();
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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
      }}
    >
      {children}
    </SolanaContext.Provider>
  );
};
