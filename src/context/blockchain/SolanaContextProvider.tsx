
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { SolanaContext } from './SolanaContext';
import { useToast } from '@/hooks/use-toast';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';

// Define props interface
interface SolanaContextProviderProps {
  children: ReactNode;
}

export const SolanaContextProvider: FC<SolanaContextProviderProps> = ({ children }) => {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  
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
            connecting,
            setConnecting,
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
            }
          }}
        >
          {children}
        </SolanaContext.Provider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
