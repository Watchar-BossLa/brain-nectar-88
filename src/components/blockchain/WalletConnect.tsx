
import React from 'react';
import { useSolana } from '@/context/SolanaContext';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Wallet } from 'lucide-react';

export const WalletConnect: React.FC = () => {
  const { connected, balance, connectWallet } = useSolana();
  
  return (
    <div className="flex items-center gap-2">
      {connected && balance !== null ? (
        <div className="text-sm mr-2">
          <span className="text-muted-foreground">Balance:</span> {balance.toFixed(4)} SOL
        </div>
      ) : null}
      
      <WalletMultiButton className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors" />
    </div>
  );
};

export const SimpleWalletButton: React.FC = () => {
  const { connected, connectWallet } = useSolana();
  
  return (
    <Button 
      onClick={connectWallet} 
      variant="outline" 
      className="flex items-center gap-2"
    >
      <Wallet className="h-4 w-4" />
      {connected ? 'Wallet Connected' : 'Connect Wallet'}
    </Button>
  );
};
