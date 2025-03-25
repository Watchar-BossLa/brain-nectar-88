import React, { useCallback, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { SolanaContext } from './SolanaContext';
import { AchievementData } from './types';
import { toast } from '@/components/ui/use-toast';
import { Metaplex, walletAdapterIdentity, bundlrStorage } from '@metaplex-foundation/js';

export const SolanaContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey, connected, connecting, select, wallet } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [metaplex, setMetaplex] = useState<Metaplex | null>(null);

  useEffect(() => {
    if (connection && publicKey) {
      const metaplexInstance = Metaplex.make(connection)
        .use(walletAdapterIdentity(wallet?.adapter))
        .use(bundlrStorage());
      
      setMetaplex(metaplexInstance);
    }
  }, [connection, publicKey, wallet]);

  const connectWallet = useCallback(() => {
    if (!connected && !connecting) {
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

  const mintAchievementNFT = useCallback(async (achievementData: AchievementData): Promise<string | null> => {
    if (!publicKey || !connected || !metaplex) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint an NFT",
        variant: "destructive"
      });
      return null;
    }

    try {
      toast({
        title: "Minting Achievement NFT",
        description: "Please wait while your NFT is being minted...",
      });

      console.log(`Creating NFT for ${achievementData.title}`);
      
      const { uri } = await metaplex.nfts().uploadMetadata({
        name: achievementData.title,
        description: achievementData.description,
        image: achievementData.imageUrl,
        properties: {
          qualification: achievementData.qualification,
          completedDate: achievementData.completedDate
        }
      });
      
      const { nft } = await metaplex.nfts().create({
        uri: uri,
        name: achievementData.title,
        sellerFeeBasisPoints: 0,
      });
      
      const txId = nft.mintAddress.toString();
      
      toast({
        title: "Achievement NFT Minted!",
        description: `Your achievement "${achievementData.title}" has been minted as an NFT on Solana.`,
      });
      
      return txId;
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: "NFT Minting Failed",
        description: error.message || "There was an error minting your achievement NFT.",
        variant: "destructive"
      });
      return null;
    }
  }, [connected, publicKey, metaplex]);

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
      console.log(`Processing payment of ${amount} SOL for ${description}`);
      
      toast({
        title: "Payment Successful",
        description: `Your payment of ${amount} SOL for ${description} has been processed.`,
      });
      
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
