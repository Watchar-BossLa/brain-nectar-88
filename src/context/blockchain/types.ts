
import { PublicKey } from '@solana/web3.js';

export interface AchievementData {
  title: string;
  description: string;
  imageUrl: string;
  qualification: string;
  completedDate: string;
}

export interface SolanaContextType {
  connected: boolean;
  publicKey: PublicKey | null;
  balance: number | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  fetchBalance: () => Promise<number | null>;
  mintAchievementNFT: (achievementData: AchievementData) => Promise<string | null>;
  sendTokenReward: (amount: number) => Promise<boolean>;
  processPayment: (amount: number, description: string) => Promise<boolean>;
}
