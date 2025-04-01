
export interface SolanaContextType {
  isConnecting: boolean;
  setIsConnecting: (connecting: boolean) => void;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => Promise<boolean>;
}
