
import React, { FC, ReactNode, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { SolanaContext } from './SolanaContext';
import { AchievementData } from './types';
import { useToast } from '@/hooks/use-toast';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';

// Define props interface
interface SolanaContextProviderProps {
  children: ReactNode;
}

export const SolanaContextProvider: FC<SolanaContextProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Wallets that you want to support
  const wallets = [
    new PhantomWalletAdapter(),
  ];
  
  // Solana network configuration - using devnet for development
  const endpoint = 'https://api.devnet.solana.com';

  // Create a wrapper that uses proper providers
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <SolanaContext.Provider 
          value={{ 
            isConnecting,
            setIsConnecting,
            // Mock implementations for required properties
            connected: false,
            publicKey: null as PublicKey | null,
            balance: null,
            // Provide fallback methods that show appropriate messages
            connectWallet: async () => {
              toast({
                title: "Wallet Connection",
                description: "Please use the wallet button in the header to connect your wallet.",
              });
              return false;
            },
            disconnectWallet: async () => {
              toast({
                title: "Wallet Connection",
                description: "Please use the wallet button in the header to disconnect your wallet.",
              });
              return false;
            },
            fetchBalance: async () => {
              toast({
                title: "Wallet Operation",
                description: "Balance fetching is not available in this context.",
              });
              return null;
            },
            mintAchievementNFT: async (_achievementData: AchievementData) => {
              toast({
                title: "NFT Operation",
                description: "NFT minting is not available in this context.",
              });
              return null;
            },
            sendTokenReward: async (_amount: number) => {
              toast({
                title: "Token Operation",
                description: "Token rewards are not available in this context.",
              });
              return false;
            },
            processPayment: async (_amount: number, _description: string) => {
              toast({
                title: "Payment Operation",
                description: "Payments are not available in this context.",
              });
              return false;
            }
          }}
        >
          {children}
        </SolanaContext.Provider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
