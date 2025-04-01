
import React, { useState } from 'react';
import { SolanaContext } from './SolanaContext';

export function SolanaContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  
  // This is a temporary mock implementation until we properly set up blockchain functionality
  const contextValue = {
    publicKey: null,
    balance: 0,
    connected: false,
    disconnect: async () => {},
    isLoading: false
  };

  return (
    <SolanaContext.Provider value={contextValue}>
      {children}
    </SolanaContext.Provider>
  );
}
