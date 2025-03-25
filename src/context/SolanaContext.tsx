
import React, { useCallback, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { createContext, useContext } from 'react';
import { toast } from '@/components/ui/use-toast';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

interface SolanaContextType {
  connected: boolean;
  publicKey: PublicKey | null;
  balance: number | null;
  connectWallet: () => void;
  isConnecting: boolean;
  fetchBalance: () => Promise<number | null>;
  mintAchievementNFT: (achievementData: AchievementData) => Promise<string | null>;
  sendTokenReward: (amount: number) => Promise<boolean>;
  processPayment: (amount: number, description: string) => Promise<boolean>;
}

interface AchievementData {
  title: string;
  description: string;
  imageUrl: string;
  qualification: string;
  completedDate: string;
}

const SolanaContext = createContext<SolanaContextType | undefined>(undefined);

export const useSolana = () => {
  const context = useContext(SolanaContext);
  if (context === undefined) {
    throw new Error('useSolana must be used within a SolanaProvider');
  }
  return context;
};

export const SolanaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SolanaContextProvider>
            {children}
          </SolanaContextProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const SolanaContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey, connected, connecting, select } = useWallet();
  const [balance, setBalance] = React.useState<number | null>(null);

  const connectWallet = useCallback(() => {
    if (!connected && !connecting) {
      select('phantom');
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
  React.useEffect(() => {
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
