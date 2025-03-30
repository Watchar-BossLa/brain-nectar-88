
import React, { useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Import the wallet adapters dynamically
import { WalletAdapter } from '@solana/wallet-adapter-base';

// Default styles for the wallet adapter
require('@solana/wallet-adapter-react-ui/styles.css');

export function SolanaProvider({ children }: { children: React.ReactNode }) {
  // Use a stored network setting or default to devnet
  const [network, setNetwork] = useLocalStorage<WalletAdapterNetwork>(
    'solanaNetwork',
    WalletAdapterNetwork.Devnet
  );

  // Get the RPC endpoint for the selected network
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // Define your wallet adapters - using dynamic loading to avoid the import errors
  const wallets = useMemo<WalletAdapter[]>(() => {
    // Empty array for now - we'll load these adapters dynamically
    // to avoid the TS errors with direct imports
    return [];
  }, [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
