
import React, { createContext, useContext, useState } from 'react';

// Define context types
interface SolanaContextType {
  connected: boolean;
  publicKey: string | null;
  balance: number | null;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendTransaction: (recipient: string, amount: number) => Promise<string>;
}

// Create the context
const SolanaContext = createContext<SolanaContextType | undefined>(undefined);

// Provider component
export const SolanaContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);

  // Mock implementation of wallet functionality
  const connect = async () => {
    try {
      setConnecting(true);
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPublicKey("SimulatedWalletPubkey123456789");
      setBalance(10.5); // Simulated SOL balance
      setConnected(true);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    setConnected(false);
    setPublicKey(null);
    setBalance(null);
    return Promise.resolve();
  };

  const sendTransaction = async (recipient: string, amount: number) => {
    if (!connected) {
      throw new Error("Wallet not connected");
    }
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 1000));
    const txId = `sim_tx_${Date.now()}`;
    console.log(`Sent ${amount} SOL to ${recipient}, txId: ${txId}`);
    return txId;
  };

  const value = {
    connected,
    publicKey,
    balance,
    connecting,
    connect,
    disconnect,
    sendTransaction
  };

  return (
    <SolanaContext.Provider value={value}>
      {children}
    </SolanaContext.Provider>
  );
};

// Custom hook to use solana context
export const useSolana = () => {
  const context = useContext(SolanaContext);
  if (context === undefined) {
    throw new Error("useSolana must be used within a SolanaProvider");
  }
  return context;
};
