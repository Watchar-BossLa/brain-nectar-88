
import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { 
  PhantomWalletAdapter, 
  SolflareWalletAdapter 
} from '@solana/wallet-adapter-wallets';

// Import the styles directly with import statement instead of require
import '@solana/wallet-adapter-react-ui/styles.css';

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  // Use a stored network setting or default to devnet
  const [network, setNetwork] = useLocalStorage<WalletAdapterNetwork>(
    'solanaNetwork',
    WalletAdapterNetwork.Devnet
  );

  // Get the RPC endpoint for the selected network
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Define wallet adapters properly with ES modules syntax
  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
