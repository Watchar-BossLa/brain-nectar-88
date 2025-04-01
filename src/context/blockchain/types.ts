
import { PublicKey } from '@solana/web3.js';

export interface SolanaContextType {
  publicKey: PublicKey | null;
  balance: number;
  connected: boolean;
  disconnect: () => Promise<void>;
  isLoading: boolean;
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  sendTransaction?: any;
  mintAchievementNFT?: (achievementData: any) => Promise<string | null>;
  processPayment?: (amount: number, description: string) => Promise<boolean>;
  sendTokenReward?: (amount: number) => Promise<boolean>;
  connectWallet?: () => Promise<void>;
  isConnecting?: boolean;
}

export interface AchievementData {
  title: string;
  description: string;
  imageUrl: string;
  qualification: string;
  completedDate: string;
}
